#!/usr/bin/env python3
import os

files = [
    'index.html', 'sponsors.html', 'nominees.html', 'ceremony.html',
    'contact.html', 'vision.html', 'jury.html', 'honors.html',
    'press.html', 'privacy.html', 'submit.html', 'terms.html',
    'winners.html', 'TEST_DASHBOARD.html'
]

css_link = '  <link href="css/responsiveness.css" rel="stylesheet">\n'

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Check if responsiveness.css already injected
        if 'responsiveness.css' not in content:
            # Find the position to inject (after polish.css line)
            search_str = '  <link href="css/polish.css" rel="stylesheet">'
            if search_str in content:
                new_content = content.replace(
                    search_str,
                    search_str + '\n' + css_link.rstrip()
                )
                with open(filename, 'w') as f:
                    f.write(new_content)
                print(f"✅ {filename}")
            else:
                print(f"⚠️  {filename} (polish.css not found)")
        else:
            print(f"⚠️  {filename} (already injected)")
    else:
        print(f"❌ {filename} (not found)")

print("\n✅ Responsiveness CSS injection complete")
