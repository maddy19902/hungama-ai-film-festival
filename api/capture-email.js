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
 * Send data to Notion API
 */
async function sendToNotion(email, source, timestamp) {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDbId = process.env.NOTION_DB_ID;

  if (!notionToken || !notionDbId) {
    console.error('Missing Notion credentials');
    return false;
  }

  try {
    const payload = {
      parent: { database_id: notionDbId },
      properties: {
        Email: { email: email },
        Source: { title: [{ text: { content: source } }] },
        Timestamp: { date: { start: timestamp } }
      }
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✓ Email captured: ${email} from ${source}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`Notion API error: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error(`Error sending to Notion: ${error.message}`);
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
  const { email, source, timestamp } = req.body;

  if (!email || !source) {
    res.status(400).json({ error: 'Missing email or source' });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Send to Notion (fail silently but log)
  const success = await sendToNotion(
    email,
    source,
    timestamp || new Date().toISOString()
  );

  // Always return 200 OK (graceful degradation)
  res.status(200).json({
    success: true,
    email: email,
    source: source
  });
}
