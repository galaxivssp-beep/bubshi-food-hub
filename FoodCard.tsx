import React from 'react';
import { FoodItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Sparkles, Utensils, AlertTriangle } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  onEdit?: (food: FoodItem) => void;
  isAdmin?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, isAdmin }) => {
  const { lang, t } = useLanguage();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const isMl = lang === 'ml';

  const quantity = getItemQuantity(food.id);
  const isAvailable = food.isAvailable !== false;

  const title = isMl && food.nameMl ? food.nameMl : food.name;
  const secondaryTitle = isMl ? food.name : food.nameMl;
  const description = isMl && food.descriptionMl ? food.descriptionMl : food.description;

  const fallbackImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className={`group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        !isAvailable ? 'opacity-75 bg-gray-50' : ''
      }`}
    >
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
          <img
            src={food.imageUrl || fallbackImage}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            {food.isSpecial ? (
              <span className="inline-flex items-center gap-1 bg-red-600/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isMl ? 'സ്പെഷ്യൽ' : "TODAY'S SPECIAL"}</span>
              </span>
            ) : food.category ? (
              <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {food.category}
              </span>
            ) : <span />}

            {!isAvailable && (
              <span className="inline-flex items-center gap-1 bg-neutral-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{t('outOfStock')}</span>
              </span>
            )}
          </div>

          {/* Quick Admin Edit button if in admin mode */}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(food)}
              className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-2.5 py-1 rounded-xl shadow-md border border-gray-200"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-base text-gray-950 leading-snug group-hover:text-amber-800 transition-colors">
                {title}
              </h3>
              {secondaryTitle && secondaryTitle !== title && (
                <p className="text-xs text-amber-900/80 font-medium mt-0.5 truncate">
                  {secondaryTitle}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg font-black text-amber-900 leading-tight block">
                ₹{food.price}
              </span>
            </div>
          </div>

          {description && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Add to Cart CTA */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-gray-500 font-medium">
            {isAvailable ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                {isMl ? 'ലഭ്യമാണ്' : 'Ready to cook/serve'}
              </span>
            ) : (
              <span className="text-neutral-500">{t('outOfStock')}</span>
            )}
          </div>

          {/* Stepper or Add button */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-2xl p-1 shadow-2xs">
              <button
                onClick={() => updateQuantity(food.id, quantity - 1)}
                className="w-7 h-7 rounded-xl bg-white text-amber-900 hover:bg-amber-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm text-amber-950 w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(food.id, quantity + 1)}
                disabled={!isAvailable}
                className="w-7 h-7 rounded-xl bg-amber-800 text-white hover:bg-amber-900 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors active:scale-95 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food, 1)}
              disabled={!isAvailable}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all duration-200 active:scale-95 ${
                !isAvailable
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white shadow-orange-700/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('addToCart')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
