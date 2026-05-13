# Stack Analyzer

AI-powered supplement stack analyzer built with Next.js + Anthropic Claude.

---

## Before deploying — do these 2 things:

### 1. Add your Stripe links
Open `src/app/page.js` and replace lines 6-7:
```
const STRIPE_ONE_TIME = "https://buy.stripe.com/YOUR_ONE_TIME_LINK";
const STRIPE_MONTHLY = "https://buy.stripe.com/YOUR_MONTHLY_LINK";
```
Paste your real Stripe Payment Links from your Notes.

### 2. Add your Anthropic API key
You'll add this in Vercel (do NOT put it in the code).

---

## Deploy to Vercel (step by step)

### Step 1: Push to GitHub
```bash
cd stack-analyzer
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stack-analyzer.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to vercel.com
2. Click "Add New Project"
3. Import your `stack-analyzer` GitHub repo
4. Under "Environment Variables" add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your `sk-ant-...` key
5. Click "Deploy"

Done. Your app is live at `stack-analyzer.vercel.app` 🚀

---

## Local development
```bash
npm install
npm run dev
```
Open http://localhost:3000
