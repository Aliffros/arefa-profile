<div align="center">

# Arefa AI Profile and Subsystem Dashboard

Live production portfolio and operational telemetry interface for Arefa AI, an autonomous local agentic companion.

[![Live Demo](https://img.shields.io/badge/Live_Demo-arefa--profile.pages.dev-00f2fe?style=flat-square&logo=cloudflare&logoColor=white)](https://arefa-profile.pages.dev)
[![Deployment](https://img.shields.io/badge/Deployment-Cloudflare_Pages-f38020?style=flat-square&logo=cloudflarepages&logoColor=white)](https://arefa-profile.pages.dev)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_•_HTML5_•_CSS3-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

</div>

---

## Overview

Arefa Profile is a responsive, zero-framework web application that showcases the persona, cognitive states, and visual identity of Arefa AI. Built with native web standards (vanilla ES6+ JavaScript, semantic HTML5, and custom CSS variables), the platform delivers sub-100ms initial load times and smooth 60fps animations without client bundle overhead.

The platform includes three distinct modules:
1. **Overview Stage (`index.html`):** An interactive introduction featuring dynamic dialogue scenarios and real-time status indicators.
2. **Telemetry Dashboard (`dashboard.html`):** A visual control room displaying simulated system performance, memory buffers, and agent operational parameters.
3. **Visual Gallery (`gallery.html`):** A responsive media showcase presenting visual reference frames and character designs with lightbox inspection.

---

## Key Architecture and Features

### 1. Modular Dialogue Engine
- Scripted narrative state engine split across modular datasets (`dialogue-data-1.js` to `dialogue-data-4.js`).
- Dynamic conversational triggers that react to user choices and showcase the assistant's sharp wit and expressive traits.
- Typewriter-style streaming text simulation with adjustable pacing.

### 2. Operations and Telemetry Dashboard
- Metrics tracking simulated neural load, reasoning cycles, memory utilization, and active subsystem flags.
- Real-time DOM telemetry updates simulating edge worker background heartbeats.
- Visual charts and status gauges rendered directly via CSS and lightweight DOM manipulation.

### 3. Responsive Visual Gallery
- Fluid responsive grid designed to accommodate portrait and landscape aspect ratios.
- Modal lightbox with keyboard controls (Escape to close, directional arrow navigation).
- Lazy-loading image handling for optimal mobile data performance.

### 4. Zero-Framework Architecture
- Zero client-side dependencies: No React, Vue, or heavy build tools required at runtime.
- Custom CSS design system using CSS variables for instant theme accent swapping (Cyan, Teal, Rose, Green, Orange).
- High accessibility score with clean semantic structure, custom focus states, and scalable typography (Inter, Outfit, Fira Code).

---

## Repository Structure

```
.
├── index.html            # Main overview stage and interactive dialogue engine
├── dashboard.html        # Telemetry metrics, agent monitor, and execution graphs
├── gallery.html          # Portrait gallery with responsive lightbox viewer
├── app.js                # Core interaction logic, dialogue router, and theme controllers
├── dashboard.js          # Telemetry chart rendering and real-time metric updates
├── gallery.js            # Image modal viewer, filter mechanics, and thumbnail logic
├── dialogue-data-1.js    # Introduction and foundational conversational state
├── dialogue-data-2.js    # Technical explanations and architecture dialogue
├── dialogue-data-3.js    # Autonomous agent reasoning and scenario responses
├── dialogue-data-4.js    # Casual interactions and expressive persona scripts
├── styles.css            # Design system, CSS variables, typography, and responsive layouts
├── package.json          # Development scripts and local tooling configuration
└── Arefa[1-10].jpg       # Visual asset reference frames
```

---

## Local Development

### Prerequisites
- Node.js (version 18 or higher recommended)
- A modern web browser supporting ES6+ JavaScript

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Aliffros/arefa-profile.git
cd arefa-profile
```

2. Install local development dependencies:
```bash
npm install
```

3. Launch the local live-reload server:
```bash
npm run dev
```

The application will start at `http://localhost:3000` via Browser-Sync, watching for file changes across HTML, CSS, and JS files.

---

## Deployment

The project is configured for static edge hosting on Cloudflare Pages:
- Build output directory: `.` (root)
- Build command: None required (static assets served directly from the edge)
- Edge CDN: Global caching with HTTP/3 and TLS 1.3 enabled by default

Production URL: [https://arefa-profile.pages.dev](https://arefa-profile.pages.dev)

---

## Author

Developed and maintained by **Aliff Ros** ([@Aliffros](https://github.com/Aliffros)).

---

## License

This project is licensed under the ISC License.
