# Eject Solutions — Offer Letter Editor

A mobile-friendly React app for generating and downloading offer letters as PDF.

## Features
- 📱 **Mobile-first** — Editor/Preview toggle on mobile, side-by-side on desktop
- ✏️ **Live editing** — 4 tabs: Basic, Candidate, Salary, Terms
- ⬇️ **PDF download** — Full A4, 6-page offer letter via html2pdf.js
- 🚀 **Vercel-ready**

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel via GitHub

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/offer-letter-editor.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy** ✅

No environment variables needed. Done!
