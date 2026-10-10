import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DISPLAY_PHONE, WHATSAPP_PHONE } from '../context/CartContext';
import { TARGET_PROJECT_ID } from '../services/firebase';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenGuide: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAndroidRelease?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenGuide,
  onOpenPrivacyPolicy,
  onOpenAndroidRelease,
}) => {
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-12 pb-24 md:pb-12 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Story */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-xl shadow-md">
              🐟
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white tracking-tight">
                BUBSHI FOOD HUB
              </h3>
              <p className="text-xs text-amber-400 font-medium">
                {isMl ? 'ബുബ്ഷി ഫുഡ് ഹബ്ബ് • കേരളം' : 'Kerala Authentic Seafood & Meals'}
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            {isMl
              ? 'സ്റ്റേഷൻ കടവ് പ്രഭാത മത്സ്യ മാർക്കറ്റിൽ നിന്നും ദിവസവും നേരിട്ട് സംഭരിക്കുന്ന പുതിയ മീനുകൾ തനത് കേരളീയ മസാലക്കൂട്ടുകളിൽ തയാറാക്കി നൽകുന്നു.'
              : 'Serving fresh fish fry, seafood roasts, and authentic Kerala meals sourced daily directly from the Station Kadavu Morning Fish Market.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello BUBSHI FOOD HUB!')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${DISPLAY_PHONE}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Location & Timings */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
            {isMl ? 'സ്ഥലവും സമയവും' : 'Location & Timings'}
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">BUBSHI FOOD HUB</strong>
                <span className="text-neutral-300">Station Kadavu Morning Fish Market</span>
                <p className="text-neutral-400">Kerala, India</p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">{t('businessHours')}</span>
                <p className="text-neutral-400">{t('timingNote')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-300">Phone: </span>
                <span className="text-white font-mono font-bold">{DISPLAY_PHONE}</span>
                <p className="text-neutral-400">WhatsApp: +91 {DISPLAY_PHONE}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links & Firebase Config Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
            {isMl ? 'വിവരങ്ങൾ & ലിങ്കുകൾ' : 'Database & Operations'}
          </h4>

          <div className="space-y-2 text-xs">
            <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl font-mono text-[11px] space-y-1">
              <div>
                <span className="text-neutral-500">Firebase Project: </span>
                <span className="text-amber-300 font-bold">{TARGET_PROJECT_ID}</span>
              </div>
              <div>
                <span className="text-neutral-500">Collection: </span>
                <span className="text-neutral-200">foods</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href="/bubshi-food-hub-source.zip"
                download="bubshi-food-hub-source.zip"
                className="text-left text-amber-300 hover:text-amber-200 font-bold underline transition-colors flex items-center gap-1.5"
              >
                <span>📦 {isMl ? 'സോഴ്സ് കോഡ് ഡൗൺലോഡ് ചെയ്യുക (.ZIP)' : 'Download Source Code (.ZIP)'}</span>
              </a>

              <button
                onClick={onOpenGuide}
                className="text-left text-neutral-400 hover:text-amber-300 underline transition-colors"
              >
                ⚙️ {t('setupGuideTitle')}
              </button>

              {onOpenAndroidRelease && (
                <button
                  onClick={onOpenAndroidRelease}
                  className="text-left text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors flex items-center gap-1"
                >
                  <span>🤖 Google Play &amp; Android App (.aab)</span>
                </button>
              )}

              {onOpenPrivacyPolicy && (
                <button
                  onClick={onOpenPrivacyPolicy}
                  className="text-left text-neutral-400 hover:text-amber-300 underline transition-colors"
                >
                  📜 {isMl ? 'സ്വകാര്യതാ നയം (Privacy Policy)' : 'Privacy Policy (Play Store)'}
                </button>
              )}

              <button
                onClick={onOpenAdmin}
                className="text-left text-neutral-400 hover:text-amber-300 underline transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('adminPortal')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
        <div>
          © {new Date().getFullYear()} BUBSHI FOOD HUB. All rights reserved. Station Kadavu, Kerala.
        </div>
        <div className="flex items-center gap-1">
          <span>Authentic Taste with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>from Kerala</span>
        </div>
      </div>
    </footer>
  );
};
