import React, { useState } from 'react';
import type { BudgetCategory } from '../types';
import { PinIcon, PlusCircleIcon, TrashIcon, GripVerticalIcon } from './icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AllCategoriesPageProps {
  categories: BudgetCategory[];
  onCategoryClick: (category: BudgetCategory) => void;
  onToggleShortcut: (categoryId: string) => void;
  onAddCategoryClick: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onOrderChange: (event: DragEndEvent) => void;
}

const PacingIndicator: React.FC<{ pacing: 'good' | 'warning' | 'danger' }> = ({ pacing }) => {
  const color = {
    good: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400'
  }[pacing];
  return <div className={`w-2 h-2 rounded-full ${color}`}></div>;
};

const CategoryCard: React.FC<{
  category: BudgetCategory;
  isOverlay?: boolean;
}> = ({ category, isOverlay }) => {
  return (
    <div
      className={`relative flex items-center p-4 bg-white rounded-2xl shadow-sm transition-all duration-300 ${isOverlay ? 'shadow-2xl' : 'group-hover:shadow-lg group-hover:-translate-y-1'}`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white mr-4`} style={{ backgroundColor: category.color }}>
        <category.Icon className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-800">{category.name}</p>
          <PacingIndicator pacing={category.pacing} />
        </div>
        <p className="text-sm text-gray-500">${category.spent.toFixed(2)} / ${category.goal.toLocaleString()}</p>
      </div>
    </div>
  );
};

const SortableCategoryCard: React.FC<{
  category: BudgetCategory;
  onCategoryClick: (category: BudgetCategory) => void;
  onToggleShortcut: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}> = ({ category, onCategoryClick, onToggleShortcut, onDeleteCategory }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div onClick={() => onCategoryClick(category)} className="cursor-pointer">
        <CategoryCard category={category} />
      </div>

      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-full text-gray-400 bg-white/50 hover:bg-gray-200 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortcut(category.id);
          }}
          className={`p-1.5 rounded-full transition-colors ${category.isShortcut ? 'text-purple-600 bg-purple-100' : 'text-gray-400 bg-white/50 hover:bg-gray-100'}`}
          aria-label={category.isShortcut ? 'Remove from shortcuts' : 'Add to shortcuts'}
        >
          <PinIcon className="w-5 h-5" filled={category.isShortcut} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCategory(category.id);
          }}
          className="p-1.5 rounded-full text-red-400 bg-white/50 hover:bg-red-100 hover:text-red-600 transition-colors"
          aria-label="Delete category"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


const AllCategoriesPage: React.FC<AllCategoriesPageProps> = ({ categories, onCategoryClick, onToggleShortcut, onAddCategoryClick, onDeleteCategory, onOrderChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onOrderChange(event);
  };

  const activeCategory = activeId ? categories.find(c => c.id === activeId) : null;

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.mainCategory]) {
      acc[category.mainCategory] = [];
    }
    acc[category.mainCategory].push(category);
    return acc;
  }, {} as Record<string, BudgetCategory[]>);

  const mainCategoryOrder: (keyof typeof groupedCategories)[] = ['Needs', 'Wants', 'Financial Goals', 'Miscellaneous'];

  return (
    <div className="h-full flex flex-col">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold text-[#1A202C]">Manage Budgets</h1>
          <p className="text-gray-500 mt-2">Use the handle to drag and drop categories to reorder or re-categorize them.</p>
        </div>
        <button
          onClick={onAddCategoryClick}
          className="flex items-center space-x-2 bg-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/40"
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span>Add Category</span>
        </button>
      </header>
      <div className="flex-1 overflow-y-auto pr-4 -mr-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={categories.map(c => c.id)} strategy={rectSortingStrategy}>
            <div className="space-y-10">
              {mainCategoryOrder.map(mainCategory => (
                groupedCategories[mainCategory] && groupedCategories[mainCategory].length > 0 && (
                  <section key={mainCategory}>
                    <h2 className="text-2xl font-bold text-purple-800 mb-4 pb-2 border-b-2 border-purple-100">{mainCategory}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedCategories[mainCategory]?.map(category => (
                        <SortableCategoryCard
                          key={category.id}
                          category={category}
                          onCategoryClick={onCategoryClick}
                          onToggleShortcut={onToggleShortcut}
                          onDeleteCategory={onDeleteCategory}
                        />
                      ))}
                    </div>
                  </section>
                )
              ))}
            </div>
          </SortableContext>
           <DragOverlay>
            {activeCategory ? <CategoryCard category={activeCategory} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default AllCategoriesPage;