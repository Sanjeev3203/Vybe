// ─── ONBOARDING ───
let currentSlide = 0;
const totalSlides = 3;

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    document.getElementById(`slide-${currentSlide}`).classList.remove('active');
    document.getElementById(`odot-${currentSlide}`).classList.remove('active');
    currentSlide++;
    document.getElementById(`slide-${currentSlide}`).classList.add('active');
    document.getElementById(`odot-${currentSlide}`).classList.add('active');
    if (currentSlide === totalSlides - 1) {
      document.getElementById('onboard-next').textContent = 'Create profile →';
    }
  } else {
    showScreen('setup');
    setTimeout(initCitySearch, 100);
  }
}

// ─── SETUP STATE ───
let currentSetupStep = 0;
let selectedCity = '';
let selectedState = '';
let selectedIntent = '';
let cityDropdownVisible = false;

// ─── STEP 1: CITY SEARCH (smart) ───
function initCitySearch() {
  const container = document.getElementById('city-search-container');
  if (!container) return;

  container.innerHTML = `
    <!-- State selector -->
    <div class="city-field-row">
      <div class="city-field-wrap">
        <label class="city-field-label">State / UT</label>
        <div class="custom-select-wrap" id="state-select-wrap">
          <div class="custom-select-display" id="state-display" onclick="toggleStateDropdown()">
            <span id="state-display-text">Select state…</span>
            <span class="cs-arrow" id="state-arrow">▾</span>
          </div>
          <div class="custom-select-dropdown hidden" id="state-dropdown">
            <input class="cs-search-input" id="state-search-inp" placeholder="Type state name…"
              oninput="filterStateDropdown(this.value)" onclick="event.stopPropagation()">
            <div class="cs-list" id="state-list">
              ${ALL_STATES.map(s => `<div class="cs-option" onclick="selectState('${s.replace(/'/g,"\\'")}')">
                ${s}
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="city-field-wrap" id="city-field-wrap">
        <label class="city-field-label">City</label>
        <div class="city-autocomplete-wrap">
          <input class="setup-input city-search-inp" id="city-search-inp"
            placeholder="Type city name…"
            autocomplete="off"
            oninput="onCityInput(this.value)"
            onfocus="onCityInput(this.value)"
            style="margin:0"
            maxlength="60">
          <div class="city-dropdown hidden" id="city-dropdown"></div>
        </div>
      </div>
    </div>

    <!-- Selected display -->
    <div class="selected-location-pill hidden" id="selected-location-pill">
      <span id="selected-location-text"></span>
      <button class="slp-clear" onclick="clearLocationSelection()">✕</button>
    </div>

    <!-- State → cities quick grid (shows after state is picked, before typing) -->
    <div class="state-cities-grid hidden" id="state-cities-grid"></div>
  `;

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#state-select-wrap')) closeStateDropdown();
    if (!e.target.closest('.city-autocomplete-wrap')) closeCityDropdown();
  });
}

// ─── STATE DROPDOWN ───
function toggleStateDropdown() {
  const dd = document.getElementById('state-dropdown');
  const arrow = document.getElementById('state-arrow');
  if (dd.classList.contains('hidden')) {
    dd.classList.remove('hidden');
    arrow.textContent = '▴';
    document.getElementById('state-search-inp').focus();
  } else {
    closeStateDropdown();
  }
}
function closeStateDropdown() {
  const dd = document.getElementById('state-dropdown');
  const arrow = document.getElementById('state-arrow');
  if (dd) { dd.classList.add('hidden'); }
  if (arrow) arrow.textContent = '▾';
}
function filterStateDropdown(q) {
  const lower = q.toLowerCase();
  document.querySelectorAll('#state-list .cs-option').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(lower) ? '' : 'none';
  });
}
function selectState(state) {
  selectedState = state;
  selectedCity = ''; // reset city when state changes
  document.getElementById('state-display-text').textContent = state;
  document.getElementById('state-display-text').style.color = 'var(--text-primary)';
  closeStateDropdown();
  clearLocationSelection();

  // Populate city quick grid for this state
  const cities = getCitiesByState(state);
  const grid = document.getElementById('state-cities-grid');
  const popular = cities.slice(0, 12); // show first 12 (usually alphabetical, capital tends to appear early)
  grid.innerHTML = `
    <div class="scg-label">Popular cities in ${state}</div>
    <div class="scg-pills">
      ${popular.map(c => `<div class="scg-pill" onclick="pickCityFromGrid('${c.replace(/'/g,"\\'")}','${state.replace(/'/g,"\\'")}')">
        ${c}
      </div>`).join('')}
      ${cities.length > 12 ? `<div class="scg-more">+ ${cities.length - 12} more — type to search</div>` : ''}
    </div>`;
  grid.classList.remove('hidden');

  // Focus city input
  const inp = document.getElementById('city-search-inp');
  if (inp) { inp.value = ''; inp.focus(); }
}

// ─── CITY AUTOCOMPLETE ───
function onCityInput(val) {
  const sanitized = Security.sanitize(val, 'search');

  if (!sanitized || sanitized.length < 1) {
    closeCityDropdown();
    return;
  }

  // Search within selected state first, else all India
  let results;
  if (selectedState) {
    const stateResults = searchCities(sanitized).filter(r => r.state === selectedState);
    results = stateResults.length > 0 ? stateResults : searchCities(sanitized);
  } else {
    results = searchCities(sanitized);
  }

  if (!results.length) {
    showCityDropdown([{ display: 'No cities found', noResult: true }]);
    return;
  }

  showCityDropdown(results);
}

function showCityDropdown(results) {
  const dd = document.getElementById('city-dropdown');
  dd.innerHTML = results.map(r => r.noResult
    ? `<div class="city-option no-result">${r.display}</div>`
    : `<div class="city-option" onclick="pickCity('${r.city.replace(/'/g,"\\'")}','${r.state.replace(/'/g,"\\'")}')">
        <span class="co-city">${r.city}</span>
        <span class="co-state">${r.state}</span>
      </div>`
  ).join('');
  dd.classList.remove('hidden');
}

function closeCityDropdown() {
  const dd = document.getElementById('city-dropdown');
  if (dd) dd.classList.add('hidden');
}

function pickCity(city, state) {
  selectedCity = city;
  selectedState = state;
  document.getElementById('city-search-inp').value = city;
  closeCityDropdown();
  document.getElementById('state-display-text').textContent = state;
  document.getElementById('state-display-text').style.color = 'var(--text-primary)';
  showSelectedPill(`${city}, ${state}`);
  // Collapse the state cities grid
  document.getElementById('state-cities-grid').classList.add('hidden');
}

function pickCityFromGrid(city, state) {
  selectedCity = city;
  selectedState = state;
  const inp = document.getElementById('city-search-inp');
  if (inp) inp.value = city;
  showSelectedPill(`${city}, ${state}`);
  document.getElementById('state-cities-grid').classList.add('hidden');
}

function showSelectedPill(text) {
  const pill = document.getElementById('selected-location-pill');
  document.getElementById('selected-location-text').textContent = '📍 ' + text;
  pill.classList.remove('hidden');
}

function clearLocationSelection() {
  selectedCity = '';
  const inp = document.getElementById('city-search-inp');
  if (inp) inp.value = '';
  const pill = document.getElementById('selected-location-pill');
  if (pill) pill.classList.add('hidden');
}

// ─── STEP 1: CONTINUE ───
function setupNext(nextStep) {
  if (nextStep === 1) {
    const rawName = document.getElementById('inp-name').value.trim();
    const name = Security.sanitize(rawName, 'name');
    if (!name || name.length < 2) { showToast('Enter your name 👋'); return; }
    if (!selectedCity) { showToast('Pick your city 📍'); return; }
    if (!selectedState) { showToast('Select your state too'); return; }

    // Rate limit: prevent rapid submits
    if (!Security.checkRateLimit('setup_step', 5)) {
      showToast('Too many attempts, wait a moment');
      return;
    }

    State.user.name = name;
    State.user.city = selectedCity;
    State.user.state = selectedState;
    State.user.initials = name.slice(0, 2).toUpperCase();

    // Log (no PII in log)
    Security.logEvent('setup_step1_complete', {
      cityHash: selectedCity.slice(0, 3) + '***',
      state: selectedState
    });
  }

  if (nextStep === 2) {
    if (State.selectedActivities.length === 0) {
      showToast('Pick at least one activity 🎯');
      return;
    }
    // ── ML: learn from activity co-selection ──
    MLEngine.learnFromActivities(State.selectedActivities);

    // ── ML: cold start suggestions (surface similar activities the user might not have picked) ──
    const suggestions = MLEngine.coldStartSuggestions(selectedCity)
      .filter(a => !State.selectedActivities.includes(a))
      .slice(0, 3);

    if (suggestions.length > 0) {
      showToast(`You might also like: ${suggestions.join(', ')} 💡`);
    }

    Security.logEvent('setup_step2_complete', { activityCount: State.selectedActivities.length });
  }

  document.getElementById(`setup-${currentSetupStep}`).classList.remove('active');
  currentSetupStep = nextStep;
  document.getElementById(`setup-${currentSetupStep}`).classList.add('active');

  const pcts = ['33%', '66%', '100%'];
  document.getElementById('ssi-fill').style.width = pcts[currentSetupStep] || '100%';
}

// ─── ACTIVITY SELECTION ───
function toggleAct(el) {
  const selected = document.querySelectorAll('.act-item.sel');
  if (!el.classList.contains('sel') && selected.length >= 5) {
    showToast('Max 5 activities');
    return;
  }
  el.classList.toggle('sel');
  State.selectedActivities = Array.from(document.querySelectorAll('.act-item.sel')).map(e => e.dataset.act);
}

// ─── INTENT ───
function selectIntent(el, intent) {
  document.querySelectorAll('.intent-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  selectedIntent = intent;
}

// ─── FINISH SETUP ───
function finishSetup() {
  if (!selectedIntent) { showToast('Pick your vibe 😎'); return; }
  if (!Security.checkRateLimit('finish_setup', 3)) { showToast('Please wait a moment'); return; }

  State.user.intent = selectedIntent;

  // ── Build initial user profile for ML engine ──
  const userProfile = {
    selectedActivities: State.selectedActivities,
    intent: selectedIntent,
    city: State.user.city,
    state: State.user.state,
    skillLevel: 'Intermediate',
    reliability: 100,
    timePreference: 'any',
    meetupCount: 0,
    trustScore: 3.5,
    isVerified: false
  };

  // Compute initial match scores against dummy candidates
  const demoMatches = [
    { id: 'priya', selectedActivities: ['Chess', 'Reading'], intent: 'Compete', skillLevel: 'Intermediate', reliability: 96, distKm: 0.8, trustScore: 4.9 },
    { id: 'karan', selectedActivities: ['Basketball', 'Running'], intent: 'Casual', skillLevel: 'Casual', reliability: 90, distKm: 1.2, trustScore: 4.7 },
    { id: 'nisha', selectedActivities: ['Yoga', 'Dance'], intent: 'Teach', skillLevel: 'Teacher', reliability: 98, distKm: 2.1, trustScore: 4.8 },
    { id: 'rohan', selectedActivities: ['Guitar', 'Music'], intent: 'Learn', skillLevel: 'Novice', reliability: 80, distKm: 3.4, trustScore: 4.5 },
  ];

  const ranked = MLEngine.rankMatches(userProfile, demoMatches);
  State.mlMatchScores = {};
  ranked.forEach(r => { State.mlMatchScores[r.id] = r.matchScore; });

  // ── Persist (encrypted PII, raw ML data) ──
  Security.encryptPII(State.user.name).then(encName => {
    Security.safeStore('profile', {
      encName,
      city: State.user.city,   // city not PII, stored plain
      state: State.user.state,
      initials: State.user.initials,
      activities: State.selectedActivities,
      intent: selectedIntent,
      setupAt: Date.now()
    });
  });

  Security.logEvent('setup_complete', {
    intent: selectedIntent,
    activityCount: State.selectedActivities.length,
    city: State.user.city,
    state: State.user.state
  });

  updateProfileDisplay();
  showScreen('app');

  // Apply ML-computed scores to match cards
  setTimeout(() => applyMLScores(), 200);
  showToast(`Welcome to Synchro, ${State.user.name}! 🎉`);
}

// ─── APPLY ML SCORES TO UI ───
function applyMLScores() {
  if (!State.mlMatchScores) return;
  const idMap = { priya: 0, karan: 1, nisha: 2, rohan: 3 };
  document.querySelectorAll('.match-card').forEach((card, idx) => {
    const userId = Object.keys(idMap).find(k => idMap[k] === idx);
    if (userId && State.mlMatchScores[userId] !== undefined) {
      const scoreEl = card.querySelector('.mc-score');
      if (scoreEl) {
        scoreEl.textContent = State.mlMatchScores[userId] + '%';
      }
    }
  });
}
