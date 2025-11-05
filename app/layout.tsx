import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Библиотека Промптов для Вайбкодеров',
  description: 'Коллекция профессиональных промптов для эффективного программирования с использованием AI-ассистентов',
  keywords: ['вайбкодинг', 'AI', 'промпты', 'программирование', 'Claude', 'ChatGPT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400">
                Сделано с ❤️ для русскоязычного сообщества вайбкодеров
              </p>
              <div className="mt-4 space-x-4">
                <a
                  href="https://github.com/serejaris/prompt-library"
                  className="text-primary-400 hover:text-primary-300 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://t.me/vibecoders"
                  className="text-primary-400 hover:text-primary-300 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
