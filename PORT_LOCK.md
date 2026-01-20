# 🔒 PORT GOVERNANCE — CANONICAL LOCAL PORT

## Port Assignment

**Allowed Port:** `8000`

**Forbidden Ports:** 3000, 5173, 5713, 8080, any other

---

## Reason

- Canonical testing port for this project
- Parity with Cloudflare Pages deployment
- No conflicts with other development servers
- Enforced until explicit user revocation

---

## Testing URL

```
http://localhost:8000/index.html
```

---

## Rules

✅ **DO:** Start server on port 8000
✅ **DO:** Reference port 8000 in documentation
✅ **DO:** Kill stale processes before restart

❌ **DON'T:** Use port 3000, 5173, 5713, 8080, or any other
❌ **DON'T:** Allow auto-port behavior from npm/vite/next
❌ **DON'T:** Suggest alternative ports

---

## Reset Procedure

If server becomes stale:

```bash
pkill -f "http.server"
python3 -m http.server 8000
```

---

## Active Status

**Last verified:** January 20, 2026
**Server:** Python SimpleHTTP
**Status:** ✅ LISTENING ON PORT 8000
