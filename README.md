# AI Physics Tutor - Deployment Guide

An adaptive AI tutor for NCERT Class 9 Physics (Gravitation chapter) using Socratic method.

## Features
- ✅ Diagnostic assessment
- ✅ Personalized learning paths
- ✅ Socratic dialogue with LLM
- ✅ MCQ validation
- ✅ Real time mastery tracking

## Free Deployment on Vercel (₹0 cost)

### Prerequisites
1. GitHub account
2. Vercel account (free) - sign up at https://vercel.com
3. Anthropic API key - get from https://console.anthropic.com

### Step 1: Push to GitHub

```bash
# Create a new repo on GitHub (e.g., "ai-physics-tutor")
# Then on your computer:

cd [folder with these files]
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-physics-tutor.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy" (no configuration needed!)

### Step 3: Add API Key

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: [your Anthropic API key]
4. Click "Save"
5. Go to "Deployments" tab and redeploy

### That's it! 🎉

Your tutor is now live at: `https://your-project-name.vercel.app`

## Cost Breakdown

**Hosting: ₹0** (Vercel free tier)
- 100GB bandwidth/month
- 100 serverless function calls/day
- Unlimited static requests

**API Costs: ~₹15-30/month** for 100 students
- Diagnostic: ₹0 (hardcoded MCQs)
- Socratic dialogue: ~₹0.20/student
- Validation: ₹0 (hardcoded MCQs)
- Rapid fire: ₹0 (hardcoded MCQs)

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local` for local development:
```
ANTHROPIC_API_KEY=your_key_here
```

(Don't commit this file!)

## Tech Stack
- Frontend: React 18, Tailwind CSS
- Backend: Vercel Serverless Functions (Node.js)
- LLM: Anthropic Claude Sonnet 4
- Hosting: Vercel

## Future Improvements
- [ ] Add more chapters
- [ ] Voice input/output
- [ ] Progress persistence
- [ ] Teacher dashboard
- [ ] Multi-language support
- [ ] Visual aids (diagrams, animations)
