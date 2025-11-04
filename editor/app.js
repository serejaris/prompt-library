// Prompt Library Data Structure
const promptLibrary = {
    core: [
        {
            name: 'Guardrail',
            file: 'guardrail.md',
            description: 'Контроль изменений для точечных правок'
        },
        {
            name: 'Feature Builder',
            file: 'feature-builder.md',
            description: 'Поэтапное создание сложных функций'
        },
        {
            name: 'Overview First',
            file: 'overview-first.md',
            description: 'Объяснение перед генерацией кода'
        },
        {
            name: 'Style Guide',
            file: 'style-guide.md',
            description: 'Единый стиль кода'
        }
    ],
    testing: [
        {
            name: 'Test Coverage',
            file: 'test-coverage.md',
            description: 'Комплексное покрытие тестами'
        }
    ],
    performance: [
        {
            name: 'Performance Debugger',
            file: 'performance-debugger.md',
            description: 'Анализ и оптимизация производительности'
        }
    ],
    documentation: [
        {
            name: 'README Generator',
            file: 'readme-generator.md',
            description: 'Генерация практичной документации'
        }
    ],
    ui: [
        {
            name: 'Design System',
            file: 'design-system.md',
            description: 'Система дизайна с компонентами'
        }
    ],
    specialized: [
        {
            name: 'API Design',
            file: 'api-design.md',
            description: 'Проектирование REST/GraphQL API'
        },
        {
            name: 'Security Audit',
            file: 'security-audit.md',
            description: 'Аудит безопасности кода'
        }
    ]
};

const categoryIcons = {
    core: 'fa-star',
    testing: 'fa-flask',
    performance: 'fa-tachometer-alt',
    documentation: 'fa-book',
    ui: 'fa-palette',
    specialized: 'fa-wrench'
};

const categoryNames = {
    core: 'Core (Основные)',
    testing: 'Testing (Тестирование)',
    performance: 'Performance (Оптимизация)',
    documentation: 'Documentation (Документация)',
    ui: 'UI (Интерфейсы)',
    specialized: 'Specialized (Специализированные)'
};

// State
let currentMode = 'view';
let currentPrompt = null;
let currentCategory = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
    initializeEventListeners();
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
});

// Initialize Categories
function initializeCategories() {
    const categoriesContainer = document.querySelector('.categories');

    Object.keys(promptLibrary).forEach(categoryKey => {
        const category = promptLibrary[categoryKey];
        const categoryElement = createCategoryElement(categoryKey, category);
        categoriesContainer.appendChild(categoryElement);
    });
}

function createCategoryElement(categoryKey, prompts) {
    const div = document.createElement('div');
    div.className = 'category';
    div.dataset.category = categoryKey;

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <div class="category-title">
            <i class="fas ${categoryIcons[categoryKey]}"></i>
            <span>${categoryNames[categoryKey]}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="category-count">${prompts.length}</span>
            <i class="fas fa-chevron-down category-icon"></i>
        </div>
    `;

    header.addEventListener('click', () => {
        div.classList.toggle('collapsed');
    });

    const list = document.createElement('div');
    list.className = 'prompt-list';

    prompts.forEach(prompt => {
        const item = createPromptItem(categoryKey, prompt);
        list.appendChild(item);
    });

    div.appendChild(header);
    div.appendChild(list);

    return div;
}

function createPromptItem(category, prompt) {
    const div = document.createElement('div');
    div.className = 'prompt-item';
    div.dataset.category = category;
    div.dataset.file = prompt.file;

    div.innerHTML = `
        <div class="prompt-item-title">${prompt.name}</div>
        <div class="prompt-item-desc">${prompt.description}</div>
    `;

    div.addEventListener('click', () => {
        loadPrompt(category, prompt);
        document.querySelectorAll('.prompt-item').forEach(item => {
            item.classList.remove('active');
        });
        div.classList.add('active');
    });

    return div;
}

// Load Prompt
async function loadPrompt(category, prompt) {
    currentCategory = category;
    currentPrompt = prompt;

    // Update toolbar
    document.getElementById('promptTitle').textContent = prompt.name;
    document.getElementById('promptCategory').textContent = categoryNames[category];

    try {
        // In production, this would fetch from the actual file
        // For demo purposes, we'll use placeholder content
        const content = await fetchPromptContent(category, prompt.file);
        displayPrompt(content);
    } catch (error) {
        console.error('Error loading prompt:', error);
        showToast('Ошибка загрузки промпта', 'error');
    }
}

async function fetchPromptContent(category, file) {
    // In a real implementation, this would fetch from ../prompts/{category}/{file}
    // For now, return demo content
    return `# ${currentPrompt.name}

## Назначение
${currentPrompt.description}

## Промпт

\`\`\`
Ты опытный разработчик.

ЗАДАЧА: [описание задачи]

ТРЕБОВАНИЯ:
- Требование 1
- Требование 2
- Требование 3

ФОРМАТ ВЫВОДА:
1. Анализ
2. Решение
3. Примеры
\`\`\`

## Примеры использования

### Пример 1

**Запрос:**
\`\`\`
Пример запроса к AI
\`\`\`

**Результат:**
\`\`\`javascript
// Пример сгенерированного кода
function example() {
    console.log('Hello, Vibe Coding!');
}
\`\`\`

## Best Practices

1. ✅ **DO:** Делай так
2. ❌ **DON'T:** Не делай так

## Комбинирование

Этот промпт хорошо комбинируется с:
- Feature Builder
- Test Coverage
- Style Guide

---

**Теги:** #core #${category}`;
}

