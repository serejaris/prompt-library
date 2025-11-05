import Link from 'next/link';
import { Prompt } from '@/lib/prompts';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link
      href={`/prompt/${prompt.category}/${prompt.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {prompt.metadata.title}
          </h3>
          <span className="ml-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-semibold rounded-full whitespace-nowrap">
            {prompt.metadata.category}
          </span>
        </div>

        {prompt.metadata.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {prompt.metadata.description}
          </p>
        )}

        {prompt.metadata.tags && prompt.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {prompt.metadata.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <span className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
          Читать промпт →
        </span>
      </div>
    </Link>
  );
}
