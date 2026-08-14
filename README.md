# London Video Game Orchestra (LVGO) 🎮🎻

Official static website for the **London Video Game Orchestra** — a community orchestra dedicated to bringing the music of video games to life across London and beyond.

🔗 **Live Website**: [lvgo.co.uk](https://lvgo.co.uk/)  
🏛️ **Registered Charity No.** 1207314 (England & Wales)

---

## 🚀 Features

- **⚡ Fast & Lightweight**: Pure vanilla HTML5, CSS3, and JavaScript — zero runtime dependencies, instant initial loads.
- **🎨 Playstation-Inspired Brand Aesthetic**: Clean dark mode with authentic PlayStation-themed letter accents (L: Pink, V: Green, G: Blue, O: Orange).
- **♿ WCAG 2.1/2.2 AA Compliant**: High-contrast typography, focus-visible indicators, skip link, accessible dialog lightboxes, and reduced-motion support.
- **📱 Fully Responsive**: Fluid layout scaling from mobile viewports to ultra-wide displays.
- **SEO & Social Optimized**: Open Graph, Twitter Cards, semantic structured data, JSON manifest, and XML sitemap.
- **🔒 Privacy-Focused Analytics & Consent**: CookieConsent v3 with Google Consent Mode v2 integration.

---

## 🛠️ Local Development

You can run and preview the site locally using any static web server:

### Option 1: Using npm (Recommended)
```bash
# Start local development server (http://localhost:3000)
npm run dev

# Or using npm start
npm start
```

### Option 2: Using Python
```bash
python3 -m http.server 3000
```

---

## 🧹 Code Quality & Linting

```bash
# Run all linters (JavaScript + CSS)
npm run lint

# Lint JavaScript only (ESLint)
npm run lint:js

# Lint CSS only (Stylelint)
npm run lint:css

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

---

## 📂 Project Structure

```
.
├── index.html           # Main home page shell
├── arrangements.html    # Arrangement submission page
├── join-us.html         # Membership & audition expression of interest page
├── policies.html        # Privacy, cookie, and terms page
├── 404.html             # Custom 404 error page
├── manifest.json        # Web app manifest
├── robots.txt           # Search crawler directives
├── sitemap.xml          # Search engine sitemap
├── css/
│   └── style.css        # Design system, tokens, layout & responsive styling
├── js/
│   ├── app.js           # Core DOM renderer, navigation & interactive logic
│   ├── content.js       # Single source of truth for site data & content
│   └── cookie.js        # Cookie consent configuration
├── assets/              # Logos, concert posters, conductor & team headshots
└── scripts/
    └── prerender.js     # Headless Chromium prerenderer for CI deployment
```

---

## 🚢 Deployment & CI/CD

The website is continuously deployed via GitHub Actions:
- On push to `main`, GitHub Actions validates, minifies CSS/JS, runs Lighthouse CI checks, and publishes the static assets to GitHub Pages.
- Build artifacts, `node_modules`, and internal developer configs are automatically excluded from the public deployment bundle.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
