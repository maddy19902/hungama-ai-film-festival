# Pre-Deployment Checklist

## ✅ Code Changes Completed

### Submit Page (submit.html)
- [x] Email validation regex upgraded to RFC 5322
- [x] Duration validator rejects 0 values
- [x] Video file type whitelist expanded (MOV, MKV, etc.)
- [x] Country dropdown has semantic roles and keyboard nav
- [x] File upload pre-validates size (250MB)
- [x] Error messages scroll to center of viewport
- [x] Form reset clears all validation states
- [x] Real API submission endpoint integrated
- [x] Progress indicator displays during upload
- [x] Email auto-populates from sessionStorage
- [x] Animation keyframes added
- [x] Duration input constraints (min/max)

### Contact Page (contact.html)
- [x] Contact form has proper event handler
- [x] Email capture wired to backend API
- [x] Success/error status messages
- [x] Form validation and reset

### Backend APIs
- [x] `/api/submit-film.js` created (full submission handler)
- [x] `/api/capture-email.js` updated (contact form support)

### Documentation
- [x] SUBMIT_PAGE_REDESIGN_COMPLETE.md
- [x] BACKEND_SETUP_GUIDE.md
- [x] BUG_FIXES_VISUAL_REPORT.md
- [x] PRE_DEPLOYMENT_CHECKLIST.md (this file)

---

## 🔧 Backend Configuration Needed

### Environment Variables (Add to Vercel/Netlify)

```bash
# Email Capture
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_DB_ID=xxxxxxxxxxxx

# Film Submissions
NOTION_SUBMISSIONS_DB_ID=xxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### Notion Setup
- [ ] Create Email Capture database with properties:
  - Email (email)
  - Source (title)
  - Timestamp (date)
  - Name (text) - optional
  - Message (text) - optional

- [ ] Create Submissions database with properties:
  - Reference ID (title)
  - Film Title (text)
  - Category (select: short, micro, commercial, music)
  - Duration (number)
  - Film Type (text)
  - Description (text)
  - Creator Name (text)
  - Email (email)
  - Country (text)
  - Phone (phone)
  - Status (select: Pending, Under Review, Accepted, Rejected)
  - Submission Date (date)
  - Video URL (url) - optional

- [ ] Share databases with Notion integration
- [ ] Copy database IDs and token to env vars

### Cloudinary Setup (Optional)
- [ ] Sign up at cloudinary.com
- [ ] Create upload preset: `hungama_submissions`
- [ ] Configure folder: `submissions/`
- [ ] Set resource type: Video
- [ ] Copy credentials to env vars

### SendGrid Setup (Optional)
- [ ] Sign up at sendgrid.com
- [ ] Create API key with Mail Send permissions
- [ ] Verify sender email: `submissions@hungamafestival.com`
- [ ] Copy API key to env vars

---

## 🧪 Testing Checklist

### Pre-Deployment Tests (Local)

#### Submit Form - Validation
- [ ] Film title requires 3+ characters
- [ ] Category is required
- [ ] Duration rejects 0 and values < 5 seconds
- [ ] Duration rejects values > 4 hours (14400 seconds)
- [ ] Description requires 20+ characters
- [ ] Creator name requires 2+ characters
- [ ] Email validation works (try: test@test..com should fail)
- [ ] Country dropdown shows all countries
- [ ] Video file validates type
- [ ] Video file validates size (250MB limit)
- [ ] Form shows error summary when validation fails

#### Submit Form - UX
- [ ] Email auto-populates if coming from email capture
- [ ] Auto-populated email has green highlight
- [ ] Duration auto-calculates film type
- [ ] Country dropdown opens on focus
- [ ] Country dropdown filters on type
- [ ] Keyboard navigation works in country dropdown:
  - [ ] Arrow Down navigates down
  - [ ] Arrow Up navigates up
  - [ ] Enter/Space selects country
  - [ ] Escape closes dropdown
- [ ] File upload shows filename after selection
- [ ] File upload shows file size
- [ ] Drag and drop works for file upload
- [ ] Large file (>250MB) shows alert before processing
- [ ] Error messages scroll to center of viewport
- [ ] Review screen shows all submitted data
- [ ] Terms checkbox is required
- [ ] Back button returns to edit mode

#### Contact Form
- [ ] Name field is required
- [ ] Email field is required
- [ ] Message field is required
- [ ] Form shows success message
- [ ] Form resets after successful submission
- [ ] Email is stored in sessionStorage

#### Mobile Responsiveness
- [ ] Submit form displays correctly on mobile
- [ ] Country dropdown doesn't overflow screen
- [ ] File upload is touch-friendly
- [ ] Step indicator wraps on narrow screens
- [ ] Navigation hamburger menu works
- [ ] Contact form displays correctly

---

### Post-Deployment Tests (Production)

#### API Endpoints
- [ ] `/api/capture-email` accepts POST requests
- [ ] `/api/capture-email` returns 200 OK
- [ ] `/api/capture-email` stores data in Notion
- [ ] `/api/submit-film` accepts POST requests
- [ ] `/api/submit-film` validates form data
- [ ] `/api/submit-film` rejects invalid files
- [ ] `/api/submit-film` generates reference ID
- [ ] `/api/submit-film` stores submission in Notion
- [ ] `/api/submit-film` uploads video to Cloudinary (if configured)
- [ ] `/api/submit-film` sends confirmation email (if configured)

#### End-to-End Flow
- [ ] User lands on homepage
- [ ] User captures email via CTA
- [ ] User navigates to submit page
- [ ] Email is pre-filled in form
- [ ] User fills out all required fields
- [ ] User uploads video file
- [ ] User proceeds to review screen
- [ ] User accepts terms
- [ ] User submits form
- [ ] Progress indicator shows during upload
- [ ] Success screen displays with reference ID
- [ ] Submission appears in Notion database
- [ ] Video appears in Cloudinary (if configured)
- [ ] Confirmation email arrives (if configured)

#### Error Handling
- [ ] Try submitting without required fields - shows errors
- [ ] Try uploading invalid file type - shows error
- [ ] Try uploading oversized file - shows alert
- [ ] Try invalid email format - shows error
- [ ] Simulate network failure - shows error message
- [ ] Check backend doesn't crash on invalid data

---

## 🚀 Deployment Steps

### 1. Push Code to Git
```bash
git add .
git commit -m "Fix: Submit page bugs + backend integration"
git push origin main
```

### 2. Deploy to Hosting Platform

#### Vercel
```bash
# If first time
vercel

