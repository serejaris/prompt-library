import Link from 'next/link';
import { getCategories, getPromptsByCategory } from '@/lib/prompts';

export const metadata = {
  title: 'Категории | Библиотека Промптов',
  description: 'Все категории промптов для вайбкодинга',
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Категории Промптов
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Промпты организованы по категориям для удобного поиска нужного инструмента
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([key, category]) => {
          const prompts = getPromptsByCategory(key);

          return (
            <Link
              key={key}
              href={`/category/${key}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-500"
            >
              <div className="p-8">
                <div className="text-6xl mb-4 text-center">{category.icon}</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">
                  {category.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  {category.description}
                </p>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-semibold">
                    {prompts.length} {prompts.length === 1 ? 'промпт' : 'промптов'}
                  </span>
                </div>
              </div>
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <span className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Смотреть промпты →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
