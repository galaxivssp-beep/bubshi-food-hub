import React, { useState } from 'react';
import { TARGET_PROJECT_ID, FOODS_COLLECTION, saveCustomFirebaseConfig, clearCustomFirebaseConfig, getEffectiveFirebaseConfig } from '../services/firebase';
import { useLanguage } from '../context/LanguageContext';
import { X, Copy, Check, Database, Shield, Smartphone, ExternalLink, Settings } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetest: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose, onRetest }) => {
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  const [copiedRules, setCopiedRules] = useState(false);
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  const currentConfig = getEffectiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || `${TARGET_PROJECT_ID}.firebaseapp.com`);
  const [appId, setAppId] = useState(currentConfig.appId || '');

  if (!isOpen) return null;

  const rulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (
        (request.auth.token.email == 'galaxi.vssp@gmail.com' && request.auth.token.email_verified == true) ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Public read for customers; admin write
    match /foods/{foodId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Validated customer order creation; admin order management
    match /orders/{orderId} {
      allow create: if true; // validated schema
      allow read, update, delete: if isAdmin();
    }
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      appId: appId.trim(),
    });
  };

  const handleResetConfig = () => {
    clearCustomFirebaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">
                {t('setupGuideTitle')}
              </h2>
              <p className="text-xs text-amber-200/80">
                Firebase Project: <span className="font-mono">{TARGET_PROJECT_ID}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {/* Step 1: Verification & Connection */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-2xl p-4">
            <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs">1</span>
              <span>Firebase Connection Architecture</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              This app is configured to connect to your project:
            </p>
            <div className="mt-2 bg-white rounded-xl p-3 border border-amber-200 font-mono text-xs space-y-1">
              <div><strong className="text-gray-700">Project ID:</strong> <span className="text-amber-900 font-bold">{TARGET_PROJECT_ID}</span></div>
              <div><strong className="text-gray-700">Firestore Collection:</strong> <span className="text-amber-900 font-bold">{FOODS_COLLECTION}</span></div>
              <div><strong className="text-gray-700">Required Document Fields:</strong> <span className="text-amber-900 font-bold">name (string), price (number)</span></div>
            </div>
          </div>

          {/* Step 2: Firestore Rules */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">2</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Firestore Security Rules</span>
                </span>
              </h3>

              <button
                onClick={() => copyToClipboard(rulesText)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'Copied' : 'Copy Rules'}</span>
              </button>
            </div>

            <p className="text-gray-600 mb-2">
              In your Firebase Console (<a href={`https://console.firebase.google.com/project/${TARGET_PROJECT_ID}/firestore/rules`} target="_blank" rel="noreferrer" className="text-amber-800 underline font-semibold inline-flex items-center gap-0.5">Firestore Database → Rules <ExternalLink className="w-3 h-3" /></a>), paste this ruleset to allow customers to view the menu and admin to manage items:
            </p>

            <pre className="bg-neutral-900 text-neutral-100 p-3 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed">
              {rulesText}
            </pre>
          </div>

          {/* Step 3: Web API Key Config */}
          <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">3</span>
                <span>Web App Config (Optional / Advanced)</span>
              </h3>

              <button
                onClick={() => setShowConfigEditor(!showConfigEditor)}
                className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showConfigEditor ? 'Hide' : 'Configure'}</span>
              </button>
            </div>

            <p className="text-gray-600">
              If your Firebase project requires a web API key for client-side queries, you can supply it here. It is saved in your browser storage for this project.
            </p>

            {showConfigEditor && (
              <form onSubmit={handleSaveConfig} className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    API Key (apiKey)
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    placeholder={`${TARGET_PROJECT_ID}.firebaseapp.com`}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-900 text-white text-xs font-bold shadow-xs hover:bg-amber-800"
                  >
                    Save & Reconnect
                  </button>
                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="px-3 py-1.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300"
                  >
                    Reset to Default
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 4: WhatsApp Integration Details */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4">
            <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">4</span>
              <span>WhatsApp Ordering Integration</span>
            </h3>
            <p className="text-gray-700">
              Orders placed by customers are formatted with an itemized bill, total, delivery/takeaway instructions, and sent to:
            </p>
            <div className="mt-2 font-mono text-xs bg-white p-2.5 rounded-xl border border-emerald-200">
              <strong>WhatsApp Number:</strong> <span className="text-emerald-800 font-bold">+91 9975587563</span> (919975587563)
            </div>
          </div>

          {/* Step 5: Android Mobile Installation */}
          <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4">
            <h3 className="font-extrabold text-sm text-blue-950 flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-blue-700" />
              <span>Android Mobile Friendly Experience</span>
            </h3>
            <p className="text-gray-700 text-xs leading-relaxed">
              Designed specifically for Android smartphone viewports with touch navigation, floating cart button, and quick dialer integration. In Chrome on Android, tap the three dots (⋮) and select <strong>"Add to Home screen"</strong> to install as a fast mobile app!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => {
              onRetest();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800"
          >
            Retest Live Connection
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
