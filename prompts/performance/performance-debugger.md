# Performance Debugger - Оптимизация Производительности

## Назначение
Анализ кода на производительность, выявление узких мест (bottlenecks), предложение оптимизаций с учётом trade-offs.

## Промпт

```
Ты эксперт по performance optimization с глубоким пониманием
алгоритмов, memory management и системной архитектуры.

ЗАДАЧА: Проанализировать код и найти проблемы производительности.

АНАЛИЗ ДОЛЖЕН ВКЛЮЧАТЬ:

1. BOTTLENECKS (Узкие места)
   - Медленные алгоритмы (O(n²) и хуже)
   - Избыточные вычисления
   - Блокирующие операции
   - Неэффективные запросы к БД
   - Лишние ререндеры (для UI)

2. MEMORY ISSUES (Проблемы памяти)
   - Memory leaks
   - Избыточное использование памяти
   - Неэффективные структуры данных
   - Отсутствие cleanup

3. NETWORK OPTIMIZATION
   - Избыточные HTTP запросы
   - Отсутствие кэширования
   - Большой payload
   - Неоптимальный батчинг

4. ALGORITHMIC COMPLEXITY
   - Временная сложность O-notation
   - Пространственная сложность
   - Возможность использования более эффективных алгоритмов

ДЛЯ КАЖДОЙ ПРОБЛЕМЫ УКАЗАТЬ:
- Что именно медленно
- Почему это медленно
- Как измерить (profiling)
- Предложения по оптимизации
- Trade-offs (что теряем при оптимизации)
- Приоритет (high/medium/low)

ПРЕДЛОЖИТЬ:
- Оптимизированную версию кода
- Benchmarks (до/после)
- Когда НЕ нужно оптимизировать

ВАЖНО: Не оптимизируй преждевременно!
Сначала измерь, потом оптимизируй.
```

## Примеры

### Пример 1: Оптимизация React компонента

**Код для анализа:**
```typescript
function ProductList({ products }) {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) =>
    a.price - b.price
  );

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Анализ AI:**
```
PERFORMANCE ANALYSIS: ProductList Component

🔴 CRITICAL ISSUES:

1. ЛИШНИЕ ВЫЧИСЛЕНИЯ НА КАЖДОМ РЕНДЕРЕ
   Проблема:
   - filter() и sort() выполняются при КАЖДОМ рендере
   - Даже если products и search не изменились
   - O(n log n) сложность на каждый keystroke

   Измерить:
   - React DevTools Profiler
   - Console.time вокруг фильтрации

   Решение: useMemo
   const filteredAndSorted = useMemo(() => {
     return products
       .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
       .sort((a, b) => a.price - b.price);
   }, [products, search]);

   Impact: ~80% reduction в re-computation

2. МУТАЦИЯ МАССИВА В СОРТИРОВКЕ
   Проблема:
   - sort() мутирует оригинальный массив
   - Может вызвать баги если массив используется в других местах

   Решение: Скопировать перед сортировкой
   const sortedProducts = [...filteredProducts].sort(...)

3. РЕРЕНДЕРЫ ProductCard
   Проблема:
   - ProductCard ререндерится даже если product не изменился
   - Если ProductCard сложный - это дорого

   Решение: React.memo
   const ProductCard = React.memo(({ product }) => {
     // ...
   });

🟡 MEDIUM PRIORITY:

4. РЕГИСТР В КАЖДОЙ ИТЕРАЦИИ
   Проблема:
   - toLowerCase() вызывается для каждого продукта
   - search.toLowerCase() вычисляется в каждой итерации

   Решение: Вынести за цикл
   const searchLower = search.toLowerCase();
   const filtered = products.filter(p =>
     p.name.toLowerCase().includes(searchLower)
   );

5. НЕТ DEBOUNCE ДЛЯ ПОИСКА
   Проблема:
   - Фильтрация на каждый keystroke
   - Для больших списков - заметная задержка

   Решение: Debounce input
   const debouncedSearch = useDebounce(search, 300);

ОПТИМИЗИРОВАННАЯ ВЕРСИЯ:

import { useMemo, useState } from 'react';
import { useDebounce } from './hooks';

