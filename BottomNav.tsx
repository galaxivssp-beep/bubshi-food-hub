import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';
import { Utensils, Sparkles, ShoppingBag, Lock, MessageCircle, ArrowRight } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenCart,
  onOpenAdmin,
}) => {
  const { lang, t } = useLanguage();
  const { totalCount, totalAmount } = useCart();
  const isMl = lang === 'ml';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe">
      {/* Floating cart bar if items are in cart */}
      {totalCount > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={onOpenCart}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3 flex items-center justify-between shadow-xl shadow-emerald-900/30 active:scale-98 transition-all animate-bounce-short"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white text-emerald-800 font-extrabold text-xs px-2 py-0.5 rounded-full">
                {totalCount} {totalCount === 1 ? t('item') : t('items')}
              </span>
              <span className="font-extrabold text-sm tracking-wide">
                ₹{totalAmount}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
              <span>{t('viewCart')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main bottom navigation bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {/* Menu Tab */}
        <button
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'menu'
              ? 'text-amber-900 font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{isMl ? 'മെനു' : 'Menu'}</span>
        </button>

        {/* Specials Tab */}
        <button
          onClick={() => onTabChange('specials')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'specials'
              ? 'text-red-700 font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] mt-0.5">{isMl ? 'സ്പെഷ്യൽ' : 'Specials'}</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello BUBSHI FOOD HUB, I would like to inquire about today fish specials at Station Kadavu.')}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center py-1 px-3 text-emerald-700 hover:text-emerald-800"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">WhatsApp</span>
        </a>

        {/* Cart Tab */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center py-1 px-3 text-gray-700 hover:text-amber-900"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute top-0 right-3 bg-red-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">{isMl ? 'കാർട്ട്' : 'Cart'}</span>
        </button>

        {/* Admin Tab */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center py-1 px-3 text-gray-500 hover:text-amber-900"
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{isMl ? 'അഡ്മിൻ' : 'Admin'}</span>
        </button>
      </nav>
    </div>
  );
};
