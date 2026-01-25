# 🚀 Deploy AI Physics Tutor - Complete Beginner Guide

## What You'll Get
- ✅ Free hosting (Vercel)
- ✅ Free LLM (Groq)
- ✅ Your code on GitHub
- ✅ Live website in 15 minutes
- ✅ **Total cost: ₹0**

---

## Part 1: Get Your Free Groq API Key (2 minutes)

1. Go to: https://console.groq.com
2. Click "Sign Up" (top right)
3. Sign up with Google (easiest)
4. After login, click "API Keys" (left sidebar)
5. Click "Create API Key"
6. Give it a name: "Physics Tutor"
7. Click "Submit"
8. **COPY THE KEY** - it looks like: `gsk_xxxxxxxxxxxx`
9. Save it somewhere safe (you'll need it later)

**Groq Free Tier:**
- 14,400 requests per day (FREE!)
- Fast responses
- Good quality (Llama 3.3 70B model)

---

## Part 2: Upload to GitHub (5 minutes)

### Step 1: Create GitHub Account
1. Go to: https://github.com/signup
2. Enter your email
3. Create a password
4. Choose a username
5. Verify your email
6. Done!

### Step 2: Create a New Repository
1. After login, you'll see a green button "Create repository" - click it
   (Or go to: https://github.com/new)
2. Fill in:
   - **Repository name**: `ai-physics-tutor`
   - **Description**: "AI-powered adaptive physics tutor"
   - **Public** (keep it selected)
   - ✅ Check "Add a README file"
3. Click "Create repository"

### Step 3: Upload Files
1. You'll see your new empty repository
2. Click "Add file" → "Upload files"
3. **Extract the zip I gave you first!**
   - Find `ai-physics-tutor-deploy.tar.gz`
   - Right-click → Extract All (Windows) or Double-click (Mac)
4. Drag ALL the files from the extracted folder into GitHub:
   - index.html
   - PhysicsTutor.jsx
   - package.json
   - vercel.json
   - README.md
   - .gitignore
   - api folder (drag the whole folder)
5. At the bottom, click "Commit changes"
6. Done! Your code is on GitHub!

---

## Part 3: Deploy on Vercel (5 minutes)

### Step 1: Sign Up for Vercel
1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Click "Authorize Vercel"
4. Done!

### Step 2: Deploy Your Project
1. You'll see Vercel dashboard
2. Click "Add New..." → "Project"
3. You'll see a list - find your `ai-physics-tutor` repository
4. Click "Import" next to it
5. Don't change anything, just click "Deploy"
6. Wait 1 minute... ☕
7. 🎉 You'll see "Congratulations!"

### Step 3: Add Your Groq API Key
1. On the success screen, click "Continue to Dashboard"
2. Click "Settings" (top menu)
3. Click "Environment Variables" (left sidebar)
4. Click "Add New"
5. Fill in:
   - **Key**: `GROQ_API_KEY`
   - **Value**: [paste your Groq API key from Part 1]
6. Click "Save"

### Step 4: Redeploy with API Key
1. Click "Deployments" (top menu)
2. You'll see your deployment
3. Click the three dots ⋯ (on the right)
4. Click "Redeploy"
5. Click "Redeploy" again to confirm
6. Wait 1 minute...

### Step 5: Visit Your Live Site!
1. Click "Visit" or the URL shown
2. Your tutor is LIVE! 🎉

Your URL will be something like:
`https://ai-physics-tutor.vercel.app`

---

## Part 4: Share with Students

Just send them the URL! They can:
- Start immediately (no login)
- Take diagnostics
- Learn with AI tutor
- Track their progress

---

## If Something Goes Wrong

### "I can't extract the tar.gz file"
- Windows: Use 7-Zip (free): https://www.7-zip.org
- Mac: Should work by double-clicking

### "GitHub won't let me upload"
Make sure you:
- Are on the "Upload files" page
- Drag ALL files at once (not one by one)
- Wait for all files to show in the list before clicking "Commit"

### "Vercel deployment failed"
- Check if all files uploaded to GitHub correctly
- Make sure you added the `GROQ_API_KEY` environment variable
- Try redeploying

### "The tutor isn't responding to my answers"
- Check that the GROQ_API_KEY is set correctly in Vercel
- Check the Groq console to see if requests are going through
- Look at Vercel logs: Settings → Functions → View logs

---

## Costs

| Item | Cost |
|------|------|
| Vercel Hosting | **₹0** (free tier: 100GB bandwidth) |
| Groq LLM | **₹0** (free tier: 14,400 req/day) |
| Domain (optional) | ₹0 (use vercel.app subdomain) |
| **TOTAL** | **₹0 / month** 🎉 |

**Free tier limits:**
- ~1,400 students per day on Groq free tier
- 100GB bandwidth on Vercel (plenty!)

---

## What's Next?

### Week 1: Test It
- Share with 10-20 students
- Get feedback
- Watch Groq usage in console

### Week 2+: Improve
- Add more chapters
- Improve prompts based on responses
- Add visual aids
- Add progress tracking

### Future: Scale
- If you go over free limits, Groq is very cheap:
  - $0.05 per 1M tokens (still only ~₹5/month for 1000 students)
- Can upgrade Vercel if needed (but free tier is generous)

---

## Pro Tips

1. **Bookmark your Vercel dashboard** - you'll use it to check logs, analytics
2. **Star your GitHub repo** - easy to find later
3. **Join Groq Discord** - fast support if you need help
4. **Check Vercel analytics** - see how many students are using it

---

## Your URLs to Save

- **Live site**: `https://ai-physics-tutor.vercel.app` (will be different for you)
- **GitHub repo**: `https://github.com/YOUR_USERNAME/ai-physics-tutor`
- **Vercel dashboard**: `https://vercel.com/your-username/ai-physics-tutor`
- **Groq console**: `https://console.groq.com`

---

## Questions?

Tell me:
- Where you're stuck
- What error you see
- Screenshot if possible

I'll walk you through it!

