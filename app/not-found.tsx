import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          К сожалению, запрашиваемая вами страница не существует.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
