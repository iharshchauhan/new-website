---
title: "Streamlit Deployment"
date: "2026-03-02"
description: "Deployment guide for the Streamlit pricing application."
---
# 🚀 STREAMLIT DEPLOYMENT GUIDE

## ✅ **Quick Test Locally (2 minutes)**

### Step 1: Navigate to App Directory
```bash
cd ai-dynamic-pricing/streamlit_app
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the App
```bash
streamlit run app.py
```

**Expected Output:**
```
You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
```

**Action:** Open `http://localhost:8501` in your browser

**What you should see:**
- ☕ Header with project title
- 📊 Six metric cards showing key results
- 💰 Interactive price predictor (left sidebar)
- 📈 Revenue lift chart
- 🔍 Expandable SHAP analysis
- ⚖️ Ethics framework section

**Test the predictor:**
1. Select "Latte"
2. Set time to 14:00 (2 PM)
3. Check "Cold" and "Rainy"
4. Click "Get Pricing Recommendation"
5. Should show: ₹42.22 with +9.1% adjustment

---

## 🌐 **Deploy to Streamlit Cloud (FREE - 5 minutes)**

### Prerequisites
- GitHub account
- Your `ai-dynamic-pricing` repo pushed to GitHub

---

### Step 1: Push Streamlit App to GitHub

```bash
# If not already in git
cd ai-dynamic-pricing
git add streamlit_app/
git commit -m "feat: Add Streamlit demo app"
git push origin main
```

**Verify:** Check GitHub - you should see `streamlit_app/` folder

---

### Step 2: Sign Up for Streamlit Cloud

1. Go to: https://streamlit.io/cloud
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Authorize Streamlit to access your repos

---

### Step 3: Deploy Your App

1. Click **"New app"** button
2. Fill in deployment settings:

```
Repository: yourusername/ai-dynamic-pricing
Branch: main
Main file path: streamlit_app/app.py
App URL: ai-dynamic-pricing (or choose custom name)
```

3. Click **"Deploy!"**

**Wait 2-3 minutes** while Streamlit builds your app

---

### Step 4: Get Your Public URL

Once deployed, you'll get a URL like:
```
https://ai-dynamic-pricing-yourname.streamlit.app
```

**Test it:**
- Open the URL in incognito/private window
- Verify all sections load correctly
- Test the price predictor

---

### Step 5: Update Your Portfolio & README

**In `portfolio-website/components/projects.tsx`:**
```typescript
demo: "https://ai-dynamic-pricing-yourname.streamlit.app", // UPDATE THIS
```

**In `ai-dynamic-pricing/README.md`:**
```markdown
🎯 **[Live Demo →](https://ai-dynamic-pricing-yourname.streamlit.app)**
```

**Commit and push:**
```bash
git add .
git commit -m "feat: Add Streamlit demo URL"
git push
```

---

## 🎨 **Customization (Optional)**

### Update Links

**In `streamlit_app/app.py`, find these lines and update:**

```python
# Line 178: Portfolio link
st.link_button("📖 Full Case Study", "https://your-portfolio-site.com/projects/ai-dynamic-pricing")

# Line 180: GitHub link
st.link_button("💻 View GitHub", "https://github.com/yourusername/ai-dynamic-pricing")

# Line 182: Email
st.link_button("📧 Contact Me", "mailto:your.email@example.com")
```

**Also update these sections:**
- Line 395: Case study link
- Line 400: GitHub link
- Line 405: Contact email

**After updating:**
```bash
cd streamlit_app
git add app.py
git commit -m "fix: Update portfolio and GitHub links"
git push
```

Streamlit Cloud will **auto-redeploy** in ~1 minute!

---

### Add Real Model (Optional)

If you want to load your actual trained model instead of simulated pricing:

**Step 1:** Copy model file to streamlit_app folder:
```bash
cp model/xgboost_optimized_with_weather.pkl streamlit_app/
```

**Step 2:** Update `app.py` line 47-54:
```python
@st.cache_resource
def load_model():
    """Load the trained model"""
    with open('xgboost_optimized_with_weather.pkl', 'rb') as f:
        return pickle.load(f)
```

**Step 3:** Update requirements.txt:
```
streamlit==1.31.0
pandas==2.1.4
numpy==1.26.3
plotly==5.18.0
xgboost==2.0.3
scikit-learn==1.3.2
```

---

## 🐛 **Troubleshooting**

### Issue: "ModuleNotFoundError: No module named 'streamlit'"
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: Port 8501 already in use
**Solution:**
```bash
streamlit run app.py --server.port 8502
```

### Issue: App doesn't load on Streamlit Cloud
**Solution:**
1. Check logs in Streamlit Cloud dashboard
2. Verify `requirements.txt` is in `streamlit_app/` folder
3. Ensure `app.py` path is correct: `streamlit_app/app.py`

### Issue: Links don't work
**Solution:**
- Update all URLs in `app.py` (search for "your-portfolio-site.com" and "yourusername")
- Push changes to GitHub
- Streamlit Cloud auto-redeploys

---

## ✅ **Deployment Checklist**

- [ ] Tested app locally (`streamlit run app.py`)
- [ ] Pushed `streamlit_app/` folder to GitHub
- [ ] Created Streamlit Cloud account
- [ ] Deployed app to Streamlit Cloud
- [ ] Got public URL (https://...streamlit.app)
- [ ] Updated portfolio website with demo URL
- [ ] Updated README.md with demo URL
- [ ] Tested demo in incognito window
- [ ] Verified all links work
- [ ] Updated placeholder URLs in app.py

---

## 🎯 **What Recruiters Will See**

**URL:** `https://ai-dynamic-pricing-yourname.streamlit.app`

**Experience:**
1. **0-5 sec:** Header loads, sees "16% margin lift"
2. **5-30 sec:** Tries price predictor, sees instant results
3. **30-60 sec:** Scrolls to backtest chart, sees consistent lift
4. **60-90 sec:** Expands SHAP section, sees feature importance
5. **90-120 sec:** Clicks "View Full Case Study" → Goes to your portfolio

**Result:** ✅ **Moves you to interview stage**

---

## 📧 **Need Help?**

**Common issues:**
- Deployment failing? Check Python version (needs 3.9+)
- Links not working? Search/replace all placeholder URLs
- Styling broken? Verify `.streamlit/config.toml` exists

---

## 🚀 **Next Steps After Deployment**

1. ✅ Get demo URL
2. ✅ Update portfolio website
3. ✅ Update README.md
4. ✅ Test everything works
5. ✅ **Start applying to jobs!**

Then create:
- LinkedIn announcement post
- Resume bullet points
- Recruiter email template

**You're 5 minutes away from a complete portfolio!** 🎯

