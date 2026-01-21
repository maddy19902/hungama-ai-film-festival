import os
import re
import json
from collections import defaultdict

js_files = []
if os.path.exists('js'):
    js_files = [os.path.join('js', f) for f in os.listdir('js') if f.endswith('.js')]
else:
    js_files = [f for f in os.listdir('.') if f.endswith('.js') and f != 'analyze_js.py']

analysis = {
    'total_files': len(js_files),
    'files': {},
    'conflicts': [],
    'global_variables': defaultdict(list),
    'event_listeners': [],
    'parallax_systems': [],
    'scroll_handlers': []
}

print("=== JAVASCRIPT ANALYSIS REPORT ===")
print(f"Total JS files found: {len(js_files)}\n")

for js_file in js_files:
    print(f"\n--- Analyzing: {js_file} ---")
    
    try:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        file_stats = {
            'size_kb': round(len(content) / 1024, 2),
            'lines': content.count('\n') + 1,
            'dom_ready_handlers': len(re.findall(r'DOMContentLoaded|document\.ready', content)),
            'window_listeners': len(re.findall(r'window\.addEventListener', content)),
            'document_listeners': len(re.findall(r'document\.addEventListener', content)),
            'scroll_events': len(re.findall(r'scroll|Scroll', content)),
            'parallax_references': len(re.findall(r'parallax|Parallax', content, re.IGNORECASE)),
            'raf_usage': len(re.findall(r'requestAnimationFrame', content)),
            'intersection_observers': len(re.findall(r'IntersectionObserver', content)),
            'has_jquery': '$(' in content or 'jQuery' in content,
            'global_vars': re.findall(r'(?:var|let|const)\s+([A-Z_][A-Z0-9_]*)\s*=', content),
            'error_handling': 'try' in content and 'catch' in content,
            'console_logs': len(re.findall(r'console\.(log|error|warn)', content))
        }
        
        analysis['files'][js_file] = file_stats
        
        print(f"  Size: {file_stats['size_kb']}KB, Lines: {file_stats['lines']}")
        print(f"  DOM ready handlers: {file_stats['dom_ready_handlers']}")
        print(f"  Event listeners: {file_stats['window_listeners']} window, {file_stats['document_listeners']} document")
        print(f"  Scroll events: {file_stats['scroll_events']}")
        print(f"  Parallax references: {file_stats['parallax_references']}")
        print(f"  Uses RAF: {'Yes' if file_stats['raf_usage'] else 'No'}")
        print(f"  Error handling: {'Yes' if file_stats['error_handling'] else 'No'}")
        
        # Track parallax systems
        if file_stats['parallax_references'] > 0:
            analysis['parallax_systems'].append({
                'file': js_file,
                'references': file_stats['parallax_references'],
                'uses_raf': file_stats['raf_usage'],
                'uses_io': file_stats['intersection_observers'] > 0
            })
        
        # Track global variables (potential conflicts)
        for var in file_stats['global_vars']:
            if var.isupper():  # Likely a constant
                analysis['global_variables'][var].append(js_file)
    
    except Exception as e:
        print(f"  ERROR reading file: {e}")

# Identify conflicts
print(f"\n=== POTENTIAL CONFLICTS ===")
print("1. Global variable conflicts:")
for var, files in analysis['global_variables'].items():
    if len(files) > 1:
        print(f"   {var} defined in: {files}")
        analysis['conflicts'].append(f"Global variable conflict: {var}")

print("\n2. Parallax systems (potential duplicates):")
for system in analysis['parallax_systems']:
    print(f"   {system['file']}: {system['references']} references, RAF: {system['uses_raf']}, IO: {system['uses_io']}")

# Save detailed analysis
with open('JS_ANALYSIS_REPORT.json', 'w') as f:
    json.dump(analysis, f, indent=2, default=str)

print(f"\n=== SUMMARY ===")
print(f"Total JS files: {analysis['total_files']}")
print(f"Parallax system candidates: {len(analysis['parallax_systems'])}")
print(f"Potential conflicts found: {len(analysis['conflicts'])}")
print(f"\nDetailed report saved to: JS_ANALYSIS_REPORT.json")
