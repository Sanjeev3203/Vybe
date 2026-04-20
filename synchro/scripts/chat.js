// ─── LIVE MEETUP CONTEXT STORE ───
// All context is user-driven: activity chosen, time picked, venue selected
const MeetupContext = {};

// ─── CHAT USER DATA ───
const CHAT_USERS = {
  priya: {
    name: 'Priya S.',
    initials: 'PS',
    bg: '#EDE9FE',
    color: '#7C3AED',
    sharedActivities: ['Chess', 'Reading'],
    activityIcons: { Chess: '♟️', Reading: '📚' },
    messages: [
      { from: 'in', text: 'Hey! Saw your Chess beacon 👀 Wanna play sometime?' },
    ]
  },
  karan: {
    name: 'Karan M.',
    initials: 'KM',
    bg: '#FEE2E2',
    color: '#DC2626',
    sharedActivities: ['Basketball', 'Running'],
    activityIcons: { Basketball: '🏀', Running: '🏃' },
    messages: [
      { from: 'in', text: 'Yo! You into basketball? I run 3v3s around the city 🏀' },
    ]
  },
  nisha: {
    name: 'Nisha R.',
    initials: 'NR',
    bg: '#D1FAE5',
    color: '#059669',
    sharedActivities: ['Yoga', 'Dance'],
    activityIcons: { Yoga: '🧘', Dance: '💃' },
    messages: [
      { from: 'in', text: 'Hi! I teach morning yoga — beginners totally welcome 🧘' },
    ]
  },
  squad: {
    name: 'Chess Squad',
    initials: '♟️',
    bg: '#EDE9FE',
    color: '#7C3AED',
    sharedActivities: ['Chess'],
    activityIcons: { Chess: '♟️' },
    messages: [
      { from: 'in', text: 'Hey squad! Who\'s free this weekend? ♟️' },
      { from: 'out', text: 'I\'m in!' },
      { from: 'in', text: 'Nisha: Same! Where are we meeting?' },
    ]
  }
};

// ─── ICEBREAKERS (activity-aware) ───
const ICEBREAKERS_BY_ACTIVITY = {
  Chess: ['"What\'s your favourite chess opening?"', '"Blitz or classical — which reveals the real you?"', '"Ever pulled off a brilliant sacrifice move?"', '"What\'s your current chess rating?"'],
  Basketball: ['"Favourite NBA team? Be honest 😄"', '"Best basketball moment you\'ve witnessed?"', '"One-on-one or team — which do you prefer?"', '"Zone or man-to-man defence?"'],
  Yoga: ['"How long did it take you to nail crow pose?"', '"Morning or evening yoga — which hits different?"', '"Vinyasa or Hatha — what\'s your flow?"'],
  Guitar: ['"First song you ever learned on guitar?"', '"Acoustic or electric — pick one forever?"', '"Can you play by ear or do you read tabs?"'],
  Running: ['"Treadmill or outdoor run — which is actually harder?"', '"What\'s your current 5K PR?"', '"Headphones on or off when you run?"'],
  Reading: ['"What\'s the last book that genuinely changed your thinking?"', '"Fiction or non-fiction — which is your escape?"'],
  Dance: ['"How did you get into dancing?"', '"Favourite style — contemporary or classical?"'],
  default: ['"What got you into this?"', '"Best experience you\'ve had with this activity?"', '"Tips for someone just starting out?"']
};

