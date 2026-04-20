// ─── BEACON DATA ───
const BEACONS = {
  chess: {
    icon: '♟️',
    title: 'Chess Park Meet',
    location: 'Marina Beach Park · 0.5 km',
    bg: '#EDE9FE',
    members: [
      { initials: 'PS', name: 'Priya S.', meta: 'Intermediate · 0.8km', bg: '#EDE9FE', color: '#7C3AED', trust: '4.9★' },
      { initials: 'KM', name: 'Karan M.', meta: 'Casual · 1.2km', bg: '#FEE2E2', color: '#DC2626', trust: '4.7★' },
      { initials: 'NR', name: 'Nisha R.', meta: 'Expert · 2.1km', bg: '#D1FAE5', color: '#059669', trust: '4.8★' },
    ]
  },
  basketball: {
    icon: '🏀',
    title: '3v3 Basketball',
    location: 'Anna Nagar Court · 1.2 km',
    bg: '#FEE2E2',
    members: [
      { initials: 'KM', name: 'Karan M.', meta: 'Casual · 1.2km', bg: '#FEE2E2', color: '#DC2626', trust: '4.7★' },
      { initials: 'RV', name: 'Rohan V.', meta: 'Beginner · 3.4km', bg: '#FEF3C7', color: '#D97706', trust: '4.5★' },
    ]
  },
  yoga: {
    icon: '🧘',
    title: 'Morning Yoga Flow',
    location: 'Elliot Beach · 2.1 km',
    bg: '#D1FAE5',
    members: [
      { initials: 'NR', name: 'Nisha R.', meta: 'Teacher · 2.1km', bg: '#D1FAE5', color: '#059669', trust: '4.8★' },
    ]
  },
  guitar: {
    icon: '🎸',
    title: 'Guitar Jam Session',
    location: 'Besant Nagar · 3.4 km',
    bg: '#FEF3C7',
    members: [
      { initials: 'RV', name: 'Rohan V.', meta: 'Beginner · 3.4km', bg: '#FEF3C7', color: '#D97706', trust: '4.5★' },
      { initials: 'PS', name: 'Priya S.', meta: 'Intermediate · 0.8km', bg: '#EDE9FE', color: '#7C3AED', trust: '4.9★' },
    ]
  }
};

// ─── OPEN BEACON DETAIL SHEET ───
function openBeaconSheet(id) {
  const b = BEACONS[id];
  if (!b) return;

  const membersHTML = b.members.map(m => `
    <div class="bsh-member">
      <div class="bsh-mem-av" style="background:${m.bg};color:${m.color}">${m.initials}</div>
      <div>
        <div class="bsh-mem-name">${m.name}</div>
        <div class="bsh-mem-meta">${m.meta}</div>
      </div>
      <div class="bsh-trust">${m.trust}</div>
    </div>
  `).join('');

  document.getElementById('beacon-sheet-content').innerHTML = `
    <div class="bs-activity-header">
      <div class="bsh-icon">${b.icon}</div>
      <div>
        <div class="bsh-title">${b.title}</div>
        <div class="bsh-sub">📍 ${b.location}</div>
      </div>
    </div>
    <div class="bsh-members-label">Who's joining</div>
    <div class="bsh-members">${membersHTML}</div>
    <div class="bsh-actions">
      <button class="bsh-btn-join" onclick="joinBeaconFromSheet('${id}')">Join this beacon 🎯</button>
      <button class="bsh-btn-game" onclick="closeSheet('beacon-sheet');openMiniGame()">Quick game ⚡</button>
    </div>
  `;
  openSheet('beacon-sheet');
}

// ─── JOIN BEACON ───
function joinBeacon(btn, name) {
  btn.textContent = '✓ Joined';
  btn.classList.add('joined');
  btn.disabled = true;
  showToast(`Joined "${name}"! 🎯 You're in`);
}

function joinBeaconFromSheet(id) {
  const b = BEACONS[id];
  closeSheet('beacon-sheet');
  showToast(`Joined ${b.title}! Connecting you now 🎯`);
  setTimeout(() => showToast('Venue suggested: Marina Beach Park 📍'), 2500);
}

