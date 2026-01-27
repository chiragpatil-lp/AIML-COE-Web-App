"use client";

import { motion } from "framer-motion";
import type { Category } from "@/lib/types/newsletter.types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const allCategory = {
    id: "all",
    name: "All Posts",
    slug: "all",
    postCount: categories.reduce((sum, cat) => sum + cat.postCount, 0),
  };

  const allCategories = [allCategory, ...categories];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {allCategories.map((category, index) => {
          const isSelected = selectedCategory === category.name;

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              onClick={() => onCategoryChange(category.name)}
              className={`
                relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#146e96] text-white shadow-lg"
                    : "bg-white text-[#666666] border border-[#e5e5e5] hover:border-[#146e96] hover:text-[#146e96]"
                }
              `}
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {category.name}
                <span
                  className={`
                    inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold
                    ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#f0f0f0] text-[#666666]"
                    }
                  `}
                >
                  {category.postCount}
                </span>
              </span>

              {/* Animated background for selected state */}
              {isSelected && (
                <motion.div
                  layoutId="category-background"
                  className="absolute inset-0 bg-[#146e96] rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
