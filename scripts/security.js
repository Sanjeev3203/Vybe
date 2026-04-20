// ─── VYBE SECURITY LAYER ───
// Handles: PII encryption, input sanitization, rate limiting,
// session tokens, XSS prevention, data minimization

const Security = (() => {

  // ── CONSTANTS ──
  const PII_FIELDS = ['name', 'phone', 'email', 'location', 'city', 'dob'];
  const MAX_INPUT_LEN = { name: 40, bio: 200, message: 1000, city: 60, search: 80 };
  const RATE_LIMITS = {};
  const SESSION_KEY = 'vybe_session_v1';
  const SALT_KEY = 'vybe_salt_v1';

  // ── SESSION TOKEN ──
  // Generates a cryptographically random session ID (never user-identifiable)
  function generateSessionToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── SALT (per-device, stored locally, never transmitted raw) ──
  function getOrCreateSalt() {
    let salt = sessionStorage.getItem(SALT_KEY);
    if (!salt) {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      salt = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem(SALT_KEY, salt);
    }
    return salt;
  }

  // ── PII MASKING (for logs and analytics — never log raw PII) ──
  // Replaces PII values with pseudonymous tokens
  function maskPII(value, type = 'generic') {
    if (!value) return '[empty]';
    const str = String(value);
    if (type === 'name') return str[0] + '***' + (str.length > 3 ? str[str.length - 1] : '');
    if (type === 'phone') return '***' + str.slice(-4);
    if (type === 'email') {
      const [local, domain] = str.split('@');
      return local[0] + '***@' + (domain || '***');
    }
    if (type === 'location') return '[location_masked]';
    return str.slice(0, 2) + '***';
  }

  // ── CLIENT-SIDE ENCRYPTION (AES-GCM via WebCrypto) ──
  // Used to encrypt sensitive profile fields before storing locally
  async function deriveKey(salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode('vybe-client-key-2025'), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptPII(plaintext) {
    try {
      const salt = getOrCreateSalt();
      const key = await deriveKey(salt);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(String(plaintext))
      );
      // Pack iv + ciphertext as base64
      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertext), iv.length);
      return btoa(String.fromCharCode(...combined));
    } catch (e) {
      console.warn('[Security] Encryption failed, storing hashed fallback');
      return await hashValue(String(plaintext));
    }
  }

  async function decryptPII(ciphertextB64) {
    try {
      const salt = getOrCreateSalt();
      const key = await deriveKey(salt);
      const combined = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const dec = new TextDecoder();
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      return dec.decode(plain);
    } catch (e) {
      return null; // decryption failure → treat as missing
    }
  }

  // ── HASHING (one-way, for IDs and analytics keys) ──
  async function hashValue(value) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(value + getOrCreateSalt()));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  // ── INPUT SANITIZATION ──
  // Strips HTML/script injection, enforces length limits
  function sanitize(input, field = 'generic') {
    if (input === null || input === undefined) return '';
    let str = String(input);
    // Strip HTML tags
    str = str.replace(/<[^>]*>/g, '');
    // Strip script injection patterns
    str = str.replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '').replace(/data:/gi, '');
    // Strip SQL injection patterns
    str = str.replace(/['";\\]/g, c => ({ "'": '\u2019', '"': '\u201C', ';': '', '\\': '' }[c] || c));
    // Length cap
    const maxLen = MAX_INPUT_LEN[field] || 200;
    str = str.slice(0, maxLen);
    // Trim whitespace
    return str.trim();
  }

  // Validate email format
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return re.test(sanitize(email, 'generic'));
  }

  // Validate phone (India: 10 digits, optional +91)
  function validatePhone(phone) {
    const cleaned = String(phone).replace(/[\s\-\(\)]/g, '');
    return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
  }

  // ── RATE LIMITING (client-side, per action) ──
  function checkRateLimit(action, maxPerMinute = 10) {
    const now = Date.now();
    if (!RATE_LIMITS[action]) RATE_LIMITS[action] = [];
    // Remove old entries outside 60s window
    RATE_LIMITS[action] = RATE_LIMITS[action].filter(t => now - t < 60000);
    if (RATE_LIMITS[action].length >= maxPerMinute) {
      return false; // rate limited
    }
    RATE_LIMITS[action].push(now);
    return true;
  }

  // ── SESSION MANAGEMENT ──
  function initSession() {
    let session = null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) session = JSON.parse(raw);
    } catch (e) {}

    if (!session || !session.token || Date.now() - session.created > 86400000) {
      session = {
        token: generateSessionToken(),
        created: Date.now(),
        lastActive: Date.now(),
        fingerprint: getDeviceFingerprint()
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    return session;
  }

  function updateSessionActivity() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        session.lastActive = Date.now();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) {}
  }

  // ── DEVICE FINGERPRINT (privacy-preserving, non-tracking) ──
  // Used only to detect session hijacking, never shared
  function getDeviceFingerprint() {
    const components = [
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
    ];
    return btoa(components.join('|')).slice(0, 16);
  }

  // ── CONTENT SECURITY POLICY (applied via meta tag) ──
  function applyCSP() {
    const existing = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existing) return;
    const csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
      "connect-src 'self' https://api.anthropic.com https://nominatim.openstreetmap.org",
      "img-src 'self' data: https:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    document.head.prepend(csp);
  }

  // ── DATA MINIMIZATION ──
  // Returns only the safe subset of user data needed for a given context
  function minimizeForContext(userData, context) {
    const PUBLIC_FIELDS = ['initials', 'city', 'intent', 'selectedActivities'];
    const MATCH_FIELDS = [...PUBLIC_FIELDS, 'trustScore', 'reliabilityRate'];
    const CHAT_FIELDS = [...MATCH_FIELDS, 'name'];

    const allowed = {
      public: PUBLIC_FIELDS,
      match: MATCH_FIELDS,
      chat: CHAT_FIELDS,
      self: Object.keys(userData)
    }[context] || PUBLIC_FIELDS;

    return Object.fromEntries(
      Object.entries(userData).filter(([k]) => allowed.includes(k))
    );
  }

  // ── AUDIT LOG (in-memory only, no PII) ──
  const auditLog = [];
  function logEvent(action, metadata = {}) {
    // Scrub any PII from metadata before logging
    const safe = {};
    for (const [k, v] of Object.entries(metadata)) {
      safe[k] = PII_FIELDS.includes(k) ? '[redacted]' : v;
    }
    auditLog.push({ action, ts: Date.now(), ...safe });
    if (auditLog.length > 200) auditLog.shift(); // rolling buffer
  }

  // ── SAFE LOCAL STORAGE ──
  // Wraps localStorage with try/catch and quota checks
  function safeStore(key, value) {
    try {
      localStorage.setItem('vybe_' + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[Security] Storage failed:', e.name);
      return false;
    }
  }

  function safeRead(key, fallback = null) {
    try {
      const raw = localStorage.getItem('vybe_' + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeDelete(key) {
    try { localStorage.removeItem('vybe_' + key); } catch (e) {}
  }

  // ── PUBLIC API ──
  return {
    init() {
      applyCSP();
      const session = initSession();
      logEvent('session_init', { fingerprint: session.fingerprint });
      // Auto-refresh session activity on user interaction
      document.addEventListener('click', updateSessionActivity, { passive: true });
      return session;
    },
    sanitize,
    validateEmail,
    validatePhone,
    encryptPII,
    decryptPII,
    hashValue,
    maskPII,
    checkRateLimit,
    minimizeForContext,
    logEvent,
    safeStore,
    safeRead,
    safeDelete,
    getSession: () => {
      try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
    }
  };
})();

// ── BOOT SECURITY ON LOAD ──
window.__vybeSession = Security.init();