// ─── VENUE SUGGESTIONS BY ACTIVITY ───
const VENUES_BY_ACTIVITY = {
  Chess: [
    { name: 'Café Chess Corner', addr: '12 Beach Rd, Besant Nagar', tags: ['☕ Café', '♟️ Boards', '📶 WiFi'] },
    { name: 'Elliot Beach Park', addr: 'Elliot Beach, Besant Nagar', tags: ['🌳 Open air', '🆓 Free', '🕐 24h'] },
    { name: 'Higginbothams Library', addr: 'Anna Salai, Chennai', tags: ['📚 Quiet', '♟️ Tables', '❄️ AC'] },
  ],
  Basketball: [
    { name: 'Anna Nagar Tower Park Court', addr: 'Anna Nagar, Chennai', tags: ['🏀 Full court', '💡 Night lights', '🆓 Free'] },
    { name: 'Nungambakkam Sports Complex', addr: 'Nungambakkam', tags: ['🏀 Indoor', '🚿 Showers', '💳 Paid'] },
    { name: 'Marina Beach Sand Court', addr: 'Marina Beach', tags: ['🏖️ Beach', '🌅 Scenic', '🆓 Free'] },
  ],
  Yoga: [
    { name: 'Elliot Beach Open Space', addr: 'Elliot Beach, Besant Nagar', tags: ['🌊 Beachfront', '🌅 Sunrise', '🆓 Free'] },
    { name: 'Nandanam Yoga Studio', addr: 'Nandanam, Chennai', tags: ['🧘 Studio', '🪢 Mats provided', '💳 Paid'] },
    { name: 'Semmozhi Poonga Garden', addr: 'Cathedral Rd, Chennai', tags: ['🌿 Garden', '🕊️ Peaceful', '🆓 Free'] },
  ],
  Guitar: [
    { name: 'Café Mocha, T Nagar', addr: 'T Nagar, Chennai', tags: ['☕ Café', '🎵 Music-friendly', '📶 WiFi'] },
    { name: 'Music Academy Lawn', addr: 'Alwarpet, Chennai', tags: ['🎶 Music scene', '🪑 Seating', '🆓 Free'] },
  ],
  Running: [
    { name: 'Marina Beach Promenade', addr: 'Marina Beach, Chennai', tags: ['🏃 Track', '🌊 Scenic', '🆓 Free'] },
    { name: 'Nungambakkam Track', addr: 'Nungambakkam', tags: ['🏃 400m track', '💧 Water point', '🆓 Free'] },
  ],
  Reading: [
    { name: 'Higginbothams Library', addr: 'Anna Salai, Chennai', tags: ['📚 Quiet', '❄️ AC', '🆓 Free'] },
    { name: 'Amethyst Café', addr: 'Gokhale St, Nungambakkam', tags: ['☕ Relaxed', '📶 WiFi', '🌿 Garden'] },
  ],
  Dance: [
    { name: 'Kalakshetra Foundation', addr: 'Thiruvanmiyur, Chennai', tags: ['💃 Dance hall', '🎶 Music', '💳 Paid'] },
    { name: 'Besant Nagar Beach', addr: 'Besant Nagar', tags: ['🌊 Open space', '🎵 Vibe', '🆓 Free'] },
  ],
  default: [
    { name: 'Marina Beach Park', addr: 'Marina Beach, Chennai', tags: ['🌳 Open air', '🆓 Free', '🕐 24h'] },
    { name: 'Local Café', addr: 'Near your location', tags: ['☕ Comfortable', '📶 WiFi'] },
  ]
};

// ─── STATE ───
let icebreakerIndex = 0;
let ibHidden = false;
let scheduleModalForUser = null;
let tempSchedule = {};

// ─── OPEN CHAT ───
function openChat(userId) {
  navTo('chat');
  setTimeout(() => openChatThread(userId), 100);
}

// ─── OPEN THREAD ───
function openChatThread(userId) {
  const user = CHAT_USERS[userId];
  if (!user) return;
  State.currentChatUser = userId;
  icebreakerIndex = 0;

  document.getElementById('chat-thread-list').classList.add('hidden');
  document.getElementById('chat-thread-view').classList.remove('hidden');

  const av = document.getElementById('ct-avatar');
  av.textContent = user.initials;
  av.style.background = user.bg;
  av.style.color = user.color;
  document.getElementById('ct-name').textContent = user.name;

  refreshContextBar(userId);

  const area = document.getElementById('messages-area');
  area.innerHTML = '<div class="msg-time-divider">Today</div>';
  user.messages.forEach(m => appendMsg(m.from, m.text, false));
  area.scrollTop = area.scrollHeight;

  updateIcebreaker(userId);
  document.getElementById('icebreaker-box').style.display = 'flex';
  ibHidden = false;
}

