# Test Coverage - Комплексное Тестирование

## Назначение
Генерация comprehensive test suite с покрытием всех сценариев: happy path, edge cases, error handling, граничные значения.

## Промпт

```
Ты опытный QA engineer и TDD практик.

ЗАДАЧА: Создать comprehensive test suite для данного кода.

ОБЯЗАТЕЛЬНЫЕ КАТЕГОРИИ ТЕСТОВ:

1. HAPPY PATH (Основные сценарии)
   - Типичное использование
   - Ожидаемые входные данные
   - Стандартные case'ы

2. EDGE CASES (Граничные случаи)
   - Минимальные/максимальные значения
   - Пустые данные
   - Очень большие объёмы данных
   - Необычные, но валидные комбинации

3. ERROR HANDLING (Обработка ошибок)
   - Невалидные входные данные
   - Отсутствующие обязательные параметры
   - Неправильные типы данных
   - Network/Database ошибки
   - Timeout сценарии

4. BOUNDARY VALUES (Граничные значения)
   - Ноль, -1, максимальные числа
   - Пустые строки, очень длинные строки
   - Null, undefined, NaN
   - Граничные даты

5. INTEGRATION (Интеграционные)
   - Взаимодействие с другими модулями
   - API calls
   - Database операции
   - External services

ТРЕБОВАНИЯ К ТЕСТАМ:
- Каждый тест должен проверять ОДНУ вещь
- Описательные названия (it should...)
- Arrange-Act-Assert паттерн
- Mock внешние зависимости
- Независимость тестов друг от друга
- Минимум 80% code coverage

ФОРМАТ ТЕСТА:
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do X when Y', () => {
      // Arrange - подготовка
      // Act - действие
      // Assert - проверка
    });
  });
});

ДОПОЛНИТЕЛЬНО:
- Укажи какие моки нужны
- Предложи test fixtures/factories
- Отметь сложные для тестирования места
```

## Примеры

### Пример 1: Тестирование функции валидации

**Код для тестирования:**
```typescript
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**Запрос:**
```
Создай comprehensive test suite для функции validateEmail
```

**Сгенерированные тесты:**
```typescript
import { validateEmail } from './validators';

describe('validateEmail', () => {
  describe('Happy Path', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should return true for email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    it('should return true for email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should return true for email with numbers', () => {
      expect(validateEmail('user123@example123.com')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should return true for very long valid email', () => {
      const longEmail = 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.com';
      expect(validateEmail(longEmail)).toBe(true);
    });

    it('should return true for email with hyphens', () => {
      expect(validateEmail('user-name@ex-ample.com')).toBe(true);
    });

    it('should return true for email with dots in local part', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });
  });

  describe('Invalid Inputs', () => {
    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should return false for email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should return false for email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('should return false for email without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should return false for email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('should return false for email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('user@exam ple.com')).toBe(false);
    });

    it('should return false for email with multiple @', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
    });
  });

  describe('Boundary Values', () => {
    it('should return false for single character', () => {
      expect(validateEmail('a')).toBe(false);
    });

    it('should return true for minimal valid email', () => {
      expect(validateEmail('a@b.c')).toBe(true);
    });

    it('should handle null gracefully', () => {
      expect(() => validateEmail(null as any)).not.toThrow();
    });

    it('should handle undefined gracefully', () => {
      expect(() => validateEmail(undefined as any)).not.toThrow();
    });
  });

  describe('Special Characters', () => {
    it('should return false for email with special chars', () => {
      expect(validateEmail('user!name@example.com')).toBe(false);
      expect(validateEmail('user#name@example.com')).toBe(false);
    });
  });
});
```

### Пример 2: Тестирование async функции с API

**Код:**
```typescript
async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}
```

**Тесты:**
```typescript
import { fetchUser } from './api';

