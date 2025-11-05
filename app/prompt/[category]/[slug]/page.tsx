import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPrompt, getAllPrompts, getCategories } from '@/lib/prompts';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CopyButton from '@/components/CopyButton';

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Генерация статических параметров для всех промптов
export async function generateStaticParams() {
  const prompts = getAllPrompts();

  return prompts.map((prompt) => ({
    category: prompt.category,
    slug: prompt.slug,
  }));
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: PageProps) {
  const prompt = getPrompt(params.category, params.slug);

  if (!prompt) {
    return {
      title: 'Промпт не найден',
    };
  }

  return {
    title: `${prompt.metadata.title} | Библиотека Промптов`,
    description: prompt.metadata.description || prompt.metadata.title,
  };
}

export default function PromptPage({ params }: PageProps) {
  const prompt = getPrompt(params.category, params.slug);
  const categories = getCategories();

  if (!prompt) {
    notFound();
  }

  const category = categories[params.category as keyof typeof categories];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            <Link href={`/category/${params.category}`} className="hover:text-primary-600">
              {category?.name || params.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">
            {prompt.metadata.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {prompt.metadata.title}
            </h1>
            {prompt.metadata.description && (
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {prompt.metadata.description}
              </p>
            )}
          </div>
          <span className="ml-4 px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-semibold rounded-full whitespace-nowrap">
            {category?.icon} {category?.name}
          </span>
        </div>

        {/* Tags */}
        {prompt.metadata.tags && prompt.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <div className="mb-6">
          <CopyButton text={prompt.content} />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <MarkdownRenderer content={prompt.content} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/category/${params.category}`}
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Назад к категории</span>
        </Link>

        <a
          href={`https://github.com/serejaris/prompt-library/blob/main/prompts/${params.category}/${params.slug}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>Редактировать на GitHub</span>
        </a>
      </div>
    </div>
  );
}
