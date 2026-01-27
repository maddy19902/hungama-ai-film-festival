#!/usr/bin/env node

/**
 * LOCAL TESTING SERVER - Mimics Cloudflare Pages Middleware Behavior
 * 
 * This server replicates the middleware logic locally so you can test
 * page access control on localhost before deploying to Cloudflare.
 * 
 * Usage:
 *   npm install express
 *   node server-local.js
 * 
 * Then visit http://localhost:8000 to test.
 * Try accessing blocked pages like http://localhost:8000/ceremony.html
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;
const BASE_DIR = __dirname;

// Allowed pages (must be linked from index.html)
const allowedPages = [
  'index',
  'vision',
  'nominees',
  'jury',
  'sponsors',
  'submit',
  'privacy',
  'terms',
  'contact'
];

/**
 * MIDDLEWARE: Page Access Control
 * Implements the same logic as Cloudflare _middleware.js
 */
app.use((req, res, next) => {
  const pathname = req.path.toLowerCase(); // Case-insensitive

  // Check if this is a .html request
  if (pathname.endsWith('.html')) {
    // Extract page name without .html extension
    const pageMatch = pathname.match(/\/([^/]+)\.html$/);
    
    if (pageMatch) {
      const pageName = pageMatch[1].toLowerCase(); // Lowercase for comparison
      
      // Check if this page is in the allowed list
      if (!allowedPages.includes(pageName)) {
        // BLOCKED: Issue 302 redirect to index.html
        console.log(`🚫 BLOCKED: ${pathname} → redirecting to /index.html`);
        return res.redirect(302, '/index.html');
      }
    }
  }

  // Allow all other requests
  next();
});

// Serve static files
app.use(express.static(BASE_DIR));

// Handle root path - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(BASE_DIR, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`✅ LOCAL TEST SERVER RUNNING`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📋 ALLOWED PAGES (accessible):');
  allowedPages.forEach(page => console.log(`   ✅ /${page}.html`));
  console.log('\n📋 BLOCKED PAGES (will redirect to /index.html):');
  console.log(`   ❌ /ceremony.html`);
  console.log(`   ❌ /honors.html`);
  console.log(`   ❌ /press.html`);
  console.log(`   ❌ /winners.html`);
  console.log(`   ❌ any other .html files\n`);
  console.log('🧪 TEST THESE URLs:');
  console.log(`   ✅ http://localhost:${PORT}/jury.html (ALLOWED)`);
  console.log(`   ❌ http://localhost:${PORT}/ceremony.html (BLOCKED → redirects to index)\n`);
  console.log('═══════════════════════════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server shutting down...');
  process.exit(0);
});