describe('fetchUser', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    jest.resetAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch and return user data', async () => {
      const mockUser = { id: '123', name: 'John' };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      const user = await fetchUser('123');

      expect(fetch).toHaveBeenCalledWith('/api/users/123');
      expect(user).toEqual(mockUser);
    });
  });

  describe('Error Handling', () => {
    it('should throw error on 404', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(fetchUser('999')).rejects.toThrow(
        'Failed to fetch user: 404'
      );
    });

    it('should throw error on 500', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(fetchUser('123')).rejects.toThrow(
        'Failed to fetch user: 500'
      );
    });

    it('should handle network error', async () => {
      global.fetch = jest.fn().mockRejectedValue(
        new Error('Network error')
      );

      await expect(fetchUser('123')).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(fetchUser('123')).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty userId', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await fetchUser('');

      expect(fetch).toHaveBeenCalledWith('/api/users/');
    });

    it('should handle special characters in userId', async () => {
      const userId = 'user@123#';
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: userId }),
      });

      await fetchUser(userId);

      expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}`);
    });
  });

  describe('Response Format', () => {
    it('should handle empty response object', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const user = await fetchUser('123');

      expect(user).toEqual({});
    });

    it('should handle response with extra fields', async () => {
      const mockUser = {
        id: '123',
        name: 'John',
        extraField: 'value',
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });

      const user = await fetchUser('123');

      expect(user).toEqual(mockUser);
    });
  });
});
```

## Модификации промпта

### Для TDD подхода
```
TDD MODE:
1. Сначала напиши failing tests
2. Минимальная реализация чтобы тесты прошли
3. Рефакторинг
4. Повтори цикл
```

### Для E2E тестов
```
E2E TESTING:
- Используй Playwright/Cypress
- Тестируй real user flows
- Проверяй UI элементы
- Тестируй на разных браузерах
- Включи screenshot tests
```

### Для performance тестов
```
PERFORMANCE TESTS:
- Benchmark критичных функций
- Load testing для API
- Memory leak detection
- Async операции под нагрузкой
```

## Test Fixtures и Factories

```
Создай test fixtures для этих тестов:

ТРЕБОВАНИЯ:
- Фабрики для создания тестовых объектов
- Моки для внешних сервисов
- Test database seeds
- Fixtures для разных сценариев
- Helper функции для setup/teardown

ПРИМЕР FACTORY:
function createMockUser(overrides = {}) {
  return {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  };
}
```

## Best Practices

### Структура тестов
```
tests/
├── unit/           # Изолированные тесты
├── integration/    # Тесты взаимодействия
├── e2e/           # End-to-end
├── fixtures/      # Тестовые данные
└── helpers/       # Вспомогательные функции
```

### Naming Convention
```
✅ ХОРОШО:
it('should return user when ID exists')
it('should throw error when user not found')
it('should handle concurrent requests correctly')

❌ ПЛОХО:
it('test 1')
it('works')
it('user function')
```

### AAA Pattern
```
it('should calculate total with discount', () => {
  // Arrange - подготовка
  const cart = createCart();
  const discount = 10;

  // Act - действие
  const total = calculateTotal(cart, discount);

  // Assert - проверка
  expect(total).toBe(90);
});
```

## Метрики покрытия

```
ЦЕЛЕВЫЕ МЕТРИКИ:
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

КРИТИЧНЫЙ КОД (требует >95%):
- Аутентификация
- Платёжная логика
- Security функции
- Data validation
```

## Комбинирование

### Test Coverage + Feature Builder
```
Feature Builder с TDD:
1. Планирование
2. Написать тесты
3. Реализация
4. Проверка coverage
```

### Test Coverage + Guardrail
```
При изменении кода:
1. Обнови затронутые тесты
2. Добавь тесты для новых case'ов
3. Проверь что все тесты проходят
```

## Troubleshooting

**Низкий coverage:**
```
Проанализируй coverage report и создай тесты для:
- Непокрытых branches
- Error paths
- Edge cases в непротестированных функциях
```

**Медленные тесты:**
```
Оптимизируй тесты:
- Используй моки вместо реальных calls
- Параллелизация тестов
- Оптимизация setup/teardown
- Удали дублирующиеся тесты
```

**Флаки тесты (нестабильные):**
```
Исправь flaky tests:
- Убери зависимость от времени
- Фикси порядок выполнения
- Правильный cleanup между тестами
- Стабилизируй async операции
```

---

**Теги:** #тестирование #качество #tdd #coverage #automation
