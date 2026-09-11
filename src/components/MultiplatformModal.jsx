import React, { useState } from 'react';
import {
  X,
  Apple,
  Monitor,
  Smartphone,
  Check,
  Copy,
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
npx cap init "omgovertime" "com.omgovertime.app" --web-dir "dist"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-scale-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto apple-glass-heavy rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/10 dark:border-white/15 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Multiplatform App Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run natively on Mac, Windows, iOS, and Android
            </p>
          </div>
        </div>

        {/* Apple Segmented Platform tabs */}
        <div className="flex p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mt-5 mb-5 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap apple-press ${
              activeTab === 'pwa'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant PWA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap apple-press ${
              activeTab === 'desktop'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Mac & Windows</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap apple-press ${
              activeTab === 'mobile'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS & Android</span>
          </button>
        </div>

        {/* TAB 1: INSTANT PWA */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              This app includes a preconfigured <strong>Progressive Web App (PWA)</strong> manifest. You can install it right now without compiling anything:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Apple className="w-4 h-4 text-indigo-500" />
                  <span>iOS (iPhone & iPad)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Open in Safari &rarr; Tap <strong>Share</strong> &rarr; Tap <strong>"Add to Home Screen"</strong>. Runs full screen with native app icon!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Android</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Open in Chrome &rarr; Tap <strong>Menu</strong> &rarr; Tap <strong>"Install app"</strong>. Installs to app drawer and home screen.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Apple className="w-4 h-4 text-indigo-500" />
                  <span>macOS</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Safari: <strong>File &rarr; Add to Dock</strong>. Or in Chrome: click the install icon in the address bar.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                  <Monitor className="w-4 h-4 text-indigo-500" />
                  <span>Windows</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Edge / Chrome: Click <strong>"Install omgovertime"</strong> in the address bar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAC & WINDOWS (TAURI) */}
        {activeTab === 'desktop' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              To build a standalone desktop software (<strong>.dmg / .app</strong> for Mac and <strong>.exe / .msi</strong> for Windows), <strong>Tauri</strong> produces tiny, blazing-fast binaries under 15MB:
            </p>

            <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
              <button
                type="button"
                onClick={() => copyToClipboard(tauriCommands, 'tauri')}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors apple-press"
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
              To build native store-ready apps for <strong>Apple App Store (iOS)</strong> and <strong>Google Play (Android)</strong>:
            </p>

            <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
              <button
                type="button"
                onClick={() => copyToClipboard(capacitorCommands, 'cap')}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors apple-press"
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

        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all apple-press"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
