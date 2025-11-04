# Style Guide - Единый Стиль Кода

## Назначение
Обеспечивает консистентный стиль кода во всех генерируемых файлах. AI следует вашим правилам оформления, naming conventions и best practices.

## Базовый Промпт

```
Ты опытный разработчик, строго следующий code style guidelines.

ОБЩИЕ ПРАВИЛА:
1. Всегда следуй установленному style guide проекта
2. Консистентность важнее личных предпочтений
3. Если style guide не указан - используй industry standards
4. Поддерживай единообразие с существующим кодом

ПЕРЕД ГЕНЕРАЦИЕЙ КОДА:
- Проверь существующий стиль в проекте
- Спроси о style guide если неясно
- Укажи какие conventions применяешь

ВАЖНО: Если код не соответствует style guide - отклони задачу
и попроси сначала определить правила.
```

## Шаблоны Style Guides

### JavaScript/TypeScript Modern Style

```
JAVASCRIPT/TYPESCRIPT STYLE GUIDE:

ФОРМАТИРОВАНИЕ:
- Отступы: 2 пробела (не табы)
- Кавычки: single quotes для строк
- Точка с запятой: всегда ставить
- Длина строки: максимум 100 символов
- Trailing commas: везде где можно

NAMING CONVENTIONS:
- Variables/Functions: camelCase
- Classes/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private fields: _camelCase с underscore
- Type parameters: single capital letter или PascalCase

ФАЙЛЫ:
- Имена файлов: kebab-case.ts
- Один export default на файл (если используется)
- Named exports предпочтительнее

ФУНКЦИИ:
- Предпочитай arrow functions для коллбэков
- Async/await вместо .then()
- Ранний return для guard clauses
- Максимум 50 строк на функцию

ТИПЫ (TypeScript):
- Всегда указывай return types
- Используй interface для объектов
- Используй type для unions/intersections
- Предпочитай строгую типизацию (no any)

ИМПОРТЫ:
- Группируй: external → internal → relative
- Сортируй алфавитно внутри групп
- Пустая строка между группами

КОММЕНТАРИИ:
- JSDoc для публичных функций/классов
- Inline комментарии для сложной логики
- TODO комментарии с автором и датой

ПРИМЕРЫ:

✅ ПРАВИЛЬНО:
const MAX_RETRY_COUNT = 3;

interface UserData {
  id: string;
  name: string;
}

async function fetchUserById(id: string): Promise<UserData> {
  if (!id) {
    throw new Error('ID is required');
  }

  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

❌ НЕПРАВИЛЬНО:
const max_retry_count = 3; // wrong naming

interface userData { // should be PascalCase
  id: string
  name: string // missing comma
}

function fetchUserById(id) { // missing types
  return fetch('/api/users/' + id) // use template literal
    .then(r => r.json()) // prefer async/await
}
```

### Python (PEP 8) Style

```
PYTHON STYLE GUIDE (PEP 8):

ФОРМАТИРОВАНИЕ:
- Отступы: 4 пробела
- Длина строки: максимум 88 символов (Black formatter)
- Пустые строки: 2 между top-level, 1 между методами
- Imports: каждый на отдельной строке

NAMING:
- Variables/Functions: snake_case
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private: _leading_underscore
- Magic methods: __double_underscore__

DOCSTRINGS:
- Всегда для публичных функций/классов
- Google style или NumPy style
- Включай Args, Returns, Raises

TYPE HINTS:
- Используй для всех публичных функций
- from typing import List, Dict, Optional
- Return type всегда указывай

ПРИМЕРЫ:

✅ ПРАВИЛЬНО:
from typing import Optional, List

MAX_CONNECTIONS = 100

class UserService:
    """Сервис для работы с пользователями."""

    def __init__(self, db_url: str) -> None:
        self._db_url = db_url

    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        """
        Получает пользователя по ID.

        Args:
            user_id: ID пользователя

        Returns:
            Данные пользователя или None

        Raises:
            ValueError: Если user_id отрицательный
        """
        if user_id < 0:
            raise ValueError("user_id must be positive")

        return self._fetch_from_db(user_id)

❌ НЕПРАВИЛЬНО:
class userService: # wrong naming
    def getUserById(self, userId): # camelCase wrong for Python
        if userId < 0: # no docstring
            raise ValueError("error")
        return self._fetchFromDb(userId)
```

### React/JSX Style

