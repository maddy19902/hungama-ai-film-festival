# Google Sheets + Drive Setup Guide

## ✅ What I Fixed (BUGS, Not Visual Redesign)

### The 16 Bug Fixes (Already Working in Frontend):
1. ✅ Email validation improved (try `test@test..com` - now fails correctly)
2. ✅ Duration validation rejects 0 seconds
3. ✅ Video file types - .MOV, .MKV now accepted
4. ✅ Country dropdown keyboard navigation (Arrow keys work)
5. ✅ File size warning before upload (>250MB shows alert)
6. ✅ Error messages scroll to center
7. ✅ Form reset clears all states
8. ✅ Email auto-populates from sessionStorage
9. ✅ Progress indicator ready
10. ✅ All other frontend validation fixes

**Visual appearance = UNCHANGED** (let me know if you want design changes)

---

## 🚀 Backend Setup for Google Sheets + Drive

### What You Need:

1. **Google Sheet** with 2 tabs:
   - Tab 1: "Submissions" (for film submissions)
   - Tab 2: "Contact Enquiries" (for contact form)

2. **Google Drive Folder** (for video uploads)

3. **Google Service Account** (to access from code)

### Step-by-Step Setup (30 minutes):

---

## 📊 Step 1: Create Google Sheet

### A. Create the Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet
3. Name it: **"Hungama Festival Submissions"**

### B. Set Up Tab 1: "Submissions"

Rename "Sheet1" to **"Submissions"**

**Add these column headers in Row 1:**

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Reference ID | Film Title | Category | Duration | Film Type | Description | Creator Name | Email | Country | Phone | Video Link | Status | Submitted At |

### C. Set Up Tab 2: "Contact Enquiries"

Click "+" to add new sheet, name it **"Contact Enquiries"**

**Add these column headers in Row 1:**

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Timestamp | Source | Name | Email | Message | Status |

### D. Copy Spreadsheet ID

From your URL: `https://docs.google.com/spreadsheets/d/`**COPY_THIS_PART**`/edit`

Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

**Save this ID!** You'll need it.

---

## 📁 Step 2: Create Google Drive Folder

1. Go to [drive.google.com](https://drive.google.com)
2. Create new folder: **"Hungama Submissions"**
3. Open the folder
4. Copy Folder ID from URL: `https://drive.google.com/drive/folders/`**COPY_THIS_PART**

**Save this ID!** You'll need it.

---

## 🔐 Step 3: Create Service Account

### A. Go to Google Cloud Console

1. Visit: [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "Hungama Festival"
3. Select the project

### B. Enable APIs

1. Go to **"APIs & Services"** → **"Enable APIs and Services"**
2. Search and enable:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### C. Create Service Account

1. Go to **"IAM & Admin"** → **"Service Accounts"**
2. Click **"Create Service Account"**
3. Name: `hungama-backend`
4. Click **"Create and Continue"**
5. Role: Select **"Editor"** (or "Basic" → "Editor")
6. Click **"Done"**

### D. Create Key

1. Click on the service account you just created
2. Go to **"Keys"** tab
3. Click **"Add Key"** → **"Create New Key"**
4. Choose **JSON**
5. Click **"Create"**
6. **Download the JSON file** - KEEP IT SAFE!

The file looks like:
```json
{
  "type": "service_account",
  "project_id": "hungama-festival-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "hungama-backend@hungama-festival-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  ...
}
```

---

## 🔗 Step 4: Grant Access

### A. Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click **"Share"**
3. Add the **client_email** from your JSON file (looks like `xxxxx@xxxxx.iam.gserviceaccount.com`)
4. Give **"Editor"** permission
5. Click **"Send"**

### B. Share Google Drive Folder with Service Account

1. Open your Google Drive folder
2. Click **"Share"**
3. Add the same **client_email**
4. Give **"Editor"** permission
5. Click **"Send"**

---

## 🚀 Step 5: Deploy to Vercel

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login to Vercel

```bash
vercel login
```

### C. Add Dependencies

Create or update `package.json` in your project:

```json
{
  "name": "hungama-festival-site",
  "version": "1.0.0",
  "dependencies": {
    "googleapis": "^128.0.0",
    "formidable": "^3.5.1"
  }
}
```

Install:
```bash
npm install
```

### D. Set Environment Variables in Vercel

```bash
cd /Users/madhav/hungama-festival-site
vercel
```

After deployment, go to Vercel dashboard:

1. Go to your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

**Variable 1:**
- Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
- Value: **Paste ENTIRE contents of your JSON file**

**Variable 2:**
- Name: `GOOGLE_SHEET_ID`
- Value: Your spreadsheet ID (from Step 1)

**Variable 3:**
- Name: `GOOGLE_DRIVE_FOLDER_ID`
- Value: Your folder ID (from Step 2)

4. Click **"Save"**
5. Redeploy: `vercel --prod`

---

## ✅ Test Your Setup

### Test 1: Contact Form

1. Go to your deployed site: `https://your-site.vercel.app/contact.html`
2. Fill out contact form
3. Submit
4. Check **"Contact Enquiries"** tab in Google Sheets
5. Should see new row!

### Test 2: Film Submission

1. Go to `https://your-site.vercel.app/submit.html`
2. Fill out entire form
3. Upload a small video file (test with <10MB first)
4. Submit
5. Check **"Submissions"** tab in Google Sheets
6. Check **"Hungama Submissions"** folder in Google Drive
7. Should see:
   - New row in Sheets ✅
   - Video file in Drive ✅
   - Google Drive link in "Video Link" column ✅

---

## 🐛 Troubleshooting

### Error: "Google Sheets not configured"
**Fix:** Check environment variables are set correctly in Vercel

### Error: "Permission denied"
**Fix:** Make sure you shared Sheet + Drive folder with service account email

### Error: "The caller does not have permission"
**Fix:** Enable Google Sheets API and Google Drive API in Cloud Console

### Video upload fails
**Fix:** 
1. Check file size (<250MB)
2. Check Drive folder has enough space
3. Check service account has Editor permission

### Row not appearing in Google Sheets
**Fix:**
1. Check Sheet name is exactly "Submissions" or "Contact Enquiries"
2. Check column range matches (A:M for submissions, A:F for contact)
3. Check service account has Editor permission

---

## 📋 Environment Variables Summary

You need to set these in Vercel:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...entire JSON...}
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_DRIVE_FOLDER_ID=1xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**No email configuration needed** (removed SendGrid requirement)

---

## 🎯 What Happens When User Submits:

```
1. User fills form on submit.html
2. Clicks "Submit"
3. Form data + video → /api/submit-film endpoint
4. Backend:
   a. Validates data
   b. Uploads video to your Google Drive folder
   c. Gets shareable link from Drive
   d. Writes row to "Submissions" tab with link
   e. Returns success with Reference ID
5. User sees success screen
6. You check Google Sheets → See submission with Drive link!
```

---

## 💰 Cost

- Google Sheets: **FREE** (up to 10 million cells)
- Google Drive: **FREE** (15GB storage, then $1.99/month for 100GB)
- Vercel: **FREE** (hobby plan, 100GB bandwidth)
- **Total: $0-2/month**

---

## 🎓 Next Steps

1. Follow Steps 1-5 above
2. Test contact form first (simpler)
3. Test submission form with small video
4. Once working, test with full-size video

**After setup, your submit page will be fully functional!**

Let me know when you complete Step 3 (Service Account) and I can help debug if needed.
