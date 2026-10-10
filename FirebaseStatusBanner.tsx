import React from 'react';
import { FirebaseConnectionInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, AlertCircle, RefreshCw, Database, HelpCircle, ExternalLink } from 'lucide-react';

interface FirebaseStatusBannerProps {
  info: FirebaseConnectionInfo;
  onRetest: () => void;
  onOpenGuide: () => void;
}

export const FirebaseStatusBanner: React.FC<FirebaseStatusBannerProps> = ({
  info,
  onRetest,
  onOpenGuide,
}) => {
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  return (
    <div className="bg-white border-b border-amber-100 text-xs py-2 px-4 shadow-2xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-700 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono text-gray-900">{info.projectId}</span>
          </span>

          <span className="text-gray-300">/</span>

          <span className="text-gray-500 font-mono">col: {info.collectionName}</span>

          {/* Tested status indicator */}
          {info.state === 'checking' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{isMl ? 'കണക്ഷൻ പരിശോധിക്കുന്നു...' : 'Testing live connection...'}</span>
            </span>
          )}

          {info.state === 'connected' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isMl
                  ? `ബന്ധിപ്പിച്ചു (പരിശോധിച്ചു) • ${info.itemCount} വിഭവങ്ങൾ`
                  : `Tested & Connected • ${info.itemCount} items loaded`}
              </span>
            </span>
          )}

          {info.state === 'error' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>{isMl ? 'കണക്ഷൻ ലഭ്യമല്ല' : 'Connection issue detected'}</span>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRetest}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-colors"
            title="Perform fresh live Firestore check"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{isMl ? 'വീണ്ടും പരിശോധിക്കുക' : 'Retest'}</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-medium transition-colors border border-amber-200"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{isMl ? 'സജ്ജീകരണ വിവരങ്ങൾ' : 'Firebase Setup & Rules'}</span>
          </button>
        </div>
      </div>

      {info.state === 'error' && info.errorMessage && (
        <div className="max-w-6xl mx-auto mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-start justify-between gap-2">
          <div>
            <span className="font-bold">Firestore Diagnostic: </span>
            <span>{info.errorMessage}</span>
            <p className="mt-0.5 text-rose-700">
              {isMl
                ? 'നിങ്ങളുടെ ഫയർബേസ് പ്രോജക്റ്റിൽ (bubshi-food-hub-5b8ee) Firestore സെക്യൂരിറ്റി റൂൾസ് അല്ലെങ്കിൽ Web API കീ പരിശോധിക്കുക.'
                : 'Ensure Firestore rules in bubshi-food-hub-5b8ee allow reads for collection "foods" or enter your Firebase Web Config.'}
            </p>
          </div>
          <button
            onClick={onOpenGuide}
            className="shrink-0 underline text-rose-900 font-semibold hover:text-rose-950"
          >
            {isMl ? 'റൂൾസ് കാണുക' : 'View Rules'}
          </button>
        </div>
      )}
    </div>
  );
};
