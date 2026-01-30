## 📌 Description
Add Progressive Web App (PWA) support to Sehat Saathi, enabling offline access, installability on mobile/desktop devices, and improved performance through service worker caching.

This implementation adds:
- Web app manifest for "Add to Home Screen" functionality
- Service worker with Workbox for caching static assets and external resources
- Offline indicator component showing network status in all supported languages
- PWA meta tags for iOS and Android compatibility

Fixes: N/A (New Feature)

---

## 🔧 Type of Change
Please mark the relevant option(s):

- [ ] 🐛 Bug fix
- [x] ✨ New feature
- [ ] 📝 Documentation update
- [ ] ♻️ Refactor / Code cleanup
- [ ] 🎨 UI / Styling change
- [ ] 🚀 Other (please describe):

---

## 🧪 How Has This Been Tested?
Describe the tests you ran to verify your changes.

- [x] Manual testing
- [ ] Automated tests
- [ ] Not tested (please explain why)

**Testing performed:**
- Ran `npm run build` - Successfully generated service worker (`sw.js`, `workbox-1d305bb8.js`)
- Verified 12 precache entries (1690.81 KB) in build output
- Confirmed manifest.webmanifest generated in dist folder

---

## 📸 Screenshots (if applicable)
N/A - PWA functionality can be verified via Chrome DevTools → Application → Manifest/Service Workers

---

## ✅ Checklist
Please confirm the following:

- [x] My code follows the project's coding style
- [x] I have tested my changes
- [x] I have updated documentation where necessary
- [x] This PR does not introduce breaking changes

---

## 📝 Additional Notes

**Files changed:**
| File | Change |
|------|--------|
| `public/manifest.json` | NEW - Web app manifest |
| `src/components/OfflineIndicator.tsx` | NEW - Offline status component |
| `vite.config.ts` | Added VitePWA plugin with workbox caching |
| `index.html` | Added PWA meta tags and manifest link |
| `src/App.tsx` | Integrated OfflineIndicator component |
| `package.json` | Added vite-plugin-pwa dependency |

**To test PWA locally:**
```bash
npm run build && npm run preview
```
Then open Chrome DevTools → Application tab to verify manifest and service worker registration.
