// Список всех промптов
const prompts = [
    {
        category: 'core',
        name: 'Feature Builder',
        file: 'prompts/core/feature-builder.md',
        description: 'Поэтапное создание функций'
    },
    {
        category: 'core',
        name: 'Guardrail',
        file: 'prompts/core/guardrail.md',
        description: 'Безопасность и ограничения'
    },
    {
        category: 'core',
        name: 'Overview First',
        file: 'prompts/core/overview-first.md',
        description: 'Сначала обзор, потом детали'
    },
    {
        category: 'core',
        name: 'Style Guide',
        file: 'prompts/core/style-guide.md',
        description: 'Руководство по стилю кода'
    },
    {
        category: 'documentation',
        name: 'README Generator',
        file: 'prompts/documentation/readme-generator.md',
        description: 'Генерация README файлов'
    },
    {
        category: 'performance',
        name: 'Performance Debugger',
        file: 'prompts/performance/performance-debugger.md',
        description: 'Отладка производительности'
    },
    {
        category: 'specialized',
        name: 'API Design',
        file: 'prompts/specialized/api-design.md',
        description: 'Проектирование API'
    },
    {
        category: 'specialized',
        name: 'Security Audit',
        file: 'prompts/specialized/security-audit.md',
        description: 'Аудит безопасности'
    },
    {
        category: 'testing',
        name: 'Test Coverage',
        file: 'prompts/testing/test-coverage.md',
        description: 'Покрытие тестами'
    },
    {
        category: 'ui',
        name: 'Design System',
        file: 'prompts/ui/design-system.md',
        description: 'Дизайн-система'
    }
];

let currentCategory = 'all';
let currentPrompt = null;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderPromptsList();
    setupEventListeners();
});

// Рендер списка промптов
function renderPromptsList(filter = '') {
    const promptsList = document.getElementById('promptsList');
    promptsList.innerHTML = '';

    const filteredPrompts = prompts.filter(prompt => {
        const matchesCategory = currentCategory === 'all' || prompt.category === currentCategory;
        const matchesSearch = filter === '' ||
            prompt.name.toLowerCase().includes(filter.toLowerCase()) ||
            prompt.description.toLowerCase().includes(filter.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredPrompts.length === 0) {
        promptsList.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary);">Промпты не найдены</p>';
        return;
    }

    filteredPrompts.forEach(prompt => {
        const promptItem = document.createElement('div');
        promptItem.className = 'prompt-item';
        promptItem.innerHTML = `
            <h3>${prompt.name}</h3>
            <div class="category-tag">${prompt.category}</div>
        `;
        promptItem.addEventListener('click', () => loadPrompt(prompt));
        promptsList.appendChild(promptItem);
    });
}

// Загрузка и отображение промпта
async function loadPrompt(prompt) {
    try {
        const response = await fetch(prompt.file);
        if (!response.ok) throw new Error('Failed to load prompt');

        const content = await response.text();
        displayPrompt(prompt, content);

        // Активная подсветка выбранного промпта
        document.querySelectorAll('.prompt-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.prompt-item').classList.add('active');

        currentPrompt = { ...prompt, content };
    } catch (error) {
        console.error('Error loading prompt:', error);
        document.getElementById('promptDisplay').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p>Ошибка загрузки промпта</p>
            </div>
        `;
    }
}

// Отображение промпта
function displayPrompt(prompt, content) {
    const promptDisplay = document.getElementById('promptDisplay');

    // Используем marked для парсинга markdown
    const htmlContent = marked.parse(content);

    promptDisplay.innerHTML = `
        <div class="prompt-header">
            <h2>${prompt.name}</h2>
            <div class="prompt-meta">
                <span class="prompt-category-badge">${prompt.category}</span>
                <button class="copy-btn" onclick="copyPromptToClipboard()">
                    Копировать
                </button>
            </div>
        </div>
        <div class="prompt-content">
            ${htmlContent}
        </div>
    `;
}

// Копирование промпта в буфер обмена
async function copyPromptToClipboard() {
    if (!currentPrompt) return;

    try {
        await navigator.clipboard.writeText(currentPrompt.content);

        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Скопировано!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Не удалось скопировать текст');
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        renderPromptsList(e.target.value);
    });

    // Фильтрация по категориям
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Убираем активный класс со всех кнопок
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));

            // Добавляем активный класс на текущую кнопку
            e.target.classList.add('active');

            // Устанавливаем текущую категорию
            currentCategory = e.target.dataset.category;

            // Перерисовываем список
            renderPromptsList(searchInput.value);
        });
    });
}

// Экспортируем для использования в HTML
window.copyPromptToClipboard = copyPromptToClipboard;
