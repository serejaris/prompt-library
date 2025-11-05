import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PromptMetadata {
  title: string;
  description?: string;
  category: string;
  tags?: string[];
}

export interface Prompt {
  slug: string;
  category: string;
  metadata: PromptMetadata;
  content: string;
  rawContent: string;
}

const promptsDirectory = path.join(process.cwd(), 'prompts');

// Категории промптов
export const categories = {
  core: {
    name: 'Core Prompts',
    description: 'Основные промпты для ежедневной работы',
    icon: '📁',
  },
  testing: {
    name: 'Testing Prompts',
    description: 'Тестирование и качество кода',
    icon: '🧪',
  },
  performance: {
    name: 'Performance Prompts',
    description: 'Оптимизация и производительность',
    icon: '⚡',
  },
  documentation: {
    name: 'Documentation Prompts',
    description: 'Документирование кода',
    icon: '📖',
  },
  ui: {
    name: 'UI/UX Prompts',
    description: 'Интерфейсы и дизайн',
    icon: '🎨',
  },
  specialized: {
    name: 'Specialized Prompts',
    description: 'Специализированные промпты',
    icon: '🛠️',
  },
};

export type CategoryKey = keyof typeof categories;

/**
 * Получить все категории
 */
export function getCategories() {
  return categories;
}

/**
 * Получить все промпты из всех категорий
 */
export function getAllPrompts(): Prompt[] {
  const allPrompts: Prompt[] = [];

  Object.keys(categories).forEach((category) => {
    const categoryPath = path.join(promptsDirectory, category);

    if (!fs.existsSync(categoryPath)) {
      return;
    }

    const files = fs.readdirSync(categoryPath);

    files.forEach((fileName) => {
      if (!fileName.endsWith('.md')) {
        return;
      }

      const slug = fileName.replace(/\.md$/, '');
      const prompt = getPrompt(category, slug);

      if (prompt) {
        allPrompts.push(prompt);
      }
    });
  });

  return allPrompts;
}

/**
 * Получить все промпты из определенной категории
 */
export function getPromptsByCategory(category: string): Prompt[] {
  const categoryPath = path.join(promptsDirectory, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  const prompts: Prompt[] = [];

  files.forEach((fileName) => {
    if (!fileName.endsWith('.md')) {
      return;
    }

    const slug = fileName.replace(/\.md$/, '');
    const prompt = getPrompt(category, slug);

    if (prompt) {
      prompts.push(prompt);
    }
  });

  return prompts;
}

/**
 * Получить конкретный промпт
 */
export function getPrompt(category: string, slug: string): Prompt | null {
  try {
    const fullPath = path.join(promptsDirectory, category, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Извлекаем заголовок из первой строки если нет в frontmatter
    const lines = content.split('\n');
    const firstLine = lines[0];
    const title = data.title || (firstLine.startsWith('#')
      ? firstLine.replace(/^#\s*/, '')
      : slug);

    // Извлекаем описание из второго абзаца
    const description = data.description || lines
      .slice(1)
      .find(line => line.trim() && !line.startsWith('#'))
      ?.trim();

    return {
      slug,
      category,
      metadata: {
        title,
        description,
        category: categories[category as CategoryKey]?.name || category,
        tags: data.tags || [],
      },
      content,
      rawContent: fileContents,
    };
  } catch (error) {
    console.error(`Error reading prompt ${category}/${slug}:`, error);
    return null;
  }
}

/**
 * Поиск промптов по запросу
 */
export function searchPrompts(query: string): Prompt[] {
  const allPrompts = getAllPrompts();
  const lowerQuery = query.toLowerCase();

  return allPrompts.filter((prompt) => {
    const titleMatch = prompt.metadata.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = prompt.metadata.description?.toLowerCase().includes(lowerQuery);
    const contentMatch = prompt.content.toLowerCase().includes(lowerQuery);
    const tagsMatch = prompt.metadata.tags?.some(tag =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || descriptionMatch || contentMatch || tagsMatch;
  });
}
