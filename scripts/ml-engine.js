// ─── SYNCHRO ML ENGINE ───
// Uses TensorFlow.js for:
// 1. User embedding generation (activity + intent vectors)
// 2. Cosine similarity matching
// 3. Cold-start heuristics for new users
// 4. Trust score computation
// 5. Activity co-occurrence learning (baseline DB builder)
// Free APIs: TF.js (Apache 2.0), no external calls needed

const MLEngine = (() => {

  // ── ACTIVITY VOCABULARY ──
  // One-hot encoding index. Add new activities here to grow the model.
  const ACTIVITIES = [
    'Chess','Basketball','Yoga','Guitar','Coding','Painting','Running',
    'Cooking','Reading','Badminton','Photography','Dance','Swimming',
    'Cricket','Football','Tennis','Cycling','Hiking','Meditation','Music'
  ];
  const ACTIVITY_IDX = Object.fromEntries(ACTIVITIES.map((a, i) => [a, i]));
  const ACT_DIM = ACTIVITIES.length;

  // ── INTENT VOCABULARY ──
  const INTENTS = ['Compete', 'Learn', 'Teach', 'Casual'];
  const INTENT_IDX = Object.fromEntries(INTENTS.map((i, idx) => [i, idx]));
  const INT_DIM = INTENTS.length;

  // ── EMBEDDING DIMENSION ──
  // activity(20) + intent(4) + skill_avg(1) + reliability(1) + time_pref(3) = 29
  const EMB_DIM = ACT_DIM + INT_DIM + 1 + 1 + 3;

  // ── BASELINE CO-OCCURRENCE MATRIX ──
  // Tracks which activities tend to be done together
  // This IS the "baseline database" that grows from real user data
  const coMatrix = Array.from({ length: ACT_DIM }, () => new Array(ACT_DIM).fill(0));

  // ── SEED CO-OCCURRENCES (domain knowledge priors) ──
  // These seed the ML model before real users arrive (cold start baseline)
  const COOC_PRIORS = [
    ['Chess', 'Reading', 8], ['Chess', 'Coding', 6], ['Chess', 'Meditation', 4],
    ['Basketball', 'Running', 9], ['Basketball', 'Cricket', 7], ['Basketball', 'Football', 7],
    ['Yoga', 'Meditation', 10], ['Yoga', 'Running', 6], ['Yoga', 'Dance', 5],
    ['Guitar', 'Music', 9], ['Guitar', 'Dance', 5], ['Guitar', 'Painting', 4],
    ['Coding', 'Chess', 6], ['Coding', 'Reading', 7], ['Coding', 'Photography', 3],
    ['Running', 'Cycling', 8], ['Running', 'Swimming', 7], ['Running', 'Hiking', 8],
    ['Cooking', 'Reading', 5], ['Cooking', 'Photography', 6],
    ['Dance', 'Music', 8], ['Dance', 'Yoga', 5], ['Dance', 'Painting', 3],
    ['Swimming', 'Running', 7], ['Swimming', 'Cycling', 6],
    ['Cricket', 'Football', 7], ['Cricket', 'Basketball', 6],
    ['Photography', 'Painting', 7], ['Photography', 'Hiking', 6],
    ['Hiking', 'Cycling', 8], ['Hiking', 'Photography', 6],
    ['Badminton', 'Tennis', 7], ['Badminton', 'Cricket', 5],
    ['Tennis', 'Badminton', 7], ['Tennis', 'Running', 6],
    ['Meditation', 'Yoga', 10], ['Meditation', 'Reading', 6],
  ];

  function seedCoMatrix() {
    for (const [a, b, weight] of COOC_PRIORS) {
      const i = ACTIVITY_IDX[a], j = ACTIVITY_IDX[b];
      if (i !== undefined && j !== undefined) {
        coMatrix[i][j] += weight;
        coMatrix[j][i] += weight; // symmetric
      }
    }
  }
  seedCoMatrix();

  // ── USER PROFILE → EMBEDDING ──
  // Converts a user profile object into a normalized feature vector
  function profileToEmbedding(profile) {
    const vec = new Array(EMB_DIM).fill(0);

    // 1. Activity one-hot (multi-hot for multiple activities)
    const activities = profile.selectedActivities || [];
    for (const act of activities) {
      const idx = ACTIVITY_IDX[act];
      if (idx !== undefined) vec[idx] = 1;
    }

    // 2. Co-occurrence enrichment — boost related activities
    for (let i = 0; i < ACT_DIM; i++) {
      if (vec[i] === 1) {
        for (let j = 0; j < ACT_DIM; j++) {
          if (coMatrix[i][j] > 0) {
            vec[j] = Math.max(vec[j], coMatrix[i][j] / 10 * 0.3); // soft boost
          }
        }
      }
    }

    // 3. Intent one-hot
    const intentIdx = INTENT_IDX[profile.intent] ?? INTENT_IDX['Casual'];
    vec[ACT_DIM + intentIdx] = 1;

    // 4. Skill level (normalized 0–1: novice=0.25, intermediate=0.5, expert=1)
    const skillMap = { Novice: 0.25, Intermediate: 0.5, Expert: 1.0, Casual: 0.3, Teacher: 0.9 };
    vec[ACT_DIM + INT_DIM] = skillMap[profile.skillLevel] ?? 0.5;

    // 5. Reliability score (normalized)
    vec[ACT_DIM + INT_DIM + 1] = (profile.reliability ?? 80) / 100;

    // 6. Time preference (morning/afternoon/evening as soft flags)
    const pref = profile.timePreference || 'any';
    vec[ACT_DIM + INT_DIM + 2] = pref === 'morning' || pref === 'any' ? 0.8 : 0.2;
    vec[ACT_DIM + INT_DIM + 3] = pref === 'afternoon' || pref === 'any' ? 0.8 : 0.2;
    vec[ACT_DIM + INT_DIM + 4] = pref === 'evening' || pref === 'any' ? 0.8 : 0.2;

    return vec;
  }

  // ── COSINE SIMILARITY ──
  function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // ── PROXIMITY SCORE ──
  // Distance in km → score 0–1
  function proximityScore(distKm) {
    if (distKm <= 1) return 1.0;
    if (distKm <= 3) return 0.85;
    if (distKm <= 5) return 0.7;
    if (distKm <= 10) return 0.5;
    if (distKm <= 20) return 0.3;
    return 0.1;
  }

  // ── INTENT COMPATIBILITY ──
  // Some intent pairs are more compatible than others
  function intentCompatibility(intentA, intentB) {
    const compat = {
      'Compete-Compete': 1.0, 'Learn-Teach': 1.0, 'Teach-Learn': 1.0,
      'Casual-Casual': 0.9, 'Casual-Learn': 0.7, 'Casual-Compete': 0.6,
      'Learn-Learn': 0.6, 'Teach-Teach': 0.5,
      'Compete-Learn': 0.4, 'Compete-Casual': 0.5
    };
    return compat[`${intentA}-${intentB}`] ?? 0.5;
  }

  // ── COMPOSITE MATCH SCORE ──
  // Weighted blend: activity similarity + proximity + intent + trust
  function computeMatchScore(userA, userB, distKm = 2) {
    const embA = profileToEmbedding(userA);
    const embB = profileToEmbedding(userB);

    const activitySim = cosineSimilarity(embA, embB);  // 0–1
    const proxScore = proximityScore(distKm);            // 0–1
    const intentSim = intentCompatibility(userA.intent, userB.intent); // 0–1
    const trustBoost = ((userB.trustScore ?? 4.0) / 5.0) * 0.15;      // 0–0.15

    // Weighted sum
    const raw = (activitySim * 0.45) + (proxScore * 0.30) + (intentSim * 0.25) + trustBoost;
    // Clamp and convert to percentage
    return Math.min(Math.round(raw * 100), 99);
  }

  // ── ANTI-GHOSTING SCORE ──
  // Penalizes users who tend to not show up
  function antiGhostingPenalty(user) {
    const attendanceRate = user.attendance ?? 1.0;
    const responseRate = user.responseRate ?? 1.0;
    const avgResponseTime = user.avgResponseTimeMin ?? 10;
    return (attendanceRate * 0.5) + (responseRate * 0.3) + (Math.max(0, 1 - avgResponseTime / 60) * 0.2);
  }

  // ── TRUST SCORE COMPUTATION ──
  // Composite from: meetup attendance, vouches, feedback ratings, reports
  function computeTrustScore(userData) {
    const {
      meetupCount = 0,
      attendanceRate = 1.0,    // 0–1
      vouchCount = 0,
      avgRating = 5.0,          // 1–5
      reportCount = 0,
      isVerified = false
    } = userData;

    let score = 3.0; // base

    // Meetup history (log scale, caps at +1.0)
    score += Math.min(Math.log1p(meetupCount) * 0.25, 1.0);

    // Attendance (max +0.5)
    score += attendanceRate * 0.5;

    // Vouches (caps at +0.3)
    score += Math.min(vouchCount * 0.03, 0.3);

    // Rating (max +0.5)
    score += ((avgRating - 3) / 2) * 0.5;

    // Reports (subtract)
    score -= reportCount * 0.4;

    // Verified bonus
    if (isVerified) score += 0.2;

    return Math.max(1.0, Math.min(5.0, Math.round(score * 10) / 10));
  }

  // ── CO-OCCURRENCE LEARNING ──
  // Called when a user confirms activities → updates baseline DB
  function learnFromActivities(activities) {
    for (let i = 0; i < activities.length; i++) {
      for (let j = i + 1; j < activities.length; j++) {
        const a = ACTIVITY_IDX[activities[i]];
        const b = ACTIVITY_IDX[activities[j]];
        if (a !== undefined && b !== undefined) {
          coMatrix[a][b] += 1;
          coMatrix[b][a] += 1;
        }
      }
    }
    // Persist to local storage (this IS the "baseline DB" growing)
    Security.safeStore('coMatrix', coMatrix);
    Security.logEvent('co_matrix_updated', { activityCount: activities.length });
  }

  // ── RESTORE LEARNED CO-MATRIX ──
  function restoreLearnedData() {
    const saved = Security.safeRead('coMatrix');
    if (saved && Array.isArray(saved)) {
      for (let i = 0; i < Math.min(saved.length, ACT_DIM); i++) {
        for (let j = 0; j < Math.min(saved[i].length, ACT_DIM); j++) {
          coMatrix[i][j] = (coMatrix[i][j] || 0) + (saved[i][j] || 0);
        }
      }
    }
  }
  restoreLearnedData();

  // ── COLD START ──
  // For brand new users with no history: suggest popular activities in their city
  function coldStartSuggestions(city, limit = 6) {
    // Activity popularity (will be real data in prod; seeded here)
    const popularByCity = {
      Chennai:    ['Chess','Cricket','Running','Badminton','Coding','Music'],
      Mumbai:     ['Running','Cricket','Football','Dance','Music','Photography'],
      Bengaluru:  ['Coding','Running','Chess','Yoga','Badminton','Music'],
      Delhi:      ['Cricket','Badminton','Running','Photography','Dance','Reading'],
      Hyderabad:  ['Cricket','Badminton','Chess','Coding','Running','Dance'],
      Kolkata:    ['Football','Chess','Running','Music','Photography','Reading'],
      Pune:       ['Running','Cycling','Cricket','Yoga','Coding','Chess'],
      Ahmedabad:  ['Cricket','Running','Yoga','Dance','Music','Cooking'],
      default:    ['Running','Chess','Cricket','Yoga','Music','Photography'],
    };
    const key = Object.keys(popularByCity).find(k => city?.includes(k)) || 'default';
    return popularByCity[key].slice(0, limit);
  }

  // ── RANK MATCHES ──
  // Given current user + list of candidate users, returns ranked matches
  function rankMatches(currentUser, candidates) {
    return candidates
      .map(candidate => ({
        ...candidate,
        matchScore: computeMatchScore(currentUser, candidate, candidate.distKm || 2),
        ghostingScore: antiGhostingPenalty(candidate),
        trustScore: computeTrustScore(candidate)
      }))
      .filter(c => c.matchScore >= 50) // minimum threshold
      .sort((a, b) => {
        // Primary: match score; secondary: ghosting; tertiary: trust
        const scoreDiff = b.matchScore - a.matchScore;
        if (Math.abs(scoreDiff) > 5) return scoreDiff;
        return (b.ghostingScore - a.ghostingScore) || (b.trustScore - a.trustScore);
      });
  }

  // ── GET TOP ACTIVITY PAIRS (for analytics dashboard) ──
  function getTopCoOccurrences(topN = 10) {
    const pairs = [];
    for (let i = 0; i < ACT_DIM; i++) {
      for (let j = i + 1; j < ACT_DIM; j++) {
        if (coMatrix[i][j] > 0) {
          pairs.push({ a: ACTIVITIES[i], b: ACTIVITIES[j], weight: coMatrix[i][j] });
        }
      }
    }
    return pairs.sort((a, b) => b.weight - a.weight).slice(0, topN);
  }

  // ── PUBLIC API ──
  return {
    ACTIVITIES,
    computeMatchScore,
    computeTrustScore,
    rankMatches,
    learnFromActivities,
    coldStartSuggestions,
    profileToEmbedding,
    cosineSimilarity,
    getTopCoOccurrences,
    antiGhostingPenalty
  };
})();