function closeChatThread() {
  document.getElementById('chat-thread-list').classList.remove('hidden');
  document.getElementById('chat-thread-view').classList.add('hidden');
  State.currentChatUser = null;
}

// ─── CONTEXT BAR (driven entirely by MeetupContext store) ───
function refreshContextBar(userId) {
  const bar = document.getElementById('chat-context-bar');
  const ctx = MeetupContext[userId];

  if (ctx && ctx.activity) {
    const parts = [`${ctx.icon} ${ctx.activity}`];
    if (ctx.time) parts.push(`⏰ ${ctx.time}`);
    if (ctx.venue) parts.push(`📍 ${ctx.venue}`);
    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:8px">
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${parts.join(' · ')}</span>
        <button onclick="showScheduleModal()" style="background:rgba(91,33,182,0.12);border:none;color:#5B21B6;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;flex-shrink:0">Edit</button>
      </div>`;
    bar.style.background = 'var(--brand-light)';
    bar.style.color = '#3B0764';
  } else {
    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
        <span style="color:#9CA3AF;font-size:12px">No meetup planned yet</span>
        <button onclick="showScheduleModal()" style="background:rgba(124,58,237,0.1);border:none;color:var(--brand);padding:4px 10px;border-radius:10px;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif">Plan meetup →</button>
      </div>`;
    bar.style.background = 'var(--surface-3)';
  }
}

// ─── SEND MESSAGE ───
function sendMessage() {
  const inp = document.getElementById('chat-msg-input');
  const text = inp.value.trim();
  if (!text || !State.currentChatUser) return;
  appendMsg('out', text);
  inp.value = '';
  const ctx = MeetupContext[State.currentChatUser];
  const replies = ctx && ctx.activity
    ? [`Sounds good! Can't wait for ${ctx.activity} ${ctx.icon}`, 'Perfect! See you then 🎯', 'Confirmed! ✓', 'Looking forward to it!']
    : ['Sounds good! 😊', 'Let\'s do it!', '👍', 'Sure thing!', 'Awesome!'];
  setTimeout(() => appendMsg('in', replies[Math.floor(Math.random() * replies.length)]), 1000 + Math.random() * 700);
}

function appendMsg(from, text, scroll = true) {
  const area = document.getElementById('messages-area');
  const div = document.createElement('div');
  div.className = `msg ${from}`;
  div.textContent = text;
  area.appendChild(div);
  if (scroll) area.scrollTop = area.scrollHeight;
}

// ─── SCHEDULE MODAL ─── built fresh from scratch every time ───
function showScheduleModal() {
  scheduleModalForUser = State.currentChatUser;
  const user = scheduleModalForUser ? CHAT_USERS[scheduleModalForUser] : null;
  const existing = scheduleModalForUser ? MeetupContext[scheduleModalForUser] : null;
  const activities = user ? user.sharedActivities : Object.keys(VENUES_BY_ACTIVITY).filter(k => k !== 'default');
  const actIcons = user ? user.activityIcons : { Chess:'♟️', Basketball:'🏀', Yoga:'🧘', Guitar:'🎸', Running:'🏃', Reading:'📚', Dance:'💃' };

  tempSchedule = {
    activity: existing?.activity || '',
    icon: existing?.icon || '',
    time: existing?.time || '',
    venue: existing?.venue || '',
    venueAddr: existing?.venueAddr || ''
  };

  document.getElementById('schedule-modal').innerHTML = `
    <div class="bs-handle"></div>
    <div class="bs-title">Plan a meetup${user ? ' with ' + user.name.split(' ')[0] : ''}</div>

    <div class="sched-section-label">What activity?</div>
    <div class="sched-activity-row" id="sched-act-row">
      ${activities.map(a => `
        <div class="sched-act-pill${existing?.activity === a ? ' sel' : ''}" onclick="pickSchedActivity(this,'${a}','${actIcons[a]||'🎯'}')" data-act="${a}">
          ${actIcons[a]||'🎯'} ${a}
        </div>`).join('')}
    </div>

    <div class="sched-section-label">When?</div>
    <div id="sched-time-grid">${buildTimeSlots(existing?.time)}</div>
    <input type="datetime-local" id="custom-time-input" class="setup-input" style="margin:8px 0 0"
      onchange="pickCustomTime(this.value)">

    <div class="sched-section-label" id="venue-section-label">Suggested venues</div>
    <div id="venue-list">${buildVenueList(existing?.activity || (activities[0]||''), existing?.venue)}</div>

    <div id="sched-summary" style="display:none" class="sched-summary"></div>
    <button class="btn-primary full" onclick="confirmSchedule()" style="margin-top:14px">Confirm meetup ✓</button>
    <button class="btn-ghost full" onclick="closeSheet('schedule-modal')">Cancel</button>
  `;

  openSheet('schedule-modal');
}

