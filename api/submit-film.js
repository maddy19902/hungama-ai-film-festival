/**
 * Serverless Film Submission Endpoint (Vercel/Netlify/Firebase)
 * Deploy as /api/submit-film or ./functions/submit-film
 */

/**
 * Validate film submission data
 */
function validateSubmission(data) {
  const errors = [];
  
  if (!data.filmTitle || data.filmTitle.length < 3) {
    errors.push('Film title must be at least 3 characters');
  }
  
  if (!data.category || !['short', 'micro', 'commercial', 'music'].includes(data.category)) {
    errors.push('Invalid category');
  }
  
  const duration = parseInt(data.duration);
  if (!duration || duration < 5 || duration > 14400) {
    errors.push('Duration must be between 5 seconds and 4 hours');
  }
  
  if (!data.description || data.description.length < 20) {
    errors.push('Description must be at least 20 characters');
  }
  
  if (!data.creatorName || data.creatorName.length < 2) {
    errors.push('Creator name must be at least 2 characters');
  }
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Invalid email address');
  }
  
  if (!data.country) {
    errors.push('Country is required');
  }
  
  return errors;
}

/**
 * Generate unique reference ID
 */
function generateReferenceId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `HUNGAMA-${year}-${random}${timestamp}`;
}

/**
 * Store submission in Google Sheets
 */
async function storeSubmission(submissionData, videoFile) {
  const { google } = require('googleapis');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  
  if (!credentials.client_email || !spreadsheetId) {
    console.error('❌ Missing Google Sheets credentials');
    throw new Error('Google Sheets not configured');
  }
  
  try {
    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Prepare row data for "Submissions" tab
    const rowData = [
      submissionData.referenceId,
      submissionData.filmTitle,
      submissionData.category,
      submissionData.duration,
      submissionData.filmType,
      submissionData.description,
      submissionData.creatorName,
      submissionData.email,
      submissionData.country,
      submissionData.phone || '',
      submissionData.videoUrl || 'Uploading...',
      'Pending Review',
      new Date().toISOString()
    ];
    
    // Append to "Submissions" sheet (Tab 1)
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Submissions!A:M',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData]
      }
    });
    
    console.log('✓ Submission stored in Google Sheets:', submissionData.referenceId);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to store in Google Sheets:', error);
    throw error;
  }
}

/**
 * Upload video file to Google Drive
 */
async function uploadVideoFile(videoFile, referenceId) {
  const { google } = require('googleapis');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  
  if (!credentials.client_email || !folderId) {
    console.error('❌ Missing Google Drive credentials');
    throw new Error('Google Drive not configured');
  }
  
  try {
    // Authenticate with Google Drive
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Prepare file metadata
    const fileMetadata = {
      name: `${referenceId}_${videoFile.originalFilename}`,
      parents: [folderId]
    };
    
    // Upload file to Google Drive
    const media = {
      mimeType: videoFile.mimetype,
      body: require('fs').createReadStream(videoFile.filepath)
    };
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });
    
    // Make file accessible (viewer permissions)
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    console.log('✓ Video uploaded to Google Drive:', file.data.webViewLink);
    return file.data.webViewLink;
  } catch (error) {
    console.error('❌ Failed to upload to Google Drive:', error);
    throw error;
  }
}

/**
 * Send confirmation email to submitter
 */
async function sendConfirmationEmail(email, referenceId, filmTitle) {
  // TODO: Implement email sending
  // Options: SendGrid, AWS SES, Mailgun, Resend, etc.
  
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  
  if (sendgridApiKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: email }],
            subject: `Submission Confirmed - ${referenceId}`
          }],
          from: {
            email: 'submissions@hungamafestival.com',
            name: 'Hungama AI Film Festival'
          },
          content: [{
            type: 'text/html',
            value: `
              <h2>Submission Confirmed!</h2>
              <p>Thank you for submitting <strong>${filmTitle}</strong> to Hungama AI Film Festival.</p>
              <p><strong>Reference ID:</strong> ${referenceId}</p>
              <p>We'll notify you about the selection status by <strong>July 15, 2026</strong>.</p>
              <br>
              <p>Best regards,<br>The Hungama Team</p>
            `
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`SendGrid error: ${response.statusText}`);
      }
      
      console.log('✓ Confirmation email sent to:', email);
    } catch (error) {
      console.error('❌ Failed to send confirmation email:', error);
      // Don't throw - email failure shouldn't fail the submission
    }
  }
}

/**
 * Main handler for Vercel/Netlify
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse form data
    const { fields, files } = await parseMultipartForm(req);
    
    // Validate submission
    const validationErrors = validateSubmission(fields);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Validate video file
    const videoFile = files.videoFile;
    if (!videoFile) {
      return res.status(400).json({ error: 'Video file is required' });
    }
    
    if (videoFile.size > 250 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 250MB limit' });
    }
    
    const validTypes = [
      'video/mp4', 'video/quicktime', 'video/x-quicktime', 'video/webm',
      'video/x-msvideo', 'video/mpeg', 'video/x-m4v', 'video/3gpp',
      'video/x-flv', 'video/x-matroska'
    ];
    if (!validTypes.includes(videoFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid video format' });
    }
    
    // Generate reference ID
    const referenceId = generateReferenceId();
    
    // Prepare submission data
    const submissionData = {
      referenceId,
      filmTitle: fields.filmTitle,
      category: fields.category,
      duration: fields.duration,
      filmType: fields.filmType,
      description: fields.description,
      creatorName: fields.creatorName,
      email: fields.email,
      country: fields.country,
      phone: fields.phone || '',
      submittedAt: new Date().toISOString()
    };
    
    // Upload video file
    const videoUrl = await uploadVideoFile(videoFile, referenceId);
    submissionData.videoUrl = videoUrl;
    
    // Store submission in database
    await storeSubmission(submissionData, videoFile);
    
    // Send confirmation email
    await sendConfirmationEmail(
      submissionData.email,
      referenceId,
      submissionData.filmTitle
    );
    
    // Return success response
    return res.status(200).json({
      success: true,
      referenceId: referenceId,
      message: 'Submission received successfully'
    });
    
  } catch (error) {
    console.error('Submission handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Helper to parse multipart form data
 * (Use library like 'formidable' or 'multer' in production)
 */
async function parseMultipartForm(req) {
  // TODO: Implement proper multipart parsing
  // For Vercel: Use 'formidable' or 'busboy'
  // For Netlify: Use 'multiparty' or built-in parser
  
  // This is a placeholder - in production, use proper form parsing library
  return {
    fields: {
      filmTitle: req.body.filmTitle,
      category: req.body.category,
      duration: req.body.duration,
      filmType: req.body.filmType,
      description: req.body.description,
      creatorName: req.body.creatorName,
      email: req.body.email,
      country: req.body.country,
      phone: req.body.phone
    },
    files: {
      videoFile: req.files?.videoFile
    }
  };
}

/**
 * Configuration for API route (Vercel)
 */
export const config = {
  api: {
    bodyParser: false, // Disable default body parser for multipart
    responseLimit: false,
    externalResolver: true
  }
};
