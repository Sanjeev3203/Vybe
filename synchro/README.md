# Synchro 🎯
**Activity-first social discovery — meet people nearby who share your interests**

> Drop a beacon. Get matched by activity, skill & intent. Meet in the real world.

---

## 🌐 Live Demo
👉 **[synchro.vercel.app](https://synchro.vercel.app)**

---

## 📁 Project Structure

```
synchro/
├── index.html              ← Main app (all screens)
├── vercel.json             ← Vercel deployment config
├── package.json            ← Project metadata
├── .gitignore              ← Files Git should ignore
│
├── styles/
│   ├── global.css          ← Design tokens, layout, desktop wrapper
│   ├── components.css      ← All UI components
│   └── animations.css      ← Keyframes & transitions
│
├── scripts/
│   ├── security.js         ← PII encryption, CSP, sanitization
│   ├── geodata.js          ← India state+city database (1,200+ cities)
│   ├── ml-engine.js        ← Matching algorithm, embeddings, co-occurrence
│   ├── app.js              ← Navigation, state, toasts
│   ├── beacons.js          ← Beacon map, drop/join logic, mini-games
│   ├── chat.js             ← Messaging, dynamic meetup context
│   ├── onboarding.js       ← Setup flow, city search, ML cold start
│   └── profile.js          ← Trust score, profile display
│
├── public/
│   ├── manifest.json       ← PWA manifest
│   ├── favicon.svg         ← App icon
│   └── ...                 ← Icons, OG image
│
└── docs/
    └── DATABASE_ARCHITECTURE.md  ← Schema, ML pipeline, security
```

---

## 🚀 Step-by-Step: GitHub → Vercel Deployment

### STEP 1 — Install Prerequisites

You need two things installed on your computer:

**Git** — check if you have it:
```bash
git --version
```
If not installed → download from [git-scm.com](https://git-scm.com/downloads)

**Node.js** — check if you have it:
```bash
node --version
```
If not → download from [nodejs.org](https://nodejs.org) (choose LTS version)

---

### STEP 2 — Create a GitHub Account (if you don't have one)

1. Go to **[github.com](https://github.com)**
2. Click **Sign up**
3. Enter your email, create a password, choose a username
4. Verify your email

---

### STEP 3 — Create a New Repository on GitHub

1. Go to **[github.com/new](https://github.com/new)**
2. Fill in:
   - **Repository name:** `synchro`
   - **Description:** `Activity-first social discovery platform`
   - **Visibility:** Public ✅ (required for free Vercel hosting)
   - Leave everything else as default
3. Click **Create repository**
4. **Do NOT** check "Initialize with README" — we'll push our own files

---

### STEP 4 — Set Up the Project on Your Computer

Open **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows).

Create a folder for the project:
```bash
mkdir synchro
cd synchro
```

Now copy all the project files into this `synchro` folder. Your folder should look like this:
```
synchro/
├── index.html
├── vercel.json
├── package.json
├── .gitignore
├── styles/
│   ├── global.css
│   ├── components.css
│   └── animations.css
├── scripts/
│   ├── security.js
│   ├── geodata.js
│   ├── ml-engine.js
│   ├── app.js
│   ├── beacons.js
│   ├── chat.js
│   ├── onboarding.js
│   └── profile.js
└── public/
    ├── manifest.json
    └── favicon.svg
```

---

### STEP 5 — Initialize Git and Push to GitHub

Inside the `synchro` folder, run these commands **one by one**:

```bash
# 1. Initialize a Git repository
git init

# 2. Add all files to Git tracking
git add .

# 3. Create your first commit
git commit -m "Initial commit — Synchro app"

# 4. Set the main branch name
git branch -M main

# 5. Connect to your GitHub repository
#    REPLACE "your-username" with your actual GitHub username
git remote add origin https://github.com/your-username/synchro.git

# 6. Push (upload) to GitHub
git push -u origin main
```

When it asks for username/password:
- Username: your GitHub username
- Password: use a **Personal Access Token** (not your password)
  → Get one at: GitHub → Settings → Developer Settings → Personal access tokens → Generate new token → check "repo" → copy the token

After this, refresh your GitHub page — you should see all your files! ✅

---

### STEP 6 — Create a Vercel Account

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up**
3. Choose **Continue with GitHub** (this links them automatically)
4. Authorize Vercel to access your GitHub

---

### STEP 7 — Deploy to Vercel

**Option A — Via Vercel Dashboard (easiest):**

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. You'll see your GitHub repos listed
3. Find **synchro** and click **Import**
4. Vercel auto-detects it's a static site — leave all settings as default
5. Click **Deploy**
6. Wait ~30 seconds ⏳
7. Vercel gives you a URL like: `https://synchro-abc123.vercel.app` 🎉

**Option B — Via Terminal (if you prefer):**
```bash
# Install Vercel CLI
npm install -g vercel

# Inside your synchro folder:
vercel

# Follow the prompts:
# ? Set up and deploy? → Yes
# ? Which scope? → your account
# ? Link to existing project? → No
# ? Project name? → synchro
# ? In which directory is your code? → ./
# → Deploys and gives you a URL
```

---

### STEP 8 — Set a Custom Domain (optional, free)

1. In Vercel dashboard → your project → **Domains**
2. Type your domain name (e.g. `synchro.in`)
3. Follow DNS instructions Vercel gives you
4. Or use the free Vercel subdomain: `synchro-yourname.vercel.app`

---

### STEP 9 — Every Future Update

When you change any file and want to publish the update:

```bash
# From your synchro folder:
git add .
git commit -m "describe what you changed"
git push
```

Vercel **automatically rebuilds and redeploys** every time you push to GitHub. Usually live in under 60 seconds. ⚡

---

## 🔄 Local Development

To run the app locally on your computer (without uploading to GitHub):

```bash
# Install dev server
npm install

# Start local server at http://localhost:3000
npm run dev
```

Open your browser → **http://localhost:3000**

---

## 🛡️ Security Features

| Feature | Implementation |
|---|---|
| PII Encryption | AES-GCM 256-bit via Web Crypto API |
| Input Sanitization | XSS, HTML, SQL injection stripping |
| Content Security Policy | Via HTTP headers in `vercel.json` |
| Rate Limiting | Client-side per-action limits |
| Session Management | Cryptographic random tokens |
| Data Minimization | Context-aware field exposure |

---

## 🤖 ML Features

| Feature | How it works |
|---|---|
| Match scoring | 29-dim cosine similarity embeddings |
| Activity co-occurrence | Grows from real user selections |
| Cold start | City-based popularity priors |
| Trust score | Composite: attendance + vouches + rating |
| Intent matching | Compatibility matrix (Learn↔Teach = 1.0) |

---

## 🗄️ Database (for production)

Uses **Supabase free tier** (500MB, 50K MAU):
- PostgreSQL with pgvector for ML queries
- Row Level Security on all tables
- See `docs/DATABASE_ARCHITECTURE.md` for full schema

---

## 📱 PWA Installation

Users can install Synchro as an app directly from the browser:
- **Android Chrome:** Menu → "Add to Home Screen"
- **iOS Safari:** Share → "Add to Home Screen"
- **Desktop Chrome:** Address bar → install icon

---

## 🆓 Free APIs Used

| API | Purpose | Cost |
|---|---|---|
| Vercel | Hosting | Free (100GB bandwidth/month) |
| GitHub | Code storage | Free |
| Google Fonts | Typography | Free |
| Nominatim (OSM) | Reverse geocoding | Free |
| Web Crypto API | Encryption | Built-in browser |
| Supabase | Database (future) | Free tier |

---

## 📞 Support

If you hit any issue during deployment, the most common fixes are:

**"git push" asks for password repeatedly:**
→ Use a Personal Access Token instead of your password

**Vercel says "no framework detected":**
→ That's fine! Select "Other" or leave as Static Site

**App loads but shows blank:**
→ Open browser DevTools (F12) → Console tab → share the error

**CSS/JS not loading after deploy:**
→ Check file paths are lowercase and match exactly
