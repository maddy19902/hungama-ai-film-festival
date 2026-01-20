#!/usr/bin/env python3
import os

files = [
    'index.html', 'sponsors.html', 'nominees.html', 'ceremony.html',
    'contact.html', 'vision.html', 'jury.html', 'honors.html',
    'press.html', 'privacy.html', 'submit.html', 'terms.html',
    'winners.html'
]

css_link = '  <link href="css/pass2-global-brightening.css" rel="stylesheet">\n'

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        if 'pass2-global-brightening.css' not in content:
            # Find the position to inject (before <style>)
            search_str = '  <style>'
            if search_str in content:
                new_content = content.replace(
                    search_str,
                    css_link + search_str
                )
                with open(filename, 'w') as f:
                    f.write(new_content)
                print(f"✅ {filename}")
            else:
                print(f"⚠️  {filename} (style tag not found)")
        else:
            print(f"⚠️  {filename} (already injected)")

print("\n✅ Global brightening CSS injection complete")
