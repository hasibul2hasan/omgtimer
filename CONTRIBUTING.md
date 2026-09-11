# Contributing to omgovertime ⏱️

First off, thank you for considering contributing to **omgovertime**! 🎉 It's people like you that make omgovertime an awesome tool for everyone.

Following these guidelines helps ensure a smooth, transparent, and collaborative process for everyone involved.

---

## 🧭 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features & Enhancements](#suggesting-features--enhancements)
  - [Contributing Code](#contributing-code)
- [Local Development Setup](#-local-development-setup)
- [Project Architecture](#-project-architecture)
- [Development Workflow](#-development-workflow)
- [Coding & Style Guidelines](#-coding--style-guidelines)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Recognition & Community](#-recognition--community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by the [omgovertime Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## 💡 How Can I Contribute?

### Reporting Bugs

Found a bug? Help us squash it! 🐛

1. **Check Existing Issues**: Search [GitHub Issues](https://github.com/hasibul2hasan/omgovertime/issues) to avoid duplicate reports.
2. **Open a Bug Report**: If not reported yet, create a new issue with:
   - A clear and descriptive title.
   - Exact steps to reproduce the bug.
   - Expected vs. actual behavior.
   - Browser name, version, and operating system.
   - Screenshots or video recordings if applicable.

### Suggesting Features & Enhancements

Have an idea for a cool new feature or design improvement? 🚀

1. Open a new issue and select **Feature Request**.
2. Explain why this feature is useful and what problem it solves.
3. Provide mockups, sketches, or user stories where possible.

### Contributing Code

We welcome PRs for:
- 🐛 Bug fixes
- ✨ New features & display styles
- 🎨 UI/UX enhancements and accessibility improvements
- ⚡ Performance optimizations
- 📚 Documentation improvements

---

## 🛠️ Local Development Setup

Follow these steps to run omgovertime on your machine:

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/hasibul2hasan/omgovertime.git
cd omgovertime
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Dev Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the live app with Hot Module Replacement (HMR).

---

## 🏗️ Project Architecture

```text
omgovertime/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── Header.jsx          # Top brand bar, theme toggle, full screen
│   │   ├── TimerDisplay.jsx    # Core dynamic overtime countdown view
│   │   ├── TargetTimePicker.jsx# Target time & quick preset selector
│   │   ├── SessionTimeBar.jsx  # Elapsed vs remaining progress indicator
│   │   ├── AppearanceSelector.jsx # Layout & typography styles
│   │   ├── ZeroTriggerPanel.jsx# Sound & confetti test controls
│   │   └── MultiplatformModal.jsx # Multiplatform/PWA guide modal
│   ├── hooks/              # Custom React hooks
│   │   ├── useCountdown.js     # Precise timestamp countdown logic
│   │   └── useAudioSynth.js    # Web Audio API procedural synthesis
│   ├── utils/              # Helper utilities & confetti triggers
│   ├── App.jsx             # Main application orchestrator
│   ├── main.jsx            # React root mount
│   └── index.css           # Tailwind & custom CSS styles
├── package.json            # Project dependencies & scripts
├── tailwind.config.js      # Tailwind CSS theme configuration
└── vite.config.js          # Vite build tool setup
```

---

## 🔄 Development Workflow

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server |
| `npm run build` | Compiles the production-ready bundle to `/dist` |
| `npm run lint` | Runs [Oxlint](https://oxc.rs) to check code quality |
| `npm run preview` | Previews the production build locally |

---

## 📐 Coding & Style Guidelines

- **React Best Practices**: Use functional components and React hooks. Keep state localized where possible.
- **Styling**: Use [Tailwind CSS](https://tailwindcss.com/) utility classes alongside cohesive CSS variables in `src/index.css`.
- **Audio & Animations**: Keep assets lightweight! Prefer programmatic solutions like the **Web Audio API** and **Canvas Confetti**.
- **Linting**: Always run `npm run lint` before committing to ensure there are no lint warnings or errors.
- **Commit Messages**: Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add new timer mode`, `fix: fullscreen exit listener on safari`).

---

## 🚀 Submitting a Pull Request

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** and test them thoroughly in multiple viewports.
3. **Run the linter and build test**:
   ```bash
   npm run lint
   npm run build
   ```
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add awesome feature"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feat/your-feature-name
   ```
6. **Create a Pull Request** against the `main` branch with a clear description of your changes and reference any related issues.

---

## 🌟 Recognition & Community

Every contribution counts! Whether it's fixing a typo, optimizing an algorithm, or building a brand new feature — all contributors will be recognized.

Thank you for helping build **omgovertime**! ⏱️❤️