function buildTimeSlots(selected) {
  const now = new Date();
  const groups = { 'Today': [], 'Tomorrow': [], 'This week': [] };

  [16,17,18,19,20].forEach(h => {
    const d = new Date(now); d.setHours(h,0,0,0);
    if (d > now) groups['Today'].push(formatSlot(d,'Today'));
  });
  [7,8,9,16,17,18].forEach(h => {
    const d = new Date(now); d.setDate(d.getDate()+1); d.setHours(h,0,0,0);
    groups['Tomorrow'].push(formatSlot(d,'Tomorrow'));
  });
  ['Sat','Sun'].forEach((day,i) => {
    const d = new Date(now); d.setDate(d.getDate()+2+i); d.setHours(10,0,0,0);
    groups['This week'].push(formatSlot(d, day));
  });

  let html = '';
  Object.entries(groups).forEach(([label, slots]) => {
    if (!slots.length) return;
    html += `<div class="ts-day-label">${label}</div><div class="ts-row">`;
    slots.forEach(s => {
      html += `<div class="ts-btn${selected===s.label?' sel':''}" onclick="pickSchedTime(this,'${s.label}')">${s.label}</div>`;
    });
    html += `</div>`;
  });
  return html;
}

function formatSlot(d, prefix) {
  const h = d.getHours(), am = h>=12?'pm':'am', h12 = h%12||12;
  const label = `${h12}:00${am}`;
  return { label, prefix };
}

function buildVenueList(activity, selectedVenue) {
  const venues = VENUES_BY_ACTIVITY[activity] || VENUES_BY_ACTIVITY.default;
  return venues.map(v => `
    <div class="venue-card${selectedVenue===v.name?' sel':''}" onclick="pickSchedVenue(this,'${v.name.replace(/'/g,"\\'").replace(/"/g,'&quot;')}','${v.addr.replace(/'/g,"\\'").replace(/"/g,'&quot;')}')">
      <div class="vc-name">${v.name}</div>
      <div class="vc-meta">${v.addr}</div>
      <div class="vc-tags">${v.tags.map(t=>`<span class="vi-tag">${t}</span>`).join('')}</div>
    </div>`).join('');
}

// ─── PICKERS ───
function pickSchedActivity(el, act, icon) {
  document.querySelectorAll('#sched-act-row .sched-act-pill').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');
  tempSchedule.activity = act;
  tempSchedule.icon = icon;
  // Refresh venues live when activity changes
  document.getElementById('venue-list').innerHTML = buildVenueList(act, '');
  tempSchedule.venue = '';
  tempSchedule.venueAddr = '';
  updateSchedSummary();
}

function pickSchedTime(el, label) {
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  tempSchedule.time = label;
  updateSchedSummary();
}

function pickCustomTime(val) {
  if (!val) return;
  const d = new Date(val);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === new Date(Date.now()+86400000).toDateString();
  const h = d.getHours(), am = h>=12?'pm':'am', h12 = h%12||12;
  const mins = d.getMinutes().toString().padStart(2,'0');
  const day = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : days[d.getDay()];
  tempSchedule.time = `${day} ${h12}:${mins}${am}`;
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('sel'));
  updateSchedSummary();
}