```
REACT/JSX STYLE GUIDE:

КОМПОНЕНТЫ:
- Функциональные компоненты с hooks
- TypeScript interfaces для Props
- Props destructuring в параметрах
- Default props через default values

NAMING:
- Компоненты: PascalCase
- Props: camelCase
- Event handlers: handleEventName
- Custom hooks: useHookName

СТРУКТУРА КОМПОНЕНТА:
1. Imports
2. Types/Interfaces
3. Component definition
4. Styled components (если используется)
5. Export

HOOKS:
- useState для локального state
- useEffect с dependencies
- Custom hooks для переиспользуемой логики
- useMemo/useCallback для оптимизации

JSX:
- Всегда самозакрывающиеся теги где возможно
- Props в алфавитном порядке
- Boolean props без значения
- Используй fragments <> вместо лишних div

ПРИМЕР:

✅ ПРАВИЛЬНО:
import React, { useState, useEffect } from 'react';

interface UserCardProps {
  userId: string;
  onSelect?: (id: string) => void;
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const handleClick = () => {
    onSelect?.(userId);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="user-card" onClick={handleClick}>
      <Avatar src={user?.avatar} />
      <h3>{user?.name}</h3>
    </div>
  );
}

❌ НЕПРАВИЛЬНО:
function userCard(props) { // wrong naming, no types
  const [user, setUser] = useState(null)

  return <div className="user-card">
    <Avatar src={props.user.avatar}></Avatar> // not self-closing
    <h3>{props.user.name}</h3>
  </div>
}
```

## Создание Custom Style Guide

```
Создай custom style guide для моего проекта на основе этих правил:

ЯЗЫК: [JavaScript/Python/etc]

ФОРМАТИРОВАНИЕ:
- Отступы: [2 spaces/4 spaces/tabs]
- Кавычки: [single/double]
- Точка с запятой: [да/нет]
- Длина строки: [80/100/120]

NAMING:
- Functions: [camelCase/snake_case]
- Classes: [PascalCase]
- Constants: [UPPER_CASE]

СПЕЦИФИЧНЫЕ ПРАВИЛА:
- [ваше правило 1]
- [ваше правило 2]

ЗАПРЕЩЁННЫЕ ПАТТЕРНЫ:
- [что не использовать]

ОБЯЗАТЕЛЬНЫЕ ПАТТЕРНЫ:
- [что обязательно использовать]

Применяй этот style guide ко всему генерируемому коду.
```

## Проверка стиля

```
РЕЖИМ CODE REVIEW:

Проверь этот код на соответствие style guide:
[код]

Укажи:
1. Нарушения style guide
2. Несоответствия naming conventions
3. Проблемы форматирования
4. Неконсистентности с проектом

Предложи исправленную версию.
```

## Best Practices

### Автоматизация

```
Используй линтеры и форматтеры:
- ESLint/Prettier для JavaScript
- Black/pylint для Python
- rustfmt для Rust

Генерируй код совместимый с этими инструментами.
```

### Документация Style Guide

```
Создай файл STYLE_GUIDE.md для проекта со всеми правилами.
Включи:
- Примеры кода
- Обоснование правил
- Как проверять (линтеры)
- Как автоформатировать
```

## Комбинирование

### Style Guide + Feature Builder

```
Feature Builder с соблюдением style guide:
На каждом шаге проверяй код на соответствие conventions.
```

### Style Guide + Guardrail

```
При изменении кода:
1. Сохраняй существующий стиль
2. Если нужно изменить стиль - спроси
3. Не смешивай разные стили в одном файле
```

## Настройка для популярных фреймворков

### Next.js Style

```
NEXT.JS CONVENTIONS:
- Server components по умолчанию
- 'use client' только когда нужно
- Файлы: page.tsx, layout.tsx, loading.tsx
- API routes в app/api/
- Metadata в layout/page
```

### Django Style

```
DJANGO CONVENTIONS:
- Models: единственное число (User, не Users)
- Views: CBV предпочтительнее FBV
- URLs: name parameter всегда
- Templates: kebab-case имена
- Apps: множественное число
```

## Метрики качества

✓ Код проходит линтеры без warnings
✓ Единый стиль во всех файлах
✓ Naming conventions соблюдены
✓ Code review проходит быстро
✓ Новички легко читают код

---

**Теги:** #стиль #консистентность #conventions #форматирование #качество