function displayPrompt(content) {
    const preview = document.getElementById('markdownPreview');
    const editor = document.getElementById('markdownEditor');
    const splitEditor = document.getElementById('splitEditor');
    const splitPreview = document.getElementById('splitPreview');

    const html = marked.parse(content);

    preview.innerHTML = html;
    editor.value = content;
    splitEditor.value = content;
    splitPreview.innerHTML = html;

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // Extract prompts (code blocks in ``` format)
    extractPrompts(content);
}

function extractPrompts(content) {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];

    if (matches.length > 0) {
        // Show extractor panel if there are code blocks
        // For now, we'll keep it hidden
    }
}

// Event Listeners
function initializeEventListeners() {
    // Mode switching
    document.getElementById('viewModeBtn').addEventListener('click', () => {
        switchMode('view');
    });

    document.getElementById('editModeBtn').addEventListener('click', () => {
        switchMode('edit');
    });

    document.getElementById('splitModeBtn').addEventListener('click', () => {
        switchMode('split');
    });

    // Copy button
    document.getElementById('copyBtn').addEventListener('click', copyPrompt);

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportPrompt);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Live preview in split mode
    document.getElementById('splitEditor').addEventListener('input', (e) => {
        const html = marked.parse(e.target.value);
        document.getElementById('splitPreview').innerHTML = html;
        document.querySelectorAll('#splitPreview pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    });

    // New prompt modal
    document.getElementById('addPromptBtn').addEventListener('click', () => {
        document.getElementById('newPromptModal').classList.add('show');
    });

    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('newPromptModal').classList.remove('show');
    });

    document.getElementById('cancelNewPrompt').addEventListener('click', () => {
        document.getElementById('newPromptModal').classList.remove('show');
    });

    document.getElementById('createNewPrompt').addEventListener('click', createNewPrompt);
}

function switchMode(mode) {
    currentMode = mode;

    // Update buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hide all containers
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('splitMode').style.display = 'none';

    // Show selected mode
    if (mode === 'view') {
        document.getElementById('viewMode').style.display = 'block';
        document.getElementById('viewModeBtn').classList.add('active');
    } else if (mode === 'edit') {
        document.getElementById('editMode').style.display = 'block';
        document.getElementById('editModeBtn').classList.add('active');
    } else if (mode === 'split') {
        document.getElementById('splitMode').style.display = 'flex';
        document.getElementById('splitModeBtn').classList.add('active');
    }
}

