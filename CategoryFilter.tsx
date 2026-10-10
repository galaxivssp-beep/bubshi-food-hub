import React from 'react';
import { CATEGORIES } from '../data/defaultFoods';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const { lang } = useLanguage();
  const isMl = lang === 'ml';

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;
        const label = isMl ? cat.ml : cat.en;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 shrink-0 ${
              isSelected
                ? 'bg-amber-900 text-white shadow-md shadow-amber-950/20 ring-2 ring-amber-800'
                : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-200'
            }`}
          >
            <span>{label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-amber-800 text-amber-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
