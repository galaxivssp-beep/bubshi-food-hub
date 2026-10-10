import React from 'react';
import { FoodItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Flame, Sparkles, Plus, Check } from 'lucide-react';

interface SpecialMenuBannerProps {
  specialFoods: FoodItem[];
  onSelectFood?: (food: FoodItem) => void;
}

export const SpecialMenuBanner: React.FC<SpecialMenuBannerProps> = ({
  specialFoods,
}) => {
  const { lang, t } = useLanguage();
  const { addToCart, getItemQuantity } = useCart();
  const isMl = lang === 'ml';

  if (!specialFoods || specialFoods.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-amber-900 via-orange-950 to-red-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/30 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>{isMl ? 'പ്രഭാത മീൻ സ്പെഷ്യൽ' : 'Station Kadavu Morning Catch'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {t('todaysSpecials')}
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>
            <p className="text-amber-200/80 text-xs sm:text-sm mt-0.5">
              {t('todaysSpecialsSub')}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-2xl text-right">
            <span className="block text-[10px] text-amber-200 uppercase tracking-wider font-medium">
              {isMl ? 'നേരിട്ട് ഓർഡർ ചെയ്യുക' : 'Fresh Daily Supply'}
            </span>
            <span className="text-xs font-bold text-white">
              WhatsApp: 9975587563
            </span>
          </div>
        </div>

        {/* Carousel / Cards grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {specialFoods.slice(0, 3).map((food) => {
            const qty = getItemQuantity(food.id);
            const title = isMl && food.nameMl ? food.nameMl : food.name;
            const subtitle = isMl && food.nameMl ? food.name : food.nameMl;
            const desc = isMl && food.descriptionMl ? food.descriptionMl : food.description;

            return (
              <div
                key={food.id}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex gap-3 hover:bg-white/15 transition-all group"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                  <img
                    src={food.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1 left-1 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-xs">
                    SPECIAL
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate leading-tight">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-[11px] text-amber-200/90 truncate leading-tight mt-0.5">
                        {subtitle}
                      </p>
                    )}
                    {desc && (
                      <p className="text-[10px] text-amber-100/70 line-clamp-1 mt-1">
                        {desc}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-amber-200/80 block leading-none">
                        {isMl ? 'വില' : 'Price'}
                      </span>
                      <span className="text-base font-extrabold text-amber-300">
                        ₹{food.price}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(food, 1)}
                      disabled={food.isAvailable === false}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${
                        food.isAvailable === false
                          ? 'bg-neutral-600/50 text-neutral-400 cursor-not-allowed'
                          : qty > 0
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                      }`}
                    >
                      {qty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{qty} {t('added')}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('addToCart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
