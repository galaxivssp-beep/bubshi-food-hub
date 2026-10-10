import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DISPLAY_PHONE, WHATSAPP_PHONE } from '../context/CartContext';
import { Search, MapPin, Phone, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCart,
}) => {
  const { lang, t } = useLanguage();
  const isMl = lang === 'ml';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-orange-950 to-neutral-950 text-white mb-6 shadow-xl border border-amber-900/40">
      {/* Background imagery with subtle dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80"
          alt="Kerala Seafood Background"
          className="w-full h-full object-cover opacity-20 filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative z-10 p-5 sm:p-8 max-w-4xl">
        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{isMl ? 'സ്റ്റേഷൻ കടവ് പ്രഭാത മത്സ്യ മാർക്കറ്റ്, കേരളം' : 'Station Kadavu Morning Fish Market, Kerala'}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-2">
          {isMl ? 'ബുബ്ഷി ഫുഡ് ഹബ്ബ്' : 'BUBSHI FOOD HUB'}
          <span className="block text-lg sm:text-2xl font-bold text-amber-400 mt-1">
            {isMl ? 'ശുദ്ധമായ പ്രഭാത മത്സ്യ വിഭവങ്ങളും നാടൻ രുചികളും' : 'Fresh Morning Fish & Authentic Kerala Meals'}
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mb-5 leading-relaxed">
          {isMl
            ? 'സ്റ്റേഷൻ കടവിലെ ഏറ്റവും പുതിയ മീനുകൾ കൊണ്ട് തയാറാക്കിയ അയല ഫ്രൈ, കരിമീൻ പൊള്ളിച്ചത്, മീൻ മുളകിട്ടത്, ഊണ്, ബിരിയാണി എന്നിവ വാട്ട്സാപ്പ് വഴി ഓർഡർ ചെയ്യൂ.'
            : 'Savor genuine Kerala coastal delicacies—fresh Ayala Fry, Karimeen Pollichathu, Neymeen Tawa, Seafood Biriyani, and Fish Meals directly ordered via WhatsApp.'}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 text-xs text-amber-200">
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isMl ? '100% പുതിയ മീൻ' : 'Daily Morning Catch'}</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isMl ? 'തനത് വെളിച്ചെണ്ണ രുചി' : 'Pure Coconut Oil & Masala'}</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isMl ? 'വാട്ട്സാപ്പ് ഓർഡർ' : 'Instant WhatsApp Dispatch'}</span>
          </span>
        </div>

        {/* Direct Action Bar & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick WhatsApp Button */}
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello BUBSHI FOOD HUB, I would like to order food.')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-700/30 transition-all active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isMl ? 'വാട്ട്സാപ്പിൽ ബന്ധപ്പെടുക' : 'Chat on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
