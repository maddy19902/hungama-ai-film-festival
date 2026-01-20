#!/usr/bin/env python3
import os

files = [
    'sponsors.html', 'contact.html', 'privacy.html', 'submit.html', 'terms.html', 'TEST_DASHBOARD.html'
]

css_link = '  <link href="css/responsiveness.css" rel="stylesheet">\n'

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        if 'responsiveness.css' not in content:
            # Find the position to inject (after final-polish.css line if exists, or after elastic-elimination.css)
            search_str1 = '  <link href="css/final-polish.css" rel="stylesheet">'
            search_str2 = '  <link href="css/elastic-elimination.css" rel="stylesheet">'
            
            if search_str1 in content:
                new_content = content.replace(
                    search_str1,
                    search_str1 + '\n' + css_link.rstrip()
                )
            elif search_str2 in content:
                new_content = content.replace(
                    search_str2,
                    search_str2 + '\n' + css_link.rstrip()
                )
            else:
                print(f"⚠️  {filename} (anchor CSS not found)")
                continue
                
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"✅ {filename}")
        else:
            print(f"⚠️  {filename} (already injected)")
    else:
        print(f"❌ {filename} (not found)")

print("\n✅ Responsiveness CSS injection complete for remaining files")
