# Примеры Использования

Практические сценарии применения промптов из библиотеки.

## Сценарий 1: Создание нового API endpoint

### Задача
Создать REST API endpoint для регистрации пользователей с валидацией, хешированием паролей и отправкой email.

### Подход

**Шаг 1: Планирование** (Feature Builder)
```
Используя Feature Builder methodology, создай endpoint для регистрации пользователей.

ТРЕБОВАНИЯ:
- Email и password validation
- Bcrypt для паролей
- JWT токен в ответе
- Отправка welcome email
- PostgreSQL

Начни с шага 1 (планирование).
```

**Шаг 2: Стиль кода** (Style Guide)
```
Применяй Node.js/Express style guide:
- async/await
- Error handling middleware
- JSDoc комментарии
- TypeScript types
```

**Шаг 3: Тестирование** (Test Coverage)
```
Создай comprehensive test suite для /auth/register endpoint.
Включи:
- Happy path
- Валидация email
- Слабый пароль
- Дубликат email
- Database errors
```

**Шаг 4: Безопасность** (Security Audit)
```
Проведи security audit регистрации:
- Rate limiting
- Password strength
- SQL injection protection
- XSS prevention
```

### Результат
Полностью протестированный, безопасный API endpoint с документацией.

---

## Сценарий 2: Рефакторинг React компонента

### Задача
Оптимизировать медленный React компонент с большим списком.

### Подход

**Шаг 1: Анализ** (Performance Debugger)
```
Проанализируй этот React компонент на производительность:

[вставить код компонента]

Найди:
- Лишние ререндеры
- Неоптимальные алгоритмы
- Memory leaks
- Предложи оптимизации
```

**Шаг 2: Объяснение** (Overview First)
```
Overview first: объясни какие оптимизации применишь и почему,
затем покажи оптимизированный код.
```

**Шаг 3: Точечные изменения** (Guardrail)
```
С guardrail approach: примени только обсуждённые оптимизации,
не меняя другие части компонента.
```

**Шаг 4: Тесты** (Test Coverage)
```
Обнови тесты для оптимизированного компонента.
Добавь performance benchmarks.
```

### Результат
Оптимизированный компонент с понятными изменениями и тестами.

---

## Сценарий 3: Создание UI библиотеки

### Задача
Создать библиотеку переиспользуемых React компонентов для команды.

### Подход

**Шаг 1: Design System** (Design System)
```
Создай mini design system для корпоративного приложения.

ТРЕБОВАНИЯ:
- Цветовая схема: синий primary, нейтральные grey
- Компоненты: Button, Input, Card, Modal
- Accessibility: WCAG AA
- TypeScript
```

**Шаг 2: Документация** (README Generator)
```
Создай README для UI библиотеки "CompanyUI".

Включи:
- Installation guide
- Quick start примеры
- Storybook setup
- Customization options
- Accessibility notes
```

**Шаг 3: Тестирование** (Test Coverage)
```
Comprehensive test suite для Button компонента:
- Все variants (primary, secondary, ghost)
- Все sizes (sm, md, lg)
- Disabled state
- Loading state
- Icons
- Accessibility (keyboard, screen readers)
```

### Результат
Production-ready UI библиотека с документацией и тестами.

---

## Сценарий 4: Исправление бага в production

### Задача
Пользователи сообщают о crash при определённых действиях.

### Подход

**Шаг 1: Понимание** (Overview First)
```
Overview first: проанализируй этот error stack trace и объясни:
- Что происходит
- Где проблема
- Возможные причины
- План исправления

[вставить stack trace]
```

**Шаг 2: Исправление** (Guardrail)
```
Guardrail mode: исправь ТОЛЬКО баг, не рефактори другой код.

Покажи diff перед применением.
```

**Шаг 3: Проверка** (Test Coverage)
```
Создай регрессионный тест для этого бага,
чтобы он не повторился.
```

**Шаг 4: Коммит**
```
git commit с подробным описанием:
- Что было сломано
- Root cause
- Как исправлено
- Добавленные тесты
```

### Результат
Быстрое, безопасное исправление с тестами и документацией.

---

## Сценарий 5: API проектирование с нуля

### Задача
Спроектировать REST API для e-commerce платформы.

### Подход

**Шаг 1: Проектирование** (API Design)
```
Спроектируй REST API для e-commerce:

ENTITIES:
- Products (catalog)
- Orders (checkout, payment)
- Users (profiles, addresses)
- Cart (shopping cart)

ТРЕБОВАНИЯ:
- RESTful conventions
- JWT auth
- Pagination, filtering, sorting
- OpenAPI documentation
```

**Шаг 2: База данных** (Specialized)
```
Создай database schema для e-commerce API:
- Products, Orders, Users, Cart
- Relationships
- Indexes для performance
- Constraints
```

**Шаг 3: Безопасность** (Security Audit)
```
Security checklist для e-commerce API:
- Payment data protection
- Authentication
- Rate limiting
- Input validation
- OWASP Top 10
```

**Шаг 4: Документация** (README Generator)
```
Создай comprehensive API documentation:
- All endpoints
- Authentication flow
- Request/Response examples
- Error codes
- Rate limits
- Postman collection
```

### Результат
Полностью спроектированное, безопасное API с документацией.

---

## Комбинирование промптов

### Пример: TDD разработка

```
1. [Feature Builder] Спланируй feature
2. [Test Coverage] Напиши failing tests
3. [Style Guide] Реализуй с соблюдением стиля
4. [Guardrail] Измени только необходимое
5. [Test Coverage] Проверь что тесты проходят
6. [Documentation] Документируй API
```

### Пример: Code Review

```
1. [Overview First] Объясни что делает код
2. [Style Guide] Проверь соответствие стилю
3. [Performance] Найди bottlenecks
4. [Security Audit] Проверь уязвимости
5. [Test Coverage] Оцени покрытие тестами
```

## Советы по эффективному использованию

### 1. Начинайте с контекста
```
Ты senior [роль] разработчик, работающий над [проект].
Используя [промпт], помоги мне [задача].
```

### 2. Итеративный подход
- Не пытайтесь решить всё одним промптом
- Разбивайте на этапы
- Проверяйте результат каждого этапа

### 3. Комбинируйте промпты
```
Используя Feature Builder + Style Guide + Test Coverage,
создай [фичу] с соблюдением [стандартов].
```

### 4. Уточняйте результат
```
Хорошо, но:
- Добавь обработку edge case [X]
- Оптимизируй для [Y]
- Учти constraint [Z]
```

### 5. Сохраняйте работающие промпты
Если промпт хорошо сработал - сохраните его для будущего использования.

---

## Шаблоны для типовых задач

### Новая фича
```
[Feature Builder] + [Style Guide] + [Test Coverage] + [Documentation]
```

### Баг фикс
```
[Overview First] + [Guardrail] + [Test Coverage]
```

### Рефакторинг
```
[Overview First] + [Performance] + [Style Guide] + [Test Coverage]
```

### Code Review
```
[Overview First] + [Style Guide] + [Security Audit] + [Performance]
```

### Новый проект
```
[Feature Builder] + [API Design] + [Design System] + [README Generator]
```

---

**Экспериментируйте и находите свои комбинации! 🚀**
