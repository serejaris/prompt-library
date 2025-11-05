import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getPromptsByCategory, getAllPrompts } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';

interface PageProps {
  params: {
    slug: string;
  };
}

// Генерация статических параметров для всех категорий
export async function generateStaticParams() {
  const categories = getCategories();

  return Object.keys(categories).map((slug) => ({
    slug,
  }));
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: PageProps) {
  const categories = getCategories();
  const category = categories[params.slug as keyof typeof categories];

  if (!category) {
    return {
      title: 'Категория не найдена',
    };
  }

  return {
    title: `${category.name} | Библиотека Промптов`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const categories = getCategories();
  const category = categories[params.slug as keyof typeof categories];

  if (!category) {
    notFound();
  }

  const prompts = getPromptsByCategory(params.slug);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-primary-600">
              Главная
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories" className="hover:text-primary-600">
              Категории
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <div className="text-7xl mb-4">{category.icon}</div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {category.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {category.description}
        </p>
        <div className="mt-4">
          <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-semibold">
            {prompts.length} {prompts.length === 1 ? 'промпт' : 'промптов'}
          </span>
        </div>
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            В этой категории пока нет промптов
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary-600 hover:text-primary-800 font-medium"
          >
            ← Вернуться на главную
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={`${prompt.category}-${prompt.slug}`} prompt={prompt} />
          ))}
        </div>
      )}

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link
          href="/categories"
          className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Все категории</span>
        </Link>
      </div>
    </div>
  );
}
