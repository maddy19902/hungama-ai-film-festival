import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

print("=== INLINE CODE DETECTOR ===")
print("Searching for inline <style> and <script> blocks...\n")

inline_report = []

for html_file in html_files:
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Find inline style blocks
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
    
    # Find inline script blocks (without src)
    script_pattern = r'<script(?![^>]*src)[^>]*>(.*?)</script>'
    script_blocks = re.findall(script_pattern, content, re.DOTALL | re.IGNORECASE)
    
    if style_blocks or script_blocks:
        print(f"\n--- {html_file} ---")
        
        if style_blocks:
            print(f"  Inline <style> blocks: {len(style_blocks)}")
            for i, block in enumerate(style_blocks[:3]):  # Show first 3
                preview = block[:100].replace('\n', ' ').strip()
                print(f"    Block {i+1}: {preview}...")
        
        if script_blocks:
            print(f"  Inline <script> blocks: {len(script_blocks)}")
            for i, block in enumerate(script_blocks[:3]):  # Show first 3
                preview = block[:100].replace('\n', ' ').strip()
                print(f"    Block {i+1}: {preview}...")
        
        inline_report.append({
            'file': html_file,
            'style_blocks': len(style_blocks),
            'script_blocks': len(script_blocks),
            'total_inline': len(style_blocks) + len(script_blocks)
        })

# Summary
print(f"\n=== SUMMARY ===")
if inline_report:
    total_style = sum(r['style_blocks'] for r in inline_report)
    total_script = sum(r['script_blocks'] for r in inline_report)
    print(f"Total inline <style> blocks: {total_style}")
    print(f"Total inline <script> blocks: {total_script}")
    print(f"Total inline code blocks: {total_style + total_script}")
else:
    print("No inline code blocks found!")
