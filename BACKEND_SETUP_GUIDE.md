# Backend Setup Guide - Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

For Vercel deployment, you'll need:
```bash
npm install formidable
```

For handling multipart form data with file uploads.

### 2. Environment Variables

Add these to your Vercel/Netlify dashboard:

```bash
# Email Capture (Optional)
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_DB_ID=xxxxxxxxxxxx

# Film Submissions (Optional)
NOTION_SUBMISSIONS_DB_ID=xxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### 3. Notion Database Schemas

#### Email Capture Database
Properties needed:
- **Email** (email) - Primary
- **Source** (title) - e.g., "contact-form", "homepage-cta"
- **Timestamp** (date)
- **Name** (text) - Optional, for contact form
- **Message** (text) - Optional, for contact form

#### Submissions Database
Properties needed:
- **Reference ID** (title) - e.g., "HUNGAMA-2026-ABC123XYZ"
- **Film Title** (text)
- **Category** (select) - Options: short, micro, commercial, music
- **Duration** (number) - In seconds
- **Film Type** (text) - Auto-calculated
- **Description** (text)
- **Creator Name** (text)
- **Email** (email)
- **Country** (text)
- **Phone** (phone)
- **Status** (select) - Options: Pending Review, Under Review, Accepted, Rejected
- **Submission Date** (date)
- **Video URL** (url) - Optional, if using Cloudinary

### 4. Cloudinary Setup (Optional)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Settings → Upload
3. Create upload preset:
   - Name: `hungama_submissions`
   - Signing Mode: Unsigned (or Signed with auth)
   - Folder: `submissions/`
   - Resource Type: Video
4. Copy Cloud Name, API Key, API Secret to env vars

### 5. SendGrid Setup (Optional)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API Key with Mail Send permissions
3. Verify sender email: `submissions@hungamafestival.com`
4. Add API key to env vars

---

## 🧪 Testing Without Backend

The form gracefully degrades if backend services aren't configured:

### Local Testing
```bash
# Start local server
python3 -m http.server 8000

# Or use Node.js
npx http-server -p 8000
```

### What Works Without Setup:
- ✅ Form validation (client-side)
- ✅ File upload UI
- ✅ Progress indicator
- ✅ Success screen
- ❌ Actual data storage
- ❌ Video upload to cloud
- ❌ Email notifications

### Console Logs
Without backend, you'll see:
```
⚠️ Video upload not configured - using placeholder
📝 Submission received: { filmTitle: "...", ... }
```

---

## 📦 Deployment Checklist

### Before Deploying:

- [ ] Add all environment variables to hosting platform
- [ ] Create Notion databases with correct schemas
- [ ] Set up Cloudinary upload preset
- [ ] Verify SendGrid sender email
- [ ] Test email capture endpoint
- [ ] Test submission endpoint with small file
- [ ] Test submission endpoint with large file (>100MB)
- [ ] Verify error handling works
- [ ] Check CORS headers allow your domain

### After Deploying:

- [ ] Test form submission end-to-end
- [ ] Verify email arrives in Notion
- [ ] Check video uploads to Cloudinary
- [ ] Confirm confirmation email sends
- [ ] Test error scenarios (invalid email, too large file)
- [ ] Verify mobile responsiveness
- [ ] Check accessibility with screen reader

---

## 🐛 Troubleshooting

### Form Submits But Nothing Happens
**Problem:** API endpoint not found  
**Solution:** Ensure `/api/submit-film.js` is in correct location for your platform:
- Vercel: `/api/submit-film.js`
- Netlify: `/functions/submit-film.js` or `/netlify/functions/submit-film.js`

### "Method Not Allowed" Error
**Problem:** POST request not reaching handler  
**Solution:** Check API route configuration in `vercel.json` or `netlify.toml`

### File Upload Fails
**Problem:** Body parser interfering with multipart data  
**Solution:** Ensure `bodyParser: false` in API config:
```javascript
export const config = {
  api: {
    bodyParser: false
  }
};
```

### Notion Error: "Database not found"
**Problem:** Incorrect database ID or missing permissions  
**Solution:**
1. Share database with integration
2. Copy database ID from URL: `notion.so/workspace/DATABASE_ID?v=...`
3. Verify token has correct permissions

### Cloudinary Upload Timeout
**Problem:** Large files timing out  
**Solution:**
1. Increase function timeout in platform settings
2. Consider chunked upload for files >100MB
3. Use Cloudinary's server-side SDK instead of browser upload

---

## 🔄 Alternative Backend Options

### Option 1: Airtable (Instead of Notion)
```javascript
const response = await fetch('https://api.airtable.com/v0/BASE_ID/Submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fields: {
      'Reference ID': referenceId,
      'Film Title': filmTitle,
      // ...
    }
  })
});
```

### Option 2: Google Sheets (Via Apps Script)
Deploy as Web App and POST to it:
```javascript
const response = await fetch('YOUR_APPS_SCRIPT_URL', {
  method: 'POST',
  body: JSON.stringify(submissionData)
});
```

### Option 3: Firebase/Firestore
```javascript
import { db } from './firebase-config';
import { collection, addDoc } from 'firebase/firestore';

await addDoc(collection(db, 'submissions'), submissionData);
```

### Option 4: Direct Email (No Database)
Use only SendGrid to email submissions:
```javascript
// Send submission details as email
await sendEmail({
  to: 'submissions@hungamafestival.com',
  subject: `New Submission: ${filmTitle}`,
  html: formatSubmissionEmail(submissionData)
});
```

---

## 📊 Monitoring & Analytics

### Recommended Tracking Events:
```javascript
// Add to submit.html after successful submission
gtag('event', 'form_submission', {
  'event_category': 'Film Submission',
  'event_label': referenceId,
  'value': 1
});
```

### Error Tracking:
```javascript
// Add to catch blocks
console.error('Submission error:', error);
// Optional: Send to Sentry, LogRocket, etc.
```

---

## 🔐 Security Hardening (Production)

### Rate Limiting (Vercel)
Add to `vercel.json`:
```json
{
  "functions": {
    "api/submit-film.js": {
      "maxDuration": 300,
      "memory": 3008
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### File Type Validation (Server-Side)
```javascript
import fileType from 'file-type';

const type = await fileType.fromBuffer(fileBuffer);
if (!validVideoTypes.includes(type.mime)) {
  throw new Error('Invalid file type');
}
```

### Virus Scanning
```javascript
import clamav from 'clamav.js';

const scanResult = await clamav.scan(filePath);
if (!scanResult.isClean) {
  throw new Error('File failed security scan');
}
```

---

## 💡 Pro Tips

1. **Start Simple:** Deploy with just Notion integration first
2. **Test Locally:** Use ngrok to test webhooks locally
3. **Monitor Logs:** Check Vercel/Netlify function logs regularly
4. **Backup Data:** Export Notion database weekly
5. **Set Alerts:** Configure alerts for API failures
6. **Version Control:** Keep backup of working API endpoints

---

## 📞 Quick Links

- Vercel Functions Docs: https://vercel.com/docs/functions
- Netlify Functions Docs: https://docs.netlify.com/functions/overview/
- Notion API Docs: https://developers.notion.com/
- Cloudinary Docs: https://cloudinary.com/documentation
- SendGrid Docs: https://docs.sendgrid.com/

---

**Need Help?**  
Check the detailed documentation in `SUBMIT_PAGE_REDESIGN_COMPLETE.md`
