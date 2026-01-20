/**
 * Email Capture API Endpoint
 * Handles email submissions and stores them in Notion database
 * 
 * Environment Variables Required:
 * - NOTION_TOKEN: Notion API token (starts with notionedit_)
 * - NOTION_DB_ID: Notion database ID for email storage
 * - NODE_ENV: development or production
 */

const https = require('https');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send POST request to Notion API
 */
function sendToNotion(email, source, timestamp, callback) {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDbId = process.env.NOTION_DB_ID;

  if (!notionToken || !notionDbId) {
    console.error('Missing Notion credentials in environment');
    return callback(false);
  }

  const payload = {
    parent: { database_id: notionDbId },
    properties: {
      Email: { email: email },
      Source: { title: [{ text: { content: source } }] },
      Timestamp: { date: { start: timestamp } }
    }
  };

  const options = {
    hostname: 'api.notion.com',
    port: 443,
    path: '/v1/pages',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✓ Email captured: ${email} from ${source}`);
        callback(true);
      } else {
        console.error(`Notion API error: ${res.statusCode} - ${data}`);
        callback(false);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    callback(false);
  });

  req.write(JSON.stringify(payload));
  req.end();
}

/**
 * Parse POST body
 */
function parsePostData(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch (e) {
      callback(null);
    }
  });
}

/**
 * Main request handler
 */
function requestHandler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only handle POST to /api/capture-email
  const parsedUrl = url.parse(req.url);
  
  if (req.method !== 'POST' || parsedUrl.pathname !== '/api/capture-email') {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Parse request body
  parsePostData(req, (data) => {
    if (!data || !data.email || !data.source) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Missing required fields' }));
      return;
    }

    // Validate email
    if (!validateEmail(data.email)) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid email format' }));
      return;
    }

    // Send to Notion (fail silently)
    sendToNotion(data.email, data.source, data.timestamp || new Date().toISOString(), (success) => {
      // Always return 200 OK even if Notion fails (graceful degradation)
      res.writeHead(200);
      res.end(JSON.stringify({ 
        success: true,
        email: data.email,
        source: data.source
      }));
    });
  });
}

/**
 * Create and start server
 */
function startServer() {
  const port = process.env.PORT || 3000;
  const server = http.createServer(requestHandler);

  server.listen(port, () => {
    console.log(`✓ Email capture server running on port ${port}`);
    console.log(`✓ Endpoint: POST /api/capture-email`);
    console.log(`✓ Notion DB ID: ${process.env.NOTION_DB_ID || 'NOT SET'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close();
    process.exit(0);
  });
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { requestHandler, validateEmail, sendToNotion };
