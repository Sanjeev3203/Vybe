# Vybe 🎯
**Find your vibe. Meet your people.**

> Drop a beacon. Get matched by activity, skill & intent. Meet in the real world.

---

## 🌐 Live App
👉 **[vybe.vercel.app](https://vybe.vercel.app)**

---

## 📁 Project Structure

```
vybe/
├── index.html              ← Main app (all screens)
├── vercel.json             ← Vercel deployment config (FIXED)
├── package.json
├── .gitignore
├── README.md
├── styles/
│   ├── global.css
│   ├── components.css
│   └── animations.css
├── scripts/
│   ├── security.js         ← PII encryption, CSP, sanitization
│   ├── geodata.js          ← India 1,200+ cities database
│   ├── ml-engine.js        ← Matching algorithm & embeddings
│   ├── app.js              ← Navigation & state
│   ├── beacons.js          ← Beacon map logic
│   ├── chat.js             ← Messaging & meetup context
│   ├── onboarding.js       ← Setup + city search
│   └── profile.js          ← Trust & profile
└── public/
    ├── manifest.json       ← PWA manifest
    └── favicon.svg
```

---

## 🚀 Deploy to GitHub + Vercel

### 1. Create GitHub repo
Go to **github.com/new** → name it `vybe` → Public → Create

### 2. Push your code
```bash
git init
git add .
git commit -m "Initial commit — Vybe app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vybe.git
git push -u origin main
```

### 3. Deploy on Vercel
- Go to **vercel.com** → Sign up with GitHub
- Click **Add New → Project** → Import `vybe`
- Leave all settings default → **Deploy**
- ✅ Live in ~30 seconds!

### 4. Update anytime
```bash
git add .
git commit -m "what changed"
git push
# Vercel auto-redeploys in <60s
```

---

## 🔧 Why the 404 happened (fixed)
The old `vercel.json` used `builds` + `routes` which is Vercel's deprecated v1 format.  
The new `vercel.json` uses only `headers` — the correct modern format for static HTML sites.

---

## 🛡️ Security
AES-GCM 256-bit PII encryption · XSS sanitization · CSP headers · Rate limiting · Session tokens

## 🤖 ML
29-dim cosine similarity · Activity co-occurrence learning · Cold start priors · Trust score engine

## 🗄️ Database
See `docs/DATABASE_ARCHITECTURE.md` for full Supabase schema + pgvector setup
