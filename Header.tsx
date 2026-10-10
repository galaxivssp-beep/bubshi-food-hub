import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart, DISPLAY_PHONE, WHATSAPP_PHONE } from '../context/CartContext';
import { FirebaseConnectionInfo } from '../types';
import { ShoppingBag, Lock, Phone, MapPin, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  connectionInfo: FirebaseConnectionInfo;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenSetupGuide: () => void;
  onRetestConnection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionInfo,
  onOpenCart,
  onOpenAdmin,
  onOpenSetupGuide,
  onRetestConnection,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { totalCount, totalAmount } = useCart();

  const isMl = lang === 'ml';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 text-xs px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate font-medium">
            {isMl
              ? 'സ്റ്റേഷൻ കടവ് പ്രഭാത മത്സ്യ മാർക്കറ്റ്, കേരളം'
              : 'Station Kadavu Morning Fish Market, Kerala'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${DISPLAY_PHONE}`}
            className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span className="font-semibold">{DISPLAY_PHONE}</span>
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 ring-2 ring-amber-200">
            <span className="text-xl">🐟</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 leading-none">
                BUBSHI FOOD HUB
              </h1>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-200">
                KERALA
              </span>
            </div>
            <p className="text-xs text-amber-800 font-medium leading-tight mt-0.5">
              {isMl ? 'ബുബ്ഷി ഫുഡ് ഹബ്ബ് • ഫ്രഷ് മീൻ & നാടൻ രുചികൾ' : 'Fresh Morning Fish & Kerala Delicacies'}
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Connection Pill */}
          <button
            onClick={onOpenSetupGuide}
            title={`Firebase: bubshi-food-hub-5b8ee (${connectionInfo.state})`}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              connectionInfo.state === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : connectionInfo.state === 'checking'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {connectionInfo.state === 'connected' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : connectionInfo.state === 'checking' ? (
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className="font-mono text-[11px]">
              {connectionInfo.state === 'connected'
                ? `Firestore (${connectionInfo.itemCount})`
                : connectionInfo.state === 'checking'
                ? 'Connecting...'
                : 'Firestore Info'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold shadow-2xs transition-all active:scale-95"
            title="Switch Language / ഭാഷ മാറ്റുക"
          >
            <span className="text-sm">🌐</span>
            <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-gray-700 hover:text-amber-700 hover:bg-amber-50 border border-gray-200 transition-colors"
            title={t('adminPortal')}
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/20 hover:from-amber-700 hover:to-orange-700 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cart')}</span>
            {totalCount > 0 && (
              <span className="bg-white text-orange-700 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-5 text-center shadow-xs">
                {totalCount}
              </span>
            )}
            {totalAmount > 0 && (
              <span className="hidden md:inline font-bold ml-0.5 text-amber-100">
                ₹{totalAmount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
