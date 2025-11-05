# Веб-приложение Библиотека Промптов

Современный фронтенд на Next.js для библиотеки промптов вайбкодеров.

## Возможности

- 🎨 **Современный UI** - красивый интерфейс с Tailwind CSS
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔍 **Навигация по категориям** - удобный просмотр промптов
- 📋 **Копирование одним кликом** - быстрое копирование промптов
- 🌙 **Поддержка темной темы** - автоматическое переключение
- ⚡ **Быстрая загрузка** - статическая генерация страниц
- 🔎 **SEO оптимизация** - правильные метатеги

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типобезопасность
- **Tailwind CSS** - утилитарные стили
- **React Markdown** - рендеринг Markdown
- **Syntax Highlighting** - подсветка кода

## Установка

```bash
# Установите зависимости
npm install

# Запустите dev сервер
npm run dev

# Откройте http://localhost:3000
```

## Разработка

```bash
# Dev сервер с hot reload
npm run dev

# Сборка production
npm run build

# Запуск production сервера
npm start

# Линтинг
npm run lint
```

## Структура проекта

```
prompt-library/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Главный layout
│   ├── page.tsx             # Главная страница
│   ├── globals.css          # Глобальные стили
│   ├── categories/          # Страница всех категорий
│   ├── category/[slug]/     # Страница категории
│   └── prompt/[category]/[slug]/ # Страница промпта
├── components/              # React компоненты
│   ├── Header.tsx          # Шапка сайта
│   ├── PromptCard.tsx      # Карточка промпта
│   ├── MarkdownRenderer.tsx # Рендер Markdown
│   └── CopyButton.tsx      # Кнопка копирования
├── lib/                    # Утилиты
│   └── prompts.ts          # Работа с промптами
├── prompts/                # Markdown файлы промптов
│   ├── core/
│   ├── testing/
│   ├── performance/
│   ├── documentation/
│   ├── ui/
│   └── specialized/
└── public/                 # Статические файлы
```

## Добавление новых промптов

1. Создайте `.md` файл в нужной категории в папке `prompts/`
2. Напишите промпт в формате Markdown
3. Приложение автоматически подхватит новый промпт

Пример структуры промпта:

```markdown
# Название Промпта

## Назначение
Краткое описание для чего нужен промпт

## Промпт
\`\`\`
Сам текст промпта...
\`\`\`

## Примеры использования
...
```

## Деплой

### Vercel (рекомендуется)

1. Push код в GitHub
2. Импортируйте проект в Vercel
3. Vercel автоматически задеплоит приложение

### Другие платформы

```bash
# Сборка production
npm run build

# Запуск
npm start
```

Можно задеплоить на:
- Netlify
- Railway
- Render
- Cloudflare Pages
- любой другой платформе с поддержкой Node.js

## Настройка

### Изменение цветов

Отредактируйте `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // ваши цвета
      },
    },
  },
},
```

### Добавление категорий

Отредактируйте `lib/prompts.ts`:

```typescript
export const categories = {
  yourcategory: {
    name: 'Your Category',
    description: 'Description',
    icon: '📁',
  },
};
```

## Лицензия

MIT License - используйте свободно!
