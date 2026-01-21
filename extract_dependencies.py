import os
import re
import csv
import json

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
results = []

for html_file in html_files:
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Extract CSS links
    css_pattern = r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>'
    css_files = re.findall(css_pattern, content)
    
    # Extract JS scripts
    js_pattern = r'<script[^>]*src=["\']([^"\']+\.js)["\'][^>]*></script>'
    js_files = re.findall(js_pattern, content)
    
    # Detect inline CSS
    inline_css = len(re.findall(r'<style[^>]*>.*?</style>', content, re.DOTALL))
    
    # Detect inline JS (not in src)
    inline_js = len(re.findall(r'<script(?![^>]*src)[^>]*>.*?</script>', content, re.DOTALL))
    
    # Detect Tailwind classes
    tailwind_classes = len(re.findall(r'class=["\'][^"\']*[\w-]+:[\w-]+[^"\']*["\']', content))
    
    results.append({
        'html_file': html_file,
        'css_files': css_files,
        'js_files': js_files,
        'inline_css_blocks': inline_css,
        'inline_js_blocks': inline_js,
        'has_tailwind': tailwind_classes > 0,
        'total_dependencies': len(css_files) + len(js_files)
    })

# Save to CSV
with open('HTML_DEPENDENCY_MATRIX.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['html_file', 'css_files', 'js_files', 'inline_css_blocks', 'inline_js_blocks', 'has_tailwind', 'total_dependencies'])
    writer.writeheader()
    for row in results:
        writer.writerow({
            'html_file': row['html_file'],
            'css_files': len(row['css_files']),
            'js_files': len(row['js_files']),
            'inline_css_blocks': row['inline_css_blocks'],
            'inline_js_blocks': row['inline_js_blocks'],
            'has_tailwind': row['has_tailwind'],
            'total_dependencies': row['total_dependencies']
        })

# Save to JSON for easy reading
with open('HTML_DEPENDENCY_MATRIX.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"Analyzed {len(results)} HTML files")
print("Files created: HTML_DEPENDENCY_MATRIX.csv, HTML_DEPENDENCY_MATRIX.json")
