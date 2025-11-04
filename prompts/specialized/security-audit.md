# Security Audit - Аудит Безопасности

## Назначение
Проверка кода на уязвимости безопасности, выявление потенциальных рисков и рекомендации по исправлению.

## Промпт

```
Ты security engineer с опытом в application security и penetration testing.

ЗАДАЧА: Провести security audit кода и найти уязвимости.

КАТЕГОРИИ ПРОВЕРКИ:

1. AUTHENTICATION & AUTHORIZATION
   - Слабая аутентификация
   - Отсутствие rate limiting
   - Некорректная проверка прав доступа
   - Session management
   - JWT безопасность (алгоритм, секреты)

2. INPUT VALIDATION
   - SQL Injection
   - XSS (Cross-Site Scripting)
   - Command Injection
   - Path Traversal
   - SSRF (Server-Side Request Forgery)

3. DATA EXPOSURE
   - Sensitive data в логах
   - Секреты в коде (API keys, passwords)
   - Information disclosure в errors
   - Отсутствие шифрования
   - Insecure data storage

4. CRYPTOGRAPHY
   - Слабые алгоритмы (MD5, SHA1)
   - Hardcoded secrets
   - Insecure random generation
   - Неправильное использование crypto

5. API SECURITY
   - Отсутствие authentication
   - CORS misconfiguration
   - Rate limiting
   - API key exposure
   - Mass assignment

6. DEPENDENCY VULNERABILITIES
   - Устаревшие зависимости
   - Known CVEs
   - Supply chain risks

7. CONFIGURATION
   - Debug mode в production
   - Default credentials
   - Открытые порты
   - Insecure headers
   - HTTPS enforcement

ДЛЯ КАЖДОЙ УЯЗВИМОСТИ:
- Severity: Critical/High/Medium/Low
- Описание проблемы
- Proof of Concept (если возможно)
- Impact (что может произойти)
- Remediation (как исправить)
- CWE/OWASP reference

ФОРМАТ ОТЧЕТА:
1. Executive Summary
2. Vulnerabilities (отсортированы по severity)
3. Рекомендации по исправлению
4. Security best practices
```

## Примеры

### Пример 1: SQL Injection

**Уязвимый код:**
```javascript
// ❌ УЯЗВИМЫЙ КОД
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  db.query(query, (err, result) => {
    res.json(result);
  });
});
```

**Security Audit:**

```markdown
## 🔴 CRITICAL: SQL Injection

**Severity:** Critical
**CWE:** CWE-89
**OWASP:** A03:2021 - Injection

### Описание
Пользовательский ввод (`req.query.id`) напрямую вставляется в SQL запрос без валидации и экранирования. Атакующий может выполнить произвольные SQL команды.

### Proof of Concept
```bash
# Получение всех пользователей
curl "http://api.example.com/user?id=1%20OR%201=1"

# Извлечение паролей
curl "http://api.example.com/user?id=1%20UNION%20SELECT%20password%20FROM%20users"

