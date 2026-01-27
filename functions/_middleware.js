/**
 * CLOUDFLARE PAGES MIDDLEWARE - Page Access Control
 * 
 * This middleware runs on Cloudflare's Edge and controls which pages are accessible.
 * Only pages linked from index.html can be accessed. All others redirect to index.html with 302 status.
 * 
 * ALLOWED PAGES:
 * - index.html (homepage)
 * - vision.html (About)
 * - nominees.html (Categories)
 * - jury.html (Jury)
 * - sponsors.html (Partners)
 * - submit.html (Submit)
 * - privacy.html (Privacy Policy - footer)
 * - terms.html (Terms & Conditions - footer)
 * - contact.html (Contact - footer)
 * 
 * BLOCKED PAGES:
 * - ceremony.html (Event - commented out, pending details)
 * - honors.html
 * - press.html
 * - winners.html
 * - Any other .html files not in allowed list
 * 
 * CSS, JS, images, and API endpoints pass through untouched.
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase(); // Case-insensitive

  // Allowed pages (without .html extension for matching)
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

  // Check if pathname is a .html request
  if (pathname.endsWith('.html')) {
    // Extract page name without .html extension
    const pageMatch = pathname.match(/\/([^/]+)\.html$/);
    
    if (pageMatch) {
      const pageName = pageMatch[1].toLowerCase(); // Lowercase for comparison
      
      // Check if this page is in the allowed list
      if (!allowedPages.includes(pageName)) {
        // BLOCKED: Issue 302 redirect to index.html
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/index.html',
            'Cache-Control': 'no-cache'
          }
        });
      }
    }
  }

  // Allow all other requests (CSS, JS, images, API endpoints, root path, etc.)
  return context.next();
}
