// ─── APP STATE ───
const State = {
  user: { name: 'Arjun', city: 'Chennai', initials: 'AJ', intent: 'Compete' },
  selectedActivities: [],
  currentPage: 'home',
  currentChatUser: null,
  onboardSlide: 0,
  setupStep: 0,
};

// ─── BOOT SEQUENCE ───
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    document.getElementById('splash').style.transition = 'opacity 0.4s';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      showScreen('onboarding');
    }, 400);
  }, 1800);
});

// ─── SCREEN SWITCHING ───
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(name);
  if (el) el.classList.remove('hidden');
}

// ─── NAVIGATION ───
function navTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  const nb = document.getElementById('nav-' + page);
  if (nb) nb.classList.add('active');
  State.currentPage = page;

  // Update top bar title
  const titles = {
    home: `Hey, <span id="user-name-display">${State.user.name}</span> 👋`,
    discover: 'Discover',
    schedule: 'Schedule',
    chat: 'Messages',
    profile: 'Profile'
  };
  document.getElementById('top-title').innerHTML = titles[page] || page;

  // Close chat thread if navigating away
  if (page !== 'chat') {
    closeChatThread();
  }
}

// ─── TOAST ───
let toastTimer;
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

// ─── SHEETS ───
function openSheet(id) {
  document.getElementById('backdrop').classList.remove('hidden');
  document.getElementById(id).classList.remove('hidden');
}
function closeSheet(id) {
  document.getElementById(id).classList.add('hidden');
  // hide backdrop if no sheets open
  const anyOpen = document.querySelector('.bottom-sheet:not(.hidden), .side-panel:not(.hidden)');
  if (!anyOpen) document.getElementById('backdrop').classList.add('hidden');
}
function closeAllSheets() {
  document.querySelectorAll('.bottom-sheet, .side-panel').forEach(s => s.classList.add('hidden'));
  document.getElementById('backdrop').classList.add('hidden');
}

// ─── NOTIFICATIONS ───
function showNotifications() {
  document.getElementById('backdrop').classList.remove('hidden');
  document.getElementById('notif-panel').classList.remove('hidden');
}
function hideNotifications() {
  closeSheet('notif-panel');
}

// ─── HOME FILTER ───
function filterHome(el, cat) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast(`Showing: ${cat}`);
}

// ─── INTENT / COMFORT SELECTORS ───
function selectIntentMode(el) {
  document.querySelectorAll('.is-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  showToast('Intent updated: ' + el.textContent);
}
function selectComfort(el) {
  document.querySelectorAll('.cs-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}

// ─── CONFIRM MEETUP ───
function confirmMeetup(btn) {
  btn.textContent = '✓ Confirmed!';
  btn.style.background = '#059669';
  const badge = btn.closest('.meetup-card').querySelector('.met-badge');
  if (badge) { badge.textContent = 'Confirmed'; badge.className = 'met-badge confirmed'; }
  showToast('Meetup confirmed! 🎉');
}

// ─── SCHEDULE MODAL ───
function showScheduleModal() {
  openSheet('schedule-modal');
}
function selectVenue(el, name, addr) {
  document.querySelectorAll('.venue-card').forEach(v => v.classList.remove('sel'));
  el.classList.add('sel');
}
function selectTime(el) {
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
}
function confirmSchedule() {
  closeSheet('schedule-modal');
  showToast('Meetup scheduled! 📅 Added to calendar');
  setTimeout(() => showToast('Notification sent to your match ✓'), 3000);
}

// ─── MAP SHEET ───
function showMapSheet() {
  openSheet('map-sheet');
}

// ─── SQUAD DETAIL ───
function openSquad(id) {
  showToast('Squad feature — opening Chess Squad 👥');
}

// ─── DROP BEACON (from home FAB) ───
function showDropBeacon() {
  navTo('discover');
  setTimeout(() => {
    document.getElementById('drop-beacon-card').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// ─── SCHEDULE TAB SWITCHING ───
function switchSchedTab(el, tab) {
  document.querySelectorAll('.stab').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sched-upcoming').classList.toggle('hidden', tab !== 'upcoming');
  document.getElementById('sched-past').classList.toggle('hidden', tab !== 'past');
}