const ProductCard = React.memo(({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
});

function ProductList({ products }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredAndSorted = useMemo(() => {
    if (!debouncedSearch) {
      return [...products].sort((a, b) => a.price - b.price);
    }

    const searchLower = debouncedSearch.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(searchLower))
      .sort((a, b) => a.price - b.price);
  }, [products, debouncedSearch]);

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      {filteredAndSorted.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

TRADE-OFFS:

✅ Преимущества:
- Значительно быстрее для больших списков (1000+ items)
- Меньше ререндеров
- Лучший UX (нет задержек при вводе)

⚠️ Недостатки:
- Больше кода (сложность)
- Дополнительный хук (useDebounce)
- Небольшая задержка в отображении результатов (300ms)

КОГДА ОПТИМИЗИРОВАТЬ:
✅ Если products.length > 100
✅ Если пользователи жалуются на задержки
✅ Если React Profiler показывает проблемы

❌ КОГДА НЕ НУЖНО:
- Список < 50 элементов
- Нет жалоб на производительность
- Простые ProductCard компоненты

BENCHMARKS:
Список из 1000 продуктов, поиск "phone":

До оптимизации: ~45ms на keystroke
После оптимизации: ~2ms (первый раз), ~0ms (кэш)

ПРИОРИТЕТ: HIGH (если > 500 items), LOW (если < 100 items)
```

### Пример 2: Оптимизация SQL запроса

**Код:**
```sql
SELECT *
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
WHERE o.created_at > '2024-01-01'
  AND u.country = 'US'
  AND p.category = 'Electronics'
ORDER BY o.created_at DESC
```

**Анализ:**
```
SQL PERFORMANCE ANALYSIS

🔴 CRITICAL ISSUES:

1. SELECT * (ИЗБЫТОЧНЫЕ ДАННЫЕ)
   Проблема:
   - Выбираются все колонки из 3 таблиц
   - Много лишних данных передаётся по сети
   - Больше IO операций

   Решение: Выбирать только нужные колонки
   SELECT o.id, o.created_at, u.name, u.email,
          p.name as product_name, p.price

   Impact: ~60% меньше данных

2. ОТСУТСТВИЕ ИНДЕКСОВ
   Проблема:
   - WHERE условия на неиндексированных колонках
   - Full table scan на каждой таблице
   - JOIN без индексов

   Решение: Создать индексы
   CREATE INDEX idx_orders_created ON orders(created_at);
   CREATE INDEX idx_orders_user ON orders(user_id);
   CREATE INDEX idx_users_country ON users(country);
   CREATE INDEX idx_products_category ON products(category);

   Impact: 100x-1000x ускорение

3. НЕОПТИМАЛЬНЫЙ ПОРЯДОК JOIN
   Проблема:
   - Сначала джойним все orders, потом фильтруем
   - Лучше сначала отфильтровать

   Решение: Фильтровать раньше
   SELECT ...
   FROM users u
   WHERE u.country = 'US'
   JOIN orders o ON o.user_id = u.id
     AND o.created_at > '2024-01-01'
   JOIN products p ON o.product_id = p.id
     AND p.category = 'Electronics'

🟡 MEDIUM PRIORITY:

4. СОРТИРОВКА ВСЕХ РЕЗУЛЬТАТОВ
   Проблема:
   - Если результатов много - сортировка дорогая
   - Обычно нужны только первые N

   Решение: Добавить LIMIT
   ORDER BY o.created_at DESC
   LIMIT 100

5. ДАТА В ВИДЕ СТРОКИ
   Проблема:
   - Сравнение строк медленнее чем дат
   - Может не использовать индекс

   Решение: Параметризованный запрос с датой

ОПТИМИЗИРОВАННЫЙ ЗАПРОС:

-- Создать индексы (один раз)
CREATE INDEX idx_orders_created_user ON orders(created_at, user_id);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_products_category ON products(category);

-- Оптимизированный запрос
SELECT
  o.id,
  o.created_at,
  o.total_amount,
  u.name as user_name,
  u.email,
  p.name as product_name,
  p.price
FROM users u
WHERE u.country = 'US'
JOIN orders o ON o.user_id = u.id
  AND o.created_at > $1
JOIN products p ON o.product_id = p.id
  AND p.category = 'Electronics'
ORDER BY o.created_at DESC
LIMIT 100;

EXPLAIN PLAN:
До:  Seq Scan on orders (cost=0..10000)
После: Index Scan using idx_orders_created_user (cost=0..100)

BENCHMARKS:
База: 1M orders, 100K users, 10K products

До оптимизации: ~5000ms
После индексов: ~50ms (100x быстрее)
После всех оптимизаций: ~15ms (333x быстрее)

TRADE-OFFS:

✅ Преимущества:
- Значительно быстрее
- Меньше нагрузка на БД
- Меньше трафика

⚠️ Недостатки:
- Индексы занимают место (disk space)
- Индексы замедляют INSERT/UPDATE
- Нужно поддерживать индексы

ДОПОЛНИТЕЛЬНО:

1. CACHING
   Если запрос частый и данные не меняются часто:
   - Redis cache на 5-15 минут
   - Materialized view для агрегаций

2. PAGINATION
   Для больших результатов:
   OFFSET pagination или Cursor pagination

3. MONITORING
   - Включить slow query log
   - Мониторить через EXPLAIN ANALYZE
   - Alerting на медленные запросы
```

## Модификации промпта

### Для Frontend
```
FRONTEND PERFORMANCE:
- Bundle size analysis
- Code splitting
- Lazy loading
- Image optimization
- Web Vitals (LCP, FID, CLS)
- Lighthouse audit
```

### Для Backend
```
BACKEND PERFORMANCE:
- Database query optimization
- Caching strategies
- API response time
- Memory usage
- CPU profiling
- Concurrency issues
```

### Для Mobile
```
MOBILE PERFORMANCE:
- Battery usage
- Network efficiency
- Memory constraints
- Startup time
- Frame rate (60fps)
```

## Инструменты для измерения

### Профилирование
```
РЕКОМЕНДУЕМЫЕ ИНСТРУМЕНТЫ:

JavaScript/Node.js:
- Chrome DevTools Performance
- React DevTools Profiler
- clinic.js
- 0x (flamegraph)

Python:
- cProfile
- line_profiler
- memory_profiler
- py-spy

Базы данных:
- EXPLAIN ANALYZE (PostgreSQL)
- EXPLAIN (MySQL)
- Query Monitor
- pg_stat_statements

Frontend:
- Lighthouse
- WebPageTest
- Bundle Analyzer
- Coverage tool
```

## Best Practices

1. **Measure First:** Не оптимизируй без измерений
2. **80/20 Rule:** 20% кода дают 80% проблем
3. **User Impact:** Фокус на то, что заметно пользователям
4. **Trade-offs:** Всегда учитывай сложность vs скорость
5. **Regression:** Мониторь чтобы не деградировало

## Чек-лист оптимизации

- [ ] Профилировал с реальными данными
- [ ] Нашёл bottleneck (подтверждено метриками)
- [ ] Оценил impact оптимизации
- [ ] Рассмотрел trade-offs
- [ ] Реализовал оптимизацию
- [ ] Измерил улучшение
- [ ] Написал benchmark тесты
- [ ] Задокументировал решение

---

**Теги:** #производительность #оптимизация #profiling #bottlenecks #performance
