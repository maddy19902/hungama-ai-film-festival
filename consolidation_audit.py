#!/usr/bin/env python3
import os
import re
from pathlib import Path
from collections import defaultdict

print("=" * 80)
print("COMPREHENSIVE CODEBASE CONSOLIDATION AUDIT")
print("=" * 80)

# ============================================================================
# 1. CSS ANALYSIS - Find duplicated selectors and styles
# ============================================================================
print("\n\n1️⃣  CSS DUPLICATION ANALYSIS")
print("-" * 80)

css_files = list(Path("css").glob("*.css"))
css_selectors = defaultdict(list)
css_properties = defaultdict(int)

for css_file in sorted(css_files):
    if css_file.name in ["output.css"]:  # Skip compiled output
        continue
    
    with open(css_file) as f:
        content = f.read()
        # Find selectors (simplified)
        selectors = re.findall(r'^[^{]*(?={)', content, re.MULTILINE)
        for selector in selectors:
            selector = selector.strip()
            if selector:
                css_selectors[selector].append(css_file.name)
        
        # Count property occurrences
        properties = re.findall(r'([a-z-]+):\s*[^;]+;', content)
        for prop in properties:
            css_properties[prop] += 1

# Find duplicate selectors across files
duplicates = {sel: files for sel, files in css_selectors.items() if len(files) > 1}
print(f"\n🔴 DUPLICATE SELECTORS (defined in multiple files):")
if duplicates:
    for selector, files in sorted(duplicates.items())[:15]:  # Show top 15
        print(f"   {selector} → {', '.join(files)}")
    if len(duplicates) > 15:
        print(f"   ... and {len(duplicates) - 15} more")
else:
    print("   None found ✅")

# Find most common properties
print(f"\n📊 MOST COMMON CSS PROPERTIES:")
for prop, count in sorted(css_properties.items(), key=lambda x: -x[1])[:10]:
    print(f"   {prop}: {count} occurrences")

# ============================================================================
# 2. HTML ANALYSIS - Find repeated patterns
# ============================================================================
print("\n\n2️⃣  HTML MARKUP PATTERNS & DUPLICATION")
print("-" * 80)

html_files = list(Path(".").glob("*.html"))
html_patterns = defaultdict(list)
inline_styles = defaultdict(list)

for html_file in sorted(html_files)[:13]:  # Production pages only
    with open(html_file) as f:
        content = f.read()
        
        # Find inline style attributes
        styles = re.findall(r'style="([^"]*)"', content)
        for style in styles:
            inline_styles[style].append(html_file.name)
        
        # Find repeated class patterns
        classes = re.findall(r'class="([^"]*)"', content)
        for cls in classes:
            html_patterns[cls].append(html_file.name)

print(f"\n🔴 REPEATED INLINE STYLES (manually maintained):")
repeated_inline = {style: files for style, files in inline_styles.items() if len(files) > 2}
for style, files in sorted(repeated_inline.items(), key=lambda x: -len(x[1]))[:10]:
    print(f"   style=\"{style}\"")
    print(f"      Found in {len(files)} files: {', '.join(files[:3])}{'...' if len(files) > 3 else ''}")

print(f"\n📊 MOST REPEATED CLASS COMBINATIONS:")
top_classes = sorted(html_patterns.items(), key=lambda x: -len(x[1]))[:12]
for cls, files in top_classes:
    print(f"   {cls} ({len(files)} pages)")

# ============================================================================
# 3. JAVASCRIPT ANALYSIS
# ============================================================================
print("\n\n3️⃣  JAVASCRIPT PATTERNS & REUSABILITY")
print("-" * 80)

js_files = list(Path("js").glob("*.js"))
js_functions = defaultdict(list)
js_eventlisteners = []

for js_file in sorted(js_files):
    with open(js_file) as f:
        content = f.read()
        
        # Find function definitions
        functions = re.findall(r'(?:function|const|let)\s+(\w+)\s*=?\s*(?:function|\()', content)
        for func in functions[:5]:  # Top 5 per file
            js_functions[func].append(js_file.name)
        
        # Find event listeners
        listeners = re.findall(r'addEventListener\([\'"](\w+)[\'"]', content)
        js_eventlisteners.extend([(listener, js_file.name) for listener in listeners])

print(f"\n📊 EVENT LISTENERS ATTACHED:")
event_counts = defaultdict(list)
for event, file in js_eventlisteners:
    event_counts[event].append(file)

for event, files in sorted(event_counts.items(), key=lambda x: -len(x[1])):
    print(f"   '{event}': attached in {len(files)} files → {', '.join(set(files))}")

print(f"\n🔴 DUPLICATE FUNCTION NAMES (potential conflicts):")
dup_funcs = {func: files for func, files in js_functions.items() if len(files) > 1}
for func, files in sorted(dup_funcs.items())[:10]:
    print(f"   {func}() in {files}")

# ============================================================================
# 4. COMPONENT & PATTERN ANALYSIS
# ============================================================================
print("\n\n4️⃣  REPEATED COMPONENT PATTERNS")
print("-" * 80)

# Analyze button patterns
button_patterns = defaultdict(int)
cta_patterns = defaultdict(int)

for html_file in sorted(html_files)[:13]:
    with open(html_file) as f:
        content = f.read()
        buttons = re.findall(r'<button[^>]*class="([^"]*)"', content)
        for btn in buttons:
            button_patterns[btn] += 1
        
        # CTAs
        ctas = re.findall(r'<a[^>]*class="([^"]*)"[^>]*>([^<]*)</a>', content)
        for cls, text in ctas:
            if 'hover' in cls or 'transition' in cls:
                cta_patterns[cls] += 1

print(f"\n🎨 REPEATED BUTTON STYLES:")
for style, count in sorted(button_patterns.items(), key=lambda x: -x[1])[:8]:
    print(f"   {style} ({count} occurrences)")

print(f"\n🎨 REPEATED CTA LINK STYLES:")
for style, count in sorted(cta_patterns.items(), key=lambda x: -x[1])[:8]:
    print(f"   {style} ({count} occurrences)")

# ============================================================================
# 5. CODE SIZE ANALYSIS
# ============================================================================
print("\n\n5️⃣  CODE SIZE ANALYSIS")
print("-" * 80)

total_css_size = sum(f.stat().st_size for f in css_files if f.name != "output.css")
total_js_size = sum(f.stat().st_size for f in js_files)
total_html_size = sum(f.stat().st_size for f in html_files if f.name not in ["index.html"])

print(f"\n📦 TOTAL CODE WEIGHT (excluding output.css):")
print(f"   CSS (18 files): {total_css_size/1024:.1f}KB")
print(f"   JS (13 files): {total_js_size/1024:.1f}KB")
print(f"   HTML (12 pages): {total_html_size/1024:.1f}KB")

# Identify largest files
print(f"\n📊 LARGEST CSS FILES:")
for f in sorted(css_files, key=lambda x: -x.stat().st_size)[:5]:
    if f.name != "output.css":
        size = f.stat().st_size / 1024
        print(f"   {f.name}: {size:.1f}KB")

print(f"\n📊 LARGEST JS FILES:")
for f in sorted(js_files, key=lambda x: -x.stat().st_size)[:5]:
    size = f.stat().st_size / 1024
    print(f"   {f.name}: {size:.1f}KB")

print("\n" + "=" * 80)
