import Link from 'next/link';
import { getAllPrompts, getCategories } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';

export default function Home() {
  const prompts = getAllPrompts();
  const categories = getCategories();

  // Группируем промпты по категориям
  const promptsByCategory = Object.keys(categories).reduce((acc, categoryKey) => {
    acc[categoryKey] = prompts.filter(p => p.category === categoryKey);
    return acc;
  }, {} as Record<string, typeof prompts>);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Библиотека Промптов для Вайбкодеров
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Коллекция профессиональных промптов для эффективного программирования
          с использованием AI-ассистентов (Claude, Cursor, GitHub Copilot, и др.)
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/categories"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Все категории
          </Link>
          <a
            href="https://github.com/serejaris/prompt-library"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {prompts.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Промптов в библиотеке
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {Object.keys(categories).length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Категорий
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            100%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Бесплатно и Open Source
          </div>
        </div>
      </div>

      {/* Categories */}
      {Object.entries(categories).map(([key, category]) => {
        const categoryPrompts = promptsByCategory[key];

        if (!categoryPrompts || categoryPrompts.length === 0) {
          return null;
        }

        return (
          <section key={key} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
              <Link
                href={`/category/${key}`}
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Все →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPrompts.slice(0, 3).map((prompt) => (
                <PromptCard key={`${prompt.category}-${prompt.slug}`} prompt={prompt} />
              ))}
            </div>
          </section>
        );
      })}

      {/* What is Vibe Coding */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Что такое Вайб-кодинг?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          <strong>Вайб-кодинг</strong> (Vibe Coding) — современный подход к разработке,
          при котором программист описывает задачу на естественном языке,
          а AI-ассистент генерирует код.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Описывайте ЧТО
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                А не КАК нужно сделать
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Итеративный подход
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Промпт → код → проверка → уточнение
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Контроль
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Понимание сгенерированного кода
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Проверенные промпты
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Для типовых задач
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