// ─── DROP BEACON ───
let selectedBeaconActivity = '';

function selectBeaconAct(el) {
  document.querySelectorAll('#beacon-activity-chips .act-chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  selectedBeaconActivity = el.dataset.act;
}

function dropBeacon() {
  if (!selectedBeaconActivity) {
    showToast('Pick an activity first! 👆');
    return;
  }
  const skill = document.getElementById('beacon-skill').value;
  const squad = document.getElementById('beacon-squad').value;
  if (skill === 'Skill level') {
    showToast('Select your skill level 🎯');
    return;
  }

  showToast(`Beacon dropped: ${selectedBeaconActivity} · ${skill} · ${squad} 🎯`);
  setTimeout(() => showToast('2 nearby matches notified! ✓'), 2500);

  // Add to list
  const list = document.getElementById('beacon-list');
  const newItem = document.createElement('div');
  newItem.className = 'beacon-item';
  newItem.style.borderColor = 'rgba(124,58,237,0.4)';
  newItem.style.background = '#F5F3FF';
  newItem.innerHTML = `
    <div class="bi-icon" style="background:#EDE9FE;">🎯</div>
    <div class="bi-info">
      <div class="bi-title">${selectedBeaconActivity} — Your Beacon</div>
      <div class="bi-meta">Your location · Active now · 0 joined</div>
    </div>
    <div class="bi-right">
      <div class="bi-time" style="color:#7C3AED;font-weight:700">Live</div>
      <button class="bi-join" style="background:#EDE9FE;color:#7C3AED;" onclick="removeBeacon(this)">Remove</button>
    </div>
  `;
  list.prepend(newItem);

  // Reset
  document.querySelectorAll('#beacon-activity-chips .act-chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('beacon-skill').value = 'Skill level';
  selectedBeaconActivity = '';
}

function removeBeacon(btn) {
  btn.closest('.beacon-item').remove();
  showToast('Beacon removed');
}

// ─── MINI GAME ───
const GAMES = [
  {
    question: 'Which chess piece can only move diagonally?',
    options: ['Rook', 'Bishop', 'Knight', 'Queen'],
    answer: 1
  },
  {
    question: 'In chess, what is it called when the king is under immediate attack?',
    options: ['Stalemate', 'Checkmate', 'Check', 'Fork'],
    answer: 2
  },
  {
    question: 'How many squares are on a standard chess board?',
    options: ['32', '48', '64', '72'],
    answer: 2
  }
];

let gameTimer;
let gameSeconds = 30;

function openMiniGame() {
  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  let timerInterval;
  gameSeconds = 30;

  document.getElementById('minigame-content').innerHTML = `
    <div class="game-timer" id="game-timer">30</div>
    <div class="game-question">${game.question}</div>
    <div class="game-options" id="game-options">
      ${game.options.map((opt, i) => `
        <button class="game-opt" onclick="answerGame(this, ${i}, ${game.answer})">${opt}</button>
      `).join('')}
    </div>
  `;

  timerInterval = setInterval(() => {
    gameSeconds--;
    const el = document.getElementById('game-timer');
    if (el) el.textContent = gameSeconds;
    if (gameSeconds <= 0) {
      clearInterval(timerInterval);
      if (el) el.textContent = '⏰';
      document.querySelectorAll('.game-opt').forEach(b => b.disabled = true);
      setTimeout(() => closeSheet('minigame-sheet'), 1500);
    }
  }, 1000);

  openSheet('minigame-sheet');
  window._gameInterval = timerInterval;
}

function answerGame(btn, chosen, correct) {
  clearInterval(window._gameInterval);
  document.querySelectorAll('.game-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    else if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });
  if (chosen === correct) {
    showToast('Correct! 🎉 +5 trust points');
  } else {
    showToast('Not quite! Better luck next time');
  }
  setTimeout(() => closeSheet('minigame-sheet'), 2000);
}