function pickSchedVenue(el, name, addr) {
  document.querySelectorAll('.venue-card').forEach(v => v.classList.remove('sel'));
  el.classList.add('sel');
  tempSchedule.venue = name;
  tempSchedule.venueAddr = addr;
  updateSchedSummary();
}

function updateSchedSummary() {
  const s = document.getElementById('sched-summary');
  if (!s) return;
  const { activity, icon, time, venue } = tempSchedule;
  if (activity || time || venue) {
    const parts = [];
    if (icon && activity) parts.push(`${icon} ${activity}`);
    if (time) parts.push(`⏰ ${time}`);
    if (venue) parts.push(`📍 ${venue}`);
    s.textContent = parts.join(' · ');
    s.style.display = 'block';
  } else {
    s.style.display = 'none';
  }
}

function confirmSchedule() {
  const { activity, icon, time, venue, venueAddr } = tempSchedule;
  if (!activity) { showToast('Pick an activity first 🎯'); return; }
  if (!time) { showToast('Pick a time ⏰'); return; }
  if (!venue) { showToast('Pick a venue 📍'); return; }

  const userId = scheduleModalForUser;
  MeetupContext[userId] = { activity, icon, time, venue, venueAddr, status: 'proposed' };

  closeSheet('schedule-modal');

  if (State.currentChatUser === userId) {
    refreshContextBar(userId);
    updateIcebreaker(userId); // refresh icebreaker to match new activity
    appendMsg('out', `Let's do ${icon} ${activity} — ${time} at ${venue}? 📅`);
    setTimeout(() => appendMsg('in', `Yes! ${time} at ${venue} works perfectly 🎯`), 1200);
  }

  addMeetupToSchedule(userId, { activity, icon, time, venue, venueAddr });
  showToast(`Meetup set: ${icon} ${activity} · ${time} ✓`);
}

// ─── PUSH TO SCHEDULE PAGE ───
function addMeetupToSchedule(userId, ctx) {
  const user = CHAT_USERS[userId];
  if (!user) return;
  const old = document.getElementById('dynamic-meetup-' + userId);
  if (old) old.remove();
  const card = document.createElement('div');
  card.className = 'meetup-card';
  card.id = 'dynamic-meetup-' + userId;
  card.style.borderColor = 'rgba(124,58,237,0.3)';
  card.innerHTML = `
    <div class="met-header">
      <div class="met-icon" style="background:${user.bg}">${ctx.icon}</div>
      <div>
        <div class="met-title">${ctx.activity} with ${user.name}</div>
        <div class="met-meta">${ctx.time} · ${ctx.venue}</div>
      </div>
      <div class="met-badge" style="background:#EDE9FE;color:#7C3AED">Proposed</div>
    </div>
    <div class="met-venue-row">
      <div class="vi-name">${ctx.venue}</div>
      <div class="vi-addr">${ctx.venueAddr}</div>
    </div>
    <div class="met-actions">
      <button class="met-btn primary" onclick="openChat('${userId}')">💬 Message</button>
      <button class="met-btn secondary" onclick="cancelDynamicMeetup('${userId}')">Cancel</button>
    </div>`;
  document.getElementById('sched-upcoming').prepend(card);
}

function cancelDynamicMeetup(userId) {
  document.getElementById('dynamic-meetup-' + userId)?.remove();
  delete MeetupContext[userId];
  if (State.currentChatUser === userId) refreshContextBar(userId);
  showToast('Meetup cancelled');
}

// ─── ICEBREAKERS ───
function updateIcebreaker(userId) {
  const user = CHAT_USERS[userId];
  const ctx = MeetupContext[userId];
  const act = ctx?.activity || user?.sharedActivities?.[0] || 'default';
  const list = ICEBREAKERS_BY_ACTIVITY[act] || ICEBREAKERS_BY_ACTIVITY.default;
  const el = document.getElementById('ib-text');
  if (el) el.textContent = list[icebreakerIndex % list.length];
}