# Удаление таблицы
curl "http://api.example.com/user?id=1;%20DROP%20TABLE%20users;--"
```

### Impact
- ⚠️ Полный доступ к базе данных
- ⚠️ Утечка sensitive данных (пароли, личная информация)
- ⚠️ Модификация или удаление данных
- ⚠️ Возможность эскалации привилегий

### Remediation

**✅ ИСПРАВЛЕННЫЙ КОД:**

```javascript
// Вариант 1: Parameterized query (best practice)
app.get('/user', async (req, res) => {
  const userId = req.query.id;

  // Валидация входных данных
  if (!userId || !/^\d+$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Используем placeholders вместо конкатенации
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await db.query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Не возвращаем sensitive поля
    const safeUser = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
    };

    res.json(safeUser);
  } catch (err) {
    // Не раскрываем детали ошибки
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Вариант 2: ORM (Sequelize, TypeORM)
app.get('/user', async (req, res) => {
  const userId = req.query.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'], // не включаем password
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Дополнительные рекомендации:
1. Используйте ORM или query builder
2. Применяйте whitelist валидацию для всех входов
3. Используйте принцип least privilege для DB пользователя
4. Включите WAF (Web Application Firewall)
5. Регулярно проводите security audits
```

### Пример 2: JWT Security Issues

**Уязвимый код:**
```javascript
// ❌ УЯЗВИМЫЙ КОД
const jwt = require('jsonwebtoken');

// Слабый секрет
const SECRET = 'secret';

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Нет rate limiting
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // JWT с алгоритмом 'none' уязвим
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET,
      { algorithm: 'HS256', expiresIn: '30d' } // слишком долгий срок
    );
    res.json({ token });
  } else {
    // Information disclosure
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.get('/admin', (req, res) => {
  const token = req.headers.authorization;

  // Нет проверки токена
  const decoded = jwt.decode(token);

  if (decoded.role === 'admin') {
    res.json({ data: 'sensitive admin data' });
  }
});
```

**Security Audit:**

```markdown
## 🔴 HIGH: Multiple JWT Security Issues

### 1. Слабый секретный ключ
**Severity:** High
**CWE:** CWE-321

**Проблема:**
Секрет `'secret'` легко угадать. Атакующий может подобрать секрет brute-force'ом и создавать валидные токены.

**Исправление:**
```javascript
// Используйте криптографически стойкий секрет
// Генерация: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
const SECRET = process.env.JWT_SECRET; // длинный случайный ключ из .env

// Проверка наличия секрета
if (!SECRET || SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}
```

### 2. Отсутствие проверки токена
**Severity:** Critical
**CWE:** CWE-287

**Проблема:**
Используется `jwt.decode()` вместо `jwt.verify()`. Токен не проверяется на валидность signature, любой может создать поддельный токен.

**Исправление:**
```javascript
app.get('/admin', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);

    // ПРАВИЛЬНО: verify проверяет signature
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ['HS256'], // whitelist алгоритмов
    });

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json({ data: 'sensitive admin data' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

### 3. Пароли в plain text
**Severity:** Critical
**CWE:** CWE-256

**Проблема:**
Пароли сравниваются напрямую, значит хранятся в открытом виде.

**Исправление:**
```javascript
const bcrypt = require('bcrypt');

// При регистрации
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Валидация пароля
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Хеширование
  const hashedPassword = await bcrypt.hash(password, 12);

  // Сохранение hashedPassword в БД
  await User.create({ email, password: hashedPassword });
});

// При логине
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    // Generic error (не раскрываем что email не найден)
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Сравнение с хешем
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Генерация токена
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d', // shorter expiration
    }
  );

  res.json({ token });
});
```

### 4. Отсутствие Rate Limiting
**Severity:** High
**CWE:** CWE-307

**Проблема:**
Нет защиты от brute-force атак на /login endpoint.

**Исправление:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, async (req, res) => {
  // login logic
});
```

### 5. Слишком долгий срок жизни токена
**Severity:** Medium
**CWE:** CWE-613

**Проблема:**
Токен живёт 30 дней. Если украден - долго будет валиден.

**Исправление:**
```javascript
// Короткий access token + refresh token
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  SECRET,
  { expiresIn: '15m' } // 15 минут
);

const refreshToken = jwt.sign(
  { userId: user.id, type: 'refresh' },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Сохраняем refresh token в БД с возможностью revoke
await RefreshToken.create({
  userId: user.id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

res.json({ accessToken, refreshToken });
```
```

## Automated Security Tools

### Статический анализ
```bash
# JavaScript/Node.js
npm audit
npm install -g snyk
snyk test

# Semgrep (многоязычный)
semgrep --config=auto

# ESLint security plugin
npm install --save-dev eslint-plugin-security
```

### Dynamic Analysis
```bash
# OWASP ZAP
zap-cli quick-scan http://localhost:3000

# Burp Suite
# GUI tool для penetration testing
```

### Dependency Scanning
```bash
# npm audit
npm audit --audit-level=moderate

# Dependabot (GitHub)
# Автоматические PRs для обновления зависимостей

# Snyk
snyk monitor
```

## Security Checklist

### Authentication
- [ ] Пароли хешированы (bcrypt, Argon2)
- [ ] JWT токены правильно проверяются
- [ ] Rate limiting на auth endpoints
- [ ] Защита от brute-force
- [ ] Multi-factor authentication (опционально)

### Input Validation
- [ ] Все входы валидируются
- [ ] Parameterized queries для SQL
- [ ] Output encoding для XSS
- [ ] File upload проверяется
- [ ] Path traversal защищён

### Data Protection
- [ ] Sensitive data шифруется at rest
- [ ] HTTPS enforced
- [ ] Secure cookies (httpOnly, secure, sameSite)
- [ ] Нет секретов в коде
- [ ] Логи не содержат sensitive данных

### API Security
- [ ] Authentication required
- [ ] Authorization checked
- [ ] CORS правильно настроен
- [ ] Rate limiting
- [ ] Input size limits

### Headers
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Content-Security-Policy
- [ ] Strict-Transport-Security
- [ ] X-XSS-Protection

### Dependencies
- [ ] Зависимости обновлены
- [ ] npm audit проходит
- [ ] Нет known vulnerabilities
- [ ] Lock files (package-lock.json)

---

**Теги:** #security #audit #vulnerabilities #owasp #penetration-testing