# If already deployed
vercel --prod
```

#### Netlify
```bash
# Via CLI
netlify deploy --prod

# Or push to main branch (auto-deploy)
```

### 3. Configure Environment Variables

Go to your hosting dashboard and add all required env vars:
- Notion Token & Database IDs
- Cloudinary credentials (optional)
- SendGrid API key (optional)

### 4. Verify Deployment
- [ ] Visit production URL
- [ ] Test form submission with real data
- [ ] Check Notion database for new entry
- [ ] Verify email confirmation arrives

---

## 🐛 Rollback Plan

If something goes wrong:

### Immediate Rollback (Vercel)
```bash
vercel rollback
```

### Immediate Rollback (Netlify)
1. Go to Deploys tab
2. Find previous working deployment
3. Click "Publish deploy"

### Manual Rollback
```bash
git revert HEAD
git push origin main
```

---

## 📊 Monitoring

### What to Watch After Deployment

#### First 24 Hours
- [ ] Monitor error logs in hosting dashboard
- [ ] Check Notion database for new submissions
- [ ] Verify email notifications are sending
- [ ] Watch for any user-reported issues

#### First Week
- [ ] Check submission success rate
- [ ] Monitor file upload failures
- [ ] Review validation error patterns
- [ ] Collect user feedback

#### Ongoing
- [ ] Set up alerts for API failures
- [ ] Monitor database size (Notion row limits)
- [ ] Track Cloudinary storage usage
- [ ] Review SendGrid email delivery rates

---

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)

- **Form Completion Rate:** Target >70%
- **Submission Success Rate:** Target 100%
- **Email Capture Rate:** Target >50%
- **Page Load Time:** Target <3 seconds
- **Mobile Bounce Rate:** Target <30%

### Analytics to Track
- Form abandonment points
- Most common validation errors
- Average time to complete submission
- Video upload success rate
- Email delivery rate

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions

**Issue:** Form submits but nothing happens  
**Solution:** Check API route exists at `/api/submit-film.js` and environment variables are set

**Issue:** "Method not allowed" error  
**Solution:** Ensure API config has `bodyParser: false` for file uploads

**Issue:** Notion error "Database not found"  
**Solution:** Verify database is shared with integration and ID is correct

**Issue:** Video upload fails  
**Solution:** Check Cloudinary credentials and upload preset configuration

**Issue:** Email doesn't arrive  
**Solution:** Verify SendGrid sender email is verified and API key has permissions

### Where to Check Logs
- **Vercel:** Functions → Logs
- **Netlify:** Functions → Function log
- **Browser:** DevTools Console
- **Notion:** Integration logs

---

## ✨ Optional Enhancements (Future)

### Phase 2 Features
- [ ] Add reCAPTCHA v3 for spam protection
- [ ] Implement rate limiting
- [ ] Add file malware scanning
- [ ] Add resume upload capability
- [ ] Add offline draft saving
- [ ] Add payment integration for submission fees
- [ ] Create submitter dashboard

### Analytics Integration
- [ ] Google Analytics events
- [ ] Conversion tracking
- [ ] Heatmap tracking (Hotjar)
- [ ] Error tracking (Sentry)

---

## 🎉 Launch Checklist

### Final Pre-Launch Verification
- [x] All code changes committed
- [x] All bugs from audit fixed
- [x] Documentation complete
- [ ] Environment variables configured
- [ ] Notion databases created
- [ ] Backend services tested
- [ ] End-to-end flow tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility tested
- [ ] Error handling verified
- [ ] Rollback plan ready
- [ ] Monitoring set up

### Post-Launch (First Hour)
- [ ] Submit test submission
- [ ] Verify test appears in Notion
- [ ] Check confirmation email
- [ ] Monitor error logs
- [ ] Test on mobile device
- [ ] Test from different locations

### Post-Launch (First Day)
- [ ] Review all submissions
- [ ] Check for error patterns
- [ ] Collect initial user feedback
- [ ] Monitor performance metrics
- [ ] Check email delivery rates

---

## 🎓 Handoff Notes

### For Backend Team
- All validation rules documented in code comments
- API endpoints follow Vercel/Netlify serverless patterns
- Graceful degradation implemented for missing services
- Error handling comprehensive with user-friendly messages

### For Frontend Team
- All UI changes maintain existing design system
- No breaking changes to HTML structure
- JavaScript is ES6+ with proper error handling
- Mobile-first responsive approach maintained

### For QA Team
- Test cases documented in this file
- Focus areas: form validation, file upload, email flow
- Check accessibility with screen readers
- Test on iOS Safari and Android Chrome

---

**Last Updated:** January 27, 2026  
**Status:** ✅ Ready for Backend Setup & Deployment  
**Next Step:** Configure environment variables and deploy
