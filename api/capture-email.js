/**
 * Serverless Email Capture Endpoint (Vercel/Netlify/Firebase)
 * Deploy as /api/capture-email or ./functions/capture-email
 */

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send contact form data to Google Sheets
 */
async function sendToGoogleSheets(email, source, timestamp, name, message) {
  const { google } = require('googleapis');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!credentials.client_email || !spreadsheetId) {
    console.error('Missing Google Sheets credentials');
    return false;
  }

  try {
    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Prepare row data for "Contact Enquiries" tab
    const rowData = [
      timestamp,
      source,
      name || '',
      email,
      message || '',
      'New'
    ];
    
    // Append to "Contact Enquiries" sheet (Tab 2)
    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Contact Enquiries!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData]
      }
    });

    console.log(`✓ Contact form captured: ${email} from ${source}`);
    return true;
  } catch (error) {
    console.error(`Error sending to Google Sheets: ${error.message}`);
    return false;
  }
}

/**
 * Main handler for serverless platforms
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only handle POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validate input
  const { email, source, timestamp, name, message } = req.body;

  if (!email || !source) {
    res.status(400).json({ error: 'Missing email or source' });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Send to Google Sheets (fail silently but log)
  const success = await sendToGoogleSheets(
    email,
    source,
    timestamp || new Date().toISOString(),
    name,
    message
  );

  // Always return 200 OK (graceful degradation)
  res.status(200).json({
    success: true,
    email: email,
    source: source
  });
}
