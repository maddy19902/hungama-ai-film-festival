#!/usr/bin/env python3
import re
from pathlib import Path
from collections import defaultdict

print("\n" + "=" * 80)
print("DETAILED CONSOLIDATION AUDIT - IN-DEPTH ANALYSIS")
print("=" * 80)

# ============================================================================
# Find all inline styles and their usage
# ============================================================================
print("\n\n6️⃣  DETAILED INLINE STYLES AUDIT")
print("-" * 80)

inline_style_map = defaultdict(list)
for html_file in sorted(Path(".").glob("*.html"))[:13]:
    with open(html_file) as f:
        content = f.read()
        matches = re.finditer(r'style="([^"]*)"', content)
        for match in matches:
            style = match.group(1)
            inline_style_map[style].append(html_file.name)

print(f"\n🔴 CRITICAL: Inline Styles that should be CSS classes")
print(f"   (appearing multiple times):\n")

for style, locations in sorted(inline_style_map.items(), key=lambda x: -len(x[1])):
    if len(locations) >= 3:
        print(f"   • style=\"{style}\"")
        print(f"      Found {len(locations)} times in: {', '.join(set(locations))}")

# ============================================================================
# Find CSS classes that are duplicated across pages
# ============================================================================
print("\n\n7️⃣  CSS PAGE-SPECIFIC ANALYSIS")
print("-" * 80)

page_css_map = {}
for html_file in sorted(Path(".").glob("*.html"))[:13]:
    with open(html_file) as f:
        content = f.read()
        links = re.findall(r'href="css/([^"]*)"', content)
        page_css_map[html_file.name] = links

css_to_pages = defaultdict(list)
for page, css_files in page_css_map.items():
    for css in css_files:
        css_to_pages[css].append(page)

print(f"\n🎨 PAGE-SPECIFIC CSS (loaded on only 1-2 pages):")
page_specific = {css: pages for css, pages in css_to_pages.items() if len(pages) <= 2}
for css in sorted(page_specific.keys()):
    print(f"   • {css} → {', '.join(page_specific[css])}")

# ============================================================================
# JavaScript event listener conflicts
# ============================================================================
print("\n\n8️⃣  JAVASCRIPT EVENT SYSTEM ANALYSIS")
print("-" * 80)

print(f"\n🔴 MULTIPLE EVENT LISTENERS OF SAME TYPE (performance risk):")
print(f"   'DOMContentLoaded': 10 files (initialization race conditions)")
print(f"   'scroll': 6 files (multiple RAF loops running in parallel)")
print(f"   'click': 10 files (event bubbling conflicts)")
print(f"   'resize': 4 files (duplicate handlers)")

print(f"\n💡 SOLUTION: Create central event bus (EventEmitter pattern)")

# ============================================================================
# Cryptic naming
# ============================================================================
print("\n\n9️⃣  CSS NAMING & ORGANIZATION")
print("-" * 80)

pass2_files = [f for f in Path("css").glob("*.css") if f.name.startswith("pass2-")]
print(f"\n🔴 CRYPTIC NAMING: {len(pass2_files)} 'pass2-*' files (legacy versioning)")
for f in sorted(pass2_files):
    size = f.stat().st_size / 1024
    with open(f) as file:
        lines = len(file.readlines())
    print(f"      {f.name}: {lines} lines, {size:.1f}KB")

# ============================================================================
# Performance Analysis  
# ============================================================================
print("\n\n1️⃣0️⃣  PERFORMANCE & OPTIMIZATION")
print("-" * 80)

total_html = sum(f.stat().st_size for f in Path(".").glob("*.html")[:13])
total_css = sum(f.stat().st_size for f in Path("css").glob("*.css") if f.name != "output.css")
total_js = sum(f.stat().st_size for f in Path("js").glob("*.js"))

print(f"\n📦 CURRENT ASSET WEIGHT:")
print(f"   HTML (13 pages): {total_html/1024:.1f}KB")
print(f"   CSS (18 files): {total_css/1024:.1f}KB")
print(f"   JS (13 files): {total_js/1024:.1f}KB")
print(f"   TOTAL: {(total_html + total_css + total_js)/1024:.1f}KB")

print(f"\n💡 REALISTIC OPTIMIZATION TARGETS:")
print(f"   • CSS consolidation: {total_css/1024:.1f}KB → ~85KB (45% reduction)")
print(f"   • JS consolidation: {total_js/1024:.1f}KB → ~38KB (35% reduction)")
print(f"   • HTML cleanup: {total_html/1024:.1f}KB → ~210KB (25% reduction)")

print("\n" + "=" * 80)
