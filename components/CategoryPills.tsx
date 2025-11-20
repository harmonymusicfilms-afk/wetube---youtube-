import React from 'react';

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="sticky top-14 bg-wetube-dark z-30 py-3 px-4 border-b border-wetube-hover mb-4 overflow-x-auto flex gap-3 custom-scrollbar">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
          selectedCategory === 'All'
            ? 'bg-white text-black'
            : 'bg-[#222] text-white hover:bg-[#3F3F3F]'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-white text-black'
              : 'bg-[#222] text-white hover:bg-[#3F3F3F]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;