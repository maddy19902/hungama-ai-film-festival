import os
import re
from collections import defaultdict

css_files = []
if os.path.exists('css'):
    css_files = [os.path.join('css', f) for f in os.listdir('css') if f.endswith('.css')]
else:
    css_files = [f for f in os.listdir('.') if f.endswith('.css')]

all_selectors = defaultdict(list)
important_rules = []
keyframe_count = 0
transition_count = 0
parallax_selectors = []

print("=== CSS ANALYSIS REPORT ===")
print(f"Total CSS files found: {len(css_files)}\n")

for css_file in css_files:
    print(f"\n--- Analyzing: {css_file} ---")
    
    try:
        with open(css_file, 'r') as f:
            content = f.read()
        
        # Count selectors
        selectors = re.findall(r'([^{]+)\{', content)
        print(f"  Selector count: {len(selectors)}")
        
        # Find !important rules
        important = re.findall(r'!important', content, re.IGNORECASE)
        if important:
            important_rules.append(f"{css_file}: {len(important)} !important rules")
        
        # Find animations
        keyframes = re.findall(r'@keyframes\s+(\w+)', content)
        keyframe_count += len(keyframes)
        if keyframes:
            print(f"  Keyframes: {', '.join(keyframes)}")
        
        # Find transitions/transforms
        transitions = re.findall(r'transition:|transform:|translate3d|perspective', content, re.IGNORECASE)
        transition_count += len(transitions)
        
        # Find parallax-related selectors
        parallax = re.findall(r'parallax|scroll.*effect|translateY|translateZ', content, re.IGNORECASE)
        if parallax:
            parallax_selectors.append(f"{css_file}: {len(parallax)} parallax-related rules")
        
        # Store for duplicate detection
        for selector in selectors:
            clean_sel = selector.strip()
            if clean_sel and len(clean_sel) < 100:  # Avoid huge selectors
                all_selectors[clean_sel].append(css_file)
    
    except Exception as e:
        print(f"  ERROR reading file: {e}")

# Find duplicate selectors
print(f"\n=== DUPLICATE SELECTORS (Potential Conflicts) ===")
duplicates = {sel: files for sel, files in all_selectors.items() if len(files) > 1}
for sel, files in list(duplicates.items())[:20]:  # Show first 20
    print(f"{sel}: {files}")

print(f"\n=== SUMMARY ===")
print(f"Total unique selectors: {len(all_selectors)}")
print(f"Duplicate selectors: {len(duplicates)}")
print(f"Total @keyframes found: {keyframe_count}")
print(f"Total transition/transform rules: {transition_count}")
print(f"Parallax-related CSS files: {len(parallax_selectors)}")

if important_rules:
    print(f"\n!important rules found (potential specificity wars):")
    for rule in important_rules:
        print(f"  {rule}")

# Save detailed report
with open('CSS_ANALYSIS_REPORT.txt', 'w') as f:
    f.write("CSS Analysis Report\n")
    f.write("="*50 + "\n")
    for css_file in css_files:
        f.write(f"\n{css_file}\n")
    f.write(f"\n\nTotal CSS Files: {len(css_files)}\n")
    f.write(f"Total Duplicate Selectors: {len(duplicates)}\n")
    f.write(f"Total @keyframes: {keyframe_count}\n")
    f.write(f"Total transition/transform rules: {transition_count}\n")
    if important_rules:
        f.write(f"\n!important rules:\n")
        for rule in important_rules:
            f.write(f"  {rule}\n")

print("\nDetailed report saved to CSS_ANALYSIS_REPORT.txt")
