#!/bin/bash
for file in index.html sponsors.html nominees.html ceremony.html contact.html vision.html jury.html honors.html press.html privacy.html submit.html terms.html winners.html TEST_DASHBOARD.html; do
  if [[ -f "$file" ]]; then
    if ! grep -q "navbar-scroll.js" "$file"; then
      # Use a temporary file approach
      sed '/<\/body>/i\
\
  <!-- Navbar Scroll Behavior -->\
  <script src="/js/navbar-scroll.js"><\/script>' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
      echo "✅ Injected navbar-scroll.js into $file"
    else
      echo "⚠️  navbar-scroll.js already in $file"
    fi
  fi
done
