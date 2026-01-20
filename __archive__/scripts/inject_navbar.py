#!/usr/bin/env python3
import os

files = [
    'index.html', 'sponsors.html', 'nominees.html', 'ceremony.html',
    'contact.html', 'vision.html', 'jury.html', 'honors.html',
    'press.html', 'privacy.html', 'submit.html', 'terms.html',
    'winners.html', 'TEST_DASHBOARD.html'
]

script = '\n  <!-- Navbar Scroll Behavior -->\n  <script src="/js/navbar-scroll.js"></script>\n'

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        if 'navbar-scroll.js' not in content:
            new_content = content.replace('</body>', script + '</body>')
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"✅ {filename}")
        else:
            print(f"⚠️  {filename} (already injected)")
    else:
        print(f"❌ {filename} (not found)")

print("\n✅ Injection complete")
