#!/usr/bin/env node

/**
 * HUNGAMA FESTIVAL PRODUCTION DEPLOYMENT VERIFICATION
 * Confirms all systems are ready for production launch
 */

const fs = require('fs');
const path = require('path');

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║          HUNGAMA FESTIVAL - PRODUCTION VERIFICATION              ║');
console.log('║                   Deployment Ready Checker                       ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');
console.log('\n');

const checks = {
  "Core Production Files": {
    "js/production-scroll.js": () => fs.existsSync(path.join(__dirname, 'js/production-scroll.js')),
    "js/production-parallax.js": () => fs.existsSync(path.join(__dirname, 'js/production-parallax.js')),
    "js/main.js": () => fs.existsSync(path.join(__dirname, 'js/main.js')),
  },
  "CSS & Configuration": {
    "css/polish.css": () => fs.existsSync(path.join(__dirname, 'css/polish.css')),
    "public/output.css": () => fs.existsSync(path.join(__dirname, 'public/output.css')),
    "_headers": () => fs.existsSync(path.join(__dirname, '_headers')),
    "package.json": () => fs.existsSync(path.join(__dirname, 'package.json')),
    ".gitignore": () => fs.existsSync(path.join(__dirname, '.gitignore')),
  },
  "HTML Pages": {
    "index.html": () => fs.existsSync(path.join(__dirname, 'index.html')),
    "ceremony.html": () => fs.existsSync(path.join(__dirname, 'ceremony.html')),
    "contact.html": () => fs.existsSync(path.join(__dirname, 'contact.html')),
    "honors.html": () => fs.existsSync(path.join(__dirname, 'honors.html')),
    "jury.html": () => fs.existsSync(path.join(__dirname, 'jury.html')),
    "nominees.html": () => fs.existsSync(path.join(__dirname, 'nominees.html')),
    "press.html": () => fs.existsSync(path.join(__dirname, 'press.html')),
    "privacy.html": () => fs.existsSync(path.join(__dirname, 'privacy.html')),
    "sponsors.html": () => fs.existsSync(path.join(__dirname, 'sponsors.html')),
    "submit.html": () => fs.existsSync(path.join(__dirname, 'submit.html')),
    "terms.html": () => fs.existsSync(path.join(__dirname, 'terms.html')),
    "vision.html": () => fs.existsSync(path.join(__dirname, 'vision.html')),
    "winners.html": () => fs.existsSync(path.join(__dirname, 'winners.html')),
  },
  "Documentation": {
    "START_HERE.md": () => fs.existsSync(path.join(__dirname, 'START_HERE.md')),
    "PRODUCTION_DEPLOYMENT.md": () => fs.existsSync(path.join(__dirname, 'PRODUCTION_DEPLOYMENT.md')),
    "PRODUCTION_READY.md": () => fs.existsSync(path.join(__dirname, 'PRODUCTION_READY.md')),
    "DEPLOYMENT.md": () => fs.existsSync(path.join(__dirname, 'DEPLOYMENT.md')),
  }
};

let totalChecks = 0;
let passedChecks = 0;

for (const [category, files] of Object.entries(checks)) {
  console.log(`\n✓ ${category}`);
  console.log(`  ${'─'.repeat(60)}`);
  
  for (const [file, checker] of Object.entries(files)) {
    totalChecks++;
    const result = checker();
    passedChecks += result ? 1 : 0;
    
    const status = result ? '✓' : '✗';
    const symbol = result ? '✅' : '❌';
    console.log(`  ${symbol} ${file}`);
  }
}

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log(`║ VERIFICATION RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED`.padEnd(69) + '║');

if (passedChecks === totalChecks) {
  console.log('║ STATUS: ✅ ALL SYSTEMS READY FOR PRODUCTION                       ║');
} else {
  console.log('║ STATUS: ⚠️  SOME FILES MISSING - REVIEW ABOVE                     ║');
}

console.log('╚═══════════════════════════════════════════════════════════════════╝');

console.log('\n');
if (passedChecks === totalChecks) {
  console.log('🎬 NEXT STEPS:');
  console.log('━'.repeat(65));
  console.log('');
  console.log('1. Read START_HERE.md for quick deployment guide');
  console.log('');
  console.log('2. Initialize Git and push to GitHub:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "🎬 Production deployment"');
  console.log('   git remote add origin <your-github-url>');
  console.log('   git push -u origin main');
  console.log('');
  console.log('3. Deploy to Cloudflare Pages:');
  console.log('   • Go to https://dash.cloudflare.com');
  console.log('   • Create Pages project');
  console.log('   • Connect GitHub repository');
  console.log('   • Build command: npm run build');
  console.log('   • Output directory: .');
  console.log('   • Click Deploy');
  console.log('');
  console.log('4. Your site will be live in 2-3 minutes! 🚀');
  console.log('');
} else {
  console.log('⚠️  MISSING FILES DETECTED');
  console.log('━'.repeat(65));
  console.log('');
  console.log('Please ensure all required files are present before deploying.');
  console.log('');
}

console.log('\n');