function copyPrompt() {
    if (!currentPrompt) {
        showToast('Выберите промпт для копирования', 'warning');
        return;
    }

    let content = '';

    if (currentMode === 'view') {
        content = document.getElementById('markdownEditor').value;
    } else if (currentMode === 'edit') {
        content = document.getElementById('markdownEditor').value;
    } else if (currentMode === 'split') {
        content = document.getElementById('splitEditor').value;
    }

    // Extract just the prompt section (between ``` markers)
    const promptMatch = content.match(/## Промпт\s+```[\s\S]*?\n([\s\S]*?)```/);

    if (promptMatch && promptMatch[1]) {
        navigator.clipboard.writeText(promptMatch[1].trim())
            .then(() => showToast('Промпт скопирован в буфер обмена!'))
            .catch(() => showToast('Ошибка копирования', 'error'));
    } else {
        // Copy full content if no prompt section found
        navigator.clipboard.writeText(content)
            .then(() => showToast('Контент скопирован!'))
            .catch(() => showToast('Ошибка копирования', 'error'));
    }
}

function exportPrompt() {
    if (!currentPrompt) {
        showToast('Выберите промпт для экспорта', 'warning');
        return;
    }

    const content = document.getElementById('markdownEditor').value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPrompt.file}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Промпт экспортирован!');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    document.querySelectorAll('.prompt-item').forEach(item => {
        const title = item.querySelector('.prompt-item-title').textContent.toLowerCase();
        const desc = item.querySelector('.prompt-item-desc').textContent.toLowerCase();

        if (title.includes(query) || desc.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide categories based on visible items
    document.querySelectorAll('.category').forEach(category => {
        const visibleItems = category.querySelectorAll('.prompt-item[style="display: block;"], .prompt-item:not([style])');
        if (query && visibleItems.length === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
}

function createNewPrompt() {
    const name = document.getElementById('promptName').value.trim();
    const category = document.getElementById('promptCategorySelect').value;
    const description = document.getElementById('promptDescription').value.trim();

    if (!name) {
        showToast('Введите название промпта', 'warning');
        return;
    }

    // Create template
    const template = `# ${name}

## Назначение
${description || 'Описание промпта'}

## Промпт

\`\`\`
Ты опытный разработчик.

ЗАДАЧА: [описание задачи]

ТРЕБОВАНИЯ:
- Требование 1
- Требование 2

ФОРМАТ ВЫВОДА:
1. Пункт 1
2. Пункт 2
\`\`\`

## Когда использовать

✅ **Используйте когда:**
- Случай 1
- Случай 2

❌ **Не используйте когда:**
- Случай 1
- Случай 2

## Примеры использования

### Пример 1

**Запрос:**
\`\`\`
[пример запроса]
\`\`\`

**Результат:**
\`\`\`
[результат]
\`\`\`

## Best Practices

1. Рекомендация 1
2. Рекомендация 2

---

**Теги:** #${category} #новый`;

    // Add to library
    const fileName = name.toLowerCase().replace(/\s+/g, '-') + '.md';
    const newPrompt = {
        name: name,
        file: fileName,
        description: description || 'Новый промпт'
    };

    promptLibrary[category].push(newPrompt);

    // Update UI
    const categoryElement = document.querySelector(`.category[data-category="${category}"]`);
    const promptList = categoryElement.querySelector('.prompt-list');
    const promptItem = createPromptItem(category, newPrompt);
    promptList.appendChild(promptItem);

    // Update count
    const countElement = categoryElement.querySelector('.category-count');
    countElement.textContent = promptLibrary[category].length;

    // Load the new prompt
    loadPrompt(category, newPrompt);
    displayPrompt(template);
    switchMode('edit');

    // Close modal
    document.getElementById('newPromptModal').classList.remove('show');

    // Clear form
    document.getElementById('promptName').value = '';
    document.getElementById('promptDescription').value = '';

    showToast('Новый промпт создан!');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    toastMessage.textContent = message;

    // Update icon and color based on type
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        toast.style.background = 'var(--danger-color)';
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-triangle';
        toast.style.background = 'var(--warning-color)';
    } else {
        icon.className = 'fas fa-check-circle';
        toast.style.background = 'var(--success-color)';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (prevent default)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showToast('Автосохранение включено');
    }

    // Ctrl/Cmd + C to copy (when not in input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.target.matches('input, textarea')) {
        copyPrompt();
    }

    // Ctrl/Cmd + 1/2/3 to switch modes
    if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
            e.preventDefault();
            switchMode('view');
        } else if (e.key === '2') {
            e.preventDefault();
            switchMode('edit');
        } else if (e.key === '3') {
            e.preventDefault();
            switchMode('split');
        }
    }
});
