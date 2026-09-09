import React, { useState } from 'react';
import {
  X,
  Apple,
  Monitor,
  Smartphone,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export function MultiplatformModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('pwa');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tauriCommands = `# 1. Install Tauri CLI in this project
npm install -D @tauri-apps/cli

# 2. Initialize Tauri (auto-detects Vite)
npx tauri init

# 3. Build native desktop app:
# On macOS: generates .dmg & .app
# On Windows: generates .msi & .exe
npm run build && npx tauri build`;

  const capacitorCommands = `# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/status-bar

# 2. Initialize Capacitor
npx cap init "Overtime Timer" "com.overtime.timer" --web-dir "dist"

# 3. Add native platforms
npx cap add ios
npx cap add android

# 4. Build and sync web assets to mobile
npm run build
npx cap sync

# 5. Open in Xcode (Mac) or Android Studio
npx cap open ios
npx cap open android`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-md p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Multiplatform App Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run natively on Mac, Windows, iOS, and Android
            </p>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-5 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Instant PWA (No Build)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'desktop'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Mac & Windows (Tauri)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iOS & Android (Capacitor)</span>
          </button>
        </div>

        {/* TAB 1: INSTANT PWA */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              This app includes a preconfigured <strong>Progressive Web App (PWA)</strong> manifest and responsive viewport. You can install it right now as a standalone desktop or mobile app without compiling anything:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Apple className="w-4 h-4 text-indigo-500" />
                  <span>iOS (iPhone & iPad)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Open in Safari &rarr; Tap the <strong>Share</strong> button &rarr; Tap <strong>"Add to Home Screen"</strong>. Runs full screen with native app icon!
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Android</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Open in Chrome &rarr; Tap the <strong>three dots</strong> menu &rarr; Tap <strong>"Install app"</strong>. Installs to app drawer and home screen.
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Apple className="w-4 h-4 text-indigo-500" />
                  <span>macOS</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Safari: <strong>File &rarr; Add to Dock</strong>. Or in Chrome: click the install icon in the URL address bar to create a macOS `.app` bundle.
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Monitor className="w-4 h-4 text-indigo-500" />
                  <span>Windows</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Edge / Chrome: Click <strong>"Install Overtime Timer"</strong> in the address bar. Creates a start menu shortcut and taskbar icon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAC & WINDOWS (TAURI) */}
        {activeTab === 'desktop' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              To build a standalone desktop software with native OS menus, dock badges, and installer packages (<strong>.dmg / .app</strong> for Mac and <strong>.exe / .msi</strong> for Windows), <strong>Tauri</strong> is recommended (produces tiny, blazing-fast binaries under 15MB):
            </p>

            <div className="relative rounded-md bg-slate-950 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
              <button
                type="button"
                onClick={() => copyToClipboard(tauriCommands, 'tauri')}
                className="absolute top-3 right-3 p-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy commands"
              >
                {copiedId === 'tauri' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <pre className="pr-8">{tauriCommands}</pre>
            </div>
          </div>
        )}

        {/* TAB 3: IOS & ANDROID (CAPACITOR) */}
        {activeTab === 'mobile' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              To build native store-ready apps for <strong>Apple App Store (iOS)</strong> and <strong>Google Play (Android)</strong>, you can wrap this Vite codebase with <strong>Capacitor</strong> in 3 minutes:
            </p>

            <div className="relative rounded-md bg-slate-950 p-3.5 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
              <button
                type="button"
                onClick={() => copyToClipboard(capacitorCommands, 'cap')}
                className="absolute top-3 right-3 p-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy commands"
              >
                {copiedId === 'cap' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <pre className="pr-8">{capacitorCommands}</pre>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
