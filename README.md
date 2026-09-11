<div align="center">

# ⏱️ omgovertime
### *Dynamic Overtime Countdown & Presentation Timer*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-omgovertime.pages.dev-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://omgovertime.pages.dev/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=flat-square)](CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-blueviolet.svg?style=flat-square)](SECURITY.md)
[![Status: Active](https://img.shields.io/badge/Status-Active%20%26%20Maintained-success?style=flat-square)](https://omgovertime.pages.dev/)

<br />

<p align="center">
  <b>A sleek, responsive, and distraction-free countdown timer designed for presentations, sprints, meetings, workouts, exams, and live events.</b>
  <br />
  <i>Tracks remaining time down to the millisecond — and seamlessly transitions into dynamic overtime tracking once zero is reached.</i>
</p>

<p align="center">
  <a href="https://omgovertime.pages.dev/"><strong>🌐 Open Live App</strong></a> •
  <a href="#-features"><strong>✨ Features</strong></a> •
  <a href="#-quick-start"><strong>⚡ Quick Start</strong></a> •
  <a href="#-testing--controls"><strong>🧪 Testing</strong></a> •
  <a href="#-contributing"><strong>🤝 Contribute</strong></a>
</p>

---

</div>

## 🌟 Why omgovertime?

Standard timers stop at `00:00:00` or beep endlessly. **omgovertime** takes time management to the next level:

- ⏳ **Count Down, Then Count Up**: When the clock hits zero, it doesn't freeze — it dynamically flips to an overtime tracker with high-contrast visual cues so speakers and teams know exactly how much overtime has elapsed.
- 🔊 **Zero External Audio Dependencies**: Utilizes the native **Web Audio API** to generate rich procedural chime melodies and alert ringtones on the fly.
- 🎊 **Celebrate Milestones**: Optional confetti explosions powered by Canvas Confetti when your target time is reached.
- 🖥️ **Presentation-Ready**: Fullscreen mode, high-contrast dark/light themes, and 4 distinct visual display modes.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🔴 **Dynamic Overtime Tracker** | Smoothly counts into negative/overtime with vibrant red indicators once zero is hit. |
| 🎛️ **4 Display Modes** | Choose between **Split Block Cards**, **Digital Clock**, **High-Precision Clock (ms)**, or **Raw Seconds**. |
| 🎵 **Web Audio Synth** | Built-in sound synthesizer generating dynamic ringtones and alert chimes without downloading audio files. |
| 🎉 **Celebratory Confetti** | Canvas-driven burst animations triggered at zero (can be toggled on/off). |
| 📊 **Session Progress Bar** | Visual bar indicating elapsed percentage and time left in your active session. |
| ⚡ **Quick Presets & Custom Pickers** | One-tap adjustments (+1m, +5m, +15m, +30m, +1h) or custom minute/hour picker. |
| 🌓 **Adaptive Light & Dark Modes** | Crafted with rich contrast and glassmorphism styling for both bright auditoriums and dark rooms. |
| 📺 **Native & Cross-Browser Fullscreen** | Distraction-free presentation mode compatible across Chrome, Safari, Edge, Firefox, and mobile devices. |
| 📱 **Installable & Multi-Platform** | Optimized for desktop browsers, iPads/tablets, smart boards, and mobile home screens. |

---

## 🚀 Live Demo & Deployment

The application is deployed and maintained on Cloudflare Pages:

👉 **[https://omgovertime.pages.dev/](https://omgovertime.pages.dev/)**

> [!TIP]
> Add omgovertime to your browser bookmarks or install it as a PWA/Home Screen shortcut on mobile or tablet for quick access during presentations!

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/hasibul2hasan/omgovertime.git
cd omgovertime
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) to see the app running locally!

### 4. Build for production

```bash
npm run build
```

---

## 🧪 Testing & Controls

Want to test how omgovertime reacts when reaching zero without waiting 10 minutes? Use the built-in trigger panel:

1. **⚡ Trigger 0:00 Test**: Instantly simulates reaching zero to trigger the audio chime/ringtone and confetti burst.
2. **🎵 Test Ringtone**: Plays the procedural Web Audio synthesizer melodies.
3. **🔔 Test Chime**: Plays the crisp notification chime.
4. **🎉 Confetti Burst**: Test custom canvas confetti particles.
5. **🎚️ Sound / Confetti Toggles**: Turn alerts or celebrations on/off with one click.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (Native browser synthesizer)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🤝 Contributing

We love contributions from the community! Whether you want to fix a bug, suggest a feature, or improve the UI:

1. 📖 Review the [Contributing Guidelines](CONTRIBUTING.md).
2. 📜 Read our [Code of Conduct](CODE_OF_CONDUCT.md).
3. 🍴 Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. 💻 Make your improvements and verify with `npm run lint` & `npm run build`.
5. 🚀 Submit a Pull Request and let's get it merged!

---

## 🔒 Security

For security vulnerabilities and responsible disclosure, please refer to our [Security Policy](SECURITY.md).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Hasibul Hasan](https://github.com/hasibul2hasan) and contributors.

**[⭐ Star us on GitHub](https://github.com/hasibul2hasan/omgovertime)** if you find omgovertime helpful!

</div>
