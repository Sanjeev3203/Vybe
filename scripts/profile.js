// ─── PROFILE MANAGEMENT ───

function updateProfileDisplay() {
  const u = State.user;
  const av = document.getElementById('ph-avatar');
  const name = document.getElementById('ph-name');
  const display = document.getElementById('user-name-display');
  if (av) av.textContent = u.initials;
  if (name) name.textContent = u.name + ' J.';
  if (display) display.textContent = u.name;
}