function refreshIcebreaker() {
  icebreakerIndex++;
  updateIcebreaker(State.currentChatUser);
}

function useIcebreaker() {
  const text = document.getElementById('ib-text').textContent.replace(/^"|"$/g, '');
  const inp = document.getElementById('chat-msg-input');
  inp.value = text;
  inp.focus();
}

function toggleIcebreaker() {
  const box = document.getElementById('icebreaker-box');
  ibHidden = !ibHidden;
  box.style.display = ibHidden ? 'none' : 'flex';
}

// ─── VOUCH ───
function openVouch(name) {
  document.getElementById('vouch-name').textContent = name;
  document.querySelectorAll('.vstar').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.vtag').forEach(t => t.classList.remove('sel'));
  openSheet('vouch-modal');
}
function rateStar(n) {
  document.querySelectorAll('.vstar').forEach((s,i) => s.classList.toggle('active', i < n));
}
function toggleVTag(el) { el.classList.toggle('sel'); }
function submitVouch() {
  const stars = document.querySelectorAll('.vstar.active').length;
  if (!stars) { showToast('Please rate your experience ★'); return; }
  closeSheet('vouch-modal');
  showToast(`Vouch submitted! ${stars}★ 🙌`);
  setTimeout(() => showToast('+1 Trust point earned ⭐'), 2500);
}

// ─── PROFILE SHEET ───
function openProfile(userId) {
  const users = {
    priya: { name:'Priya S.',initials:'PS',bg:'#EDE9FE',color:'#7C3AED',score:'94%',activity:'♟️ Chess',level:'Intermediate',trust:'4.9',meetups:18,km:'0.8' },
    karan: { name:'Karan M.',initials:'KM',bg:'#FEE2E2',color:'#DC2626',score:'88%',activity:'🏀 Basketball',level:'Casual',trust:'4.7',meetups:12,km:'1.2' },
    nisha: { name:'Nisha R.',initials:'NR',bg:'#D1FAE5',color:'#059669',score:'81%',activity:'🧘 Yoga',level:'Teacher',trust:'4.8',meetups:24,km:'2.1' },
    rohan: { name:'Rohan V.',initials:'RV',bg:'#FEF3C7',color:'#D97706',score:'77%',activity:'🎸 Guitar',level:'Beginner',trust:'4.5',meetups:6,km:'3.4' },
  };
  const u = users[userId];
  if (!u) return;
  document.getElementById('profile-sheet-content').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:20px">
      <div style="width:72px;height:72px;border-radius:50%;background:${u.bg};color:${u.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;font-family:'Syne',sans-serif;border:3px solid white;box-shadow:0 4px 20px rgba(0,0,0,0.1)">${u.initials}</div>
      <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text-primary)">${u.name}</div>
      <div style="font-size:13px;color:var(--text-secondary)">Chennai · ${u.km} km away</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        <span style="background:${u.bg};color:${u.color};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">${u.activity} · ${u.level}</span>
        <span style="background:var(--brand-light);color:var(--brand);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">Match: ${u.score}</span>
      </div>
    </div>
    <div style="display:flex;justify-content:space-around;border:0.5px solid var(--border);border-radius:var(--radius-md);padding:16px;margin-bottom:20px">
      <div style="text-align:center"><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--brand)">${u.meetups}</div><div style="font-size:11px;color:var(--text-secondary)">Meetups</div></div>
      <div style="text-align:center"><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--success)">${u.trust}★</div><div style="font-size:11px;color:var(--text-secondary)">Trust</div></div>
      <div style="text-align:center"><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--warning)">96%</div><div style="font-size:11px;color:var(--text-secondary)">Reliable</div></div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn-primary" style="flex:2" onclick="closeSheet('profile-sheet');openChat('${userId}')">Message ${u.name.split(' ')[0]}</button>
      <button class="btn-ghost" style="flex:1;margin:0" onclick="closeSheet('profile-sheet');openChat('${userId}');setTimeout(()=>showScheduleModal(),200)">📅 Plan</button>
    </div>`;
  openSheet('profile-sheet');
}
