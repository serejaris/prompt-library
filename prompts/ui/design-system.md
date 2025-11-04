# Design System - Система Дизайна

## Назначение
Создание консистентной системы UI компонентов с единым стилем, переиспользуемыми элементами и дизайн-токенами.

## Промпт

```
Ты senior UI/UX разработчик, специализирующийся на design systems.

ЗАДАЧА: Создать mini design system с переиспользуемыми компонентами.

КОМПОНЕНТЫ DESIGN SYSTEM:

1. DESIGN TOKENS
   - Colors (primary, secondary, neutral, semantic)
   - Typography (шрифты, размеры, веса, line-heights)
   - Spacing (margin, padding scale: 4px базис)
   - Shadows (elevation levels)
   - Border radius (rounded corners)
   - Transitions (animation timing)

2. BASE COMPONENTS
   - Button (variants: primary, secondary, ghost, danger)
   - Input / TextField
   - Select / Dropdown
   - Checkbox / Radio
   - Toggle / Switch
   - Card
   - Modal / Dialog
   - Alert / Toast
   - Badge
   - Avatar

3. LAYOUT COMPONENTS
   - Container
   - Grid / Flex
   - Stack (vertical/horizontal)
   - Divider
   - Spacer

4. NAVIGATION
   - Navbar
   - Sidebar
   - Breadcrumbs
   - Tabs
   - Pagination

5. FORM PATTERNS
   - Form layout
   - Validation states
   - Error messages
   - Success states
   - Loading states

ПРИНЦИПЫ:

КОНСИСТЕНТНОСТЬ:
- Единая цветовая схема
- Единые отступы (8px grid system)
- Единая типографика
- Единый визуальный язык

ACCESSIBILITY (a11y):
- Keyboard navigation
- ARIA labels
- Color contrast (WCAG AA)
- Focus indicators
- Screen reader support

RESPONSIVE:
- Mobile-first подход
- Breakpoints: xs, sm, md, lg, xl
- Fluid typography
- Flexible layouts

COMPOSABILITY:
- Компоненты легко комбинируются
- Props API интуитивный
- Поддержка children
- Variants через props

DOCUMENTATION:
- Примеры использования для каждого компонента
- Props documentation
- Accessibility notes
- Do's and Don'ts

ФОРМАТ ВЫВОДА:
1. Design tokens (variables/constants)
2. Base component реализация
3. Variants and states
4. Usage examples
5. Accessibility checklist
```

## Примеры

### Пример 1: Design Tokens

**Запрос:**
```
Создай design tokens для современного SaaS приложения
Стиль: clean, professional, tech-forward
```

**Сгенерированные токены:**

```typescript
// colors.ts
export const colors = {
  // Primary - для основных действий
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // main
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral - для текста и фонов
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    1000: '#000000',
  },

  // Semantic - для статусов
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#065F46',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#991B1B',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#92400E',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1E40AF',
  },
};

// typography.ts
export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// spacing.ts (8px base)
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};

// shadows.ts
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// borderRadius.ts
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',   // fully rounded
};

// transitions.ts
export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  timing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// breakpoints.ts
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### Пример 2: Button Component

**Запрос:**
```
Создай Button компонент на основе design tokens выше
Варианты: primary, secondary, ghost, danger
Размеры: sm, md, lg
```

**Компонент:**

```typescript
// Button.tsx
import React from 'react';
import { colors, spacing, borderRadius, typography, transitions } from './tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.duration.base} ${transitions.timing.ease}`,
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      ':hover': {
        backgroundColor: colors.primary[600],
      },
      ':active': {
        backgroundColor: colors.primary[700],
      },
      ':focus': {
        outline: `2px solid ${colors.primary[500]}`,
        outlineOffset: '2px',
      },
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[900],
      border: `1px solid ${colors.neutral[300]}`,
      ':hover': {
        backgroundColor: colors.neutral[200],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
      ':hover': {
        backgroundColor: colors.neutral[100],
      },
    },
    danger: {
      backgroundColor: colors.error.main,
      color: colors.neutral[0],
      ':hover': {
        backgroundColor: colors.error.dark,
      },
    },
  };

  const sizeStyles = {
    sm: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
      gap: spacing[1],
    },
    md: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      gap: spacing[2],
    },
    lg: {
      padding: `${spacing[4]} ${spacing[6]}`,
      fontSize: typography.fontSize.lg,
      gap: spacing[2],
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && <Spinner size={size} />}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}

// Spinner component for loading state
function Spinner({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 12, md: 16, lg: 20 };
  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

**Usage Examples:**

```tsx
// Примеры использования
import { Button } from './Button';
import { PlusIcon, TrashIcon } from './icons';

function Examples() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Variants */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>

      {/* Sizes */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      {/* With Icons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button leftIcon={<PlusIcon />}>Create</Button>
        <Button variant="danger" rightIcon={<TrashIcon />}>
          Delete
        </Button>
      </div>

      {/* States */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button disabled>Disabled</Button>
        <Button loading>Loading...</Button>
      </div>

      {/* Full Width */}
      <Button fullWidth variant="primary">
        Full Width Button
      </Button>
    </div>
  );
}
```

**Accessibility Checklist:**

```
✅ Keyboard navigation (Tab, Enter, Space)
✅ ARIA attributes (aria-busy, aria-disabled)
✅ Focus indicator (outline)
✅ Color contrast (WCAG AA compliant)
✅ Screen reader support
✅ Disabled state communicated
✅ Loading state communicated
```

## Модификации промпта

### Для Dark Mode

```
DARK MODE SUPPORT:

Создай два набора токенов:
- Light theme
- Dark theme

Используй CSS variables или theme provider для переключения.

Пример:
const darkColors = {
  primary: { ...}, // adjusted for dark bg
  neutral: { ...}, // inverted scale
  semantic: { ...} // adjusted contrast
}
```

### Для Accessibility Focus

```
ACCESSIBILITY FIRST:

Дополнительные требования:
- Минимум 4.5:1 color contrast (текст)
- Минимум 3:1 contrast (UI элементы)
- Focus indicators видимы на всех фонах
- Animations уважают prefers-reduced-motion
- Font sizes минимум 16px
- Touch targets минимум 44x44px
```

### Для Библиотеки Компонентов

```
COMPONENT LIBRARY:

Для каждого компонента создай:
1. TypeScript определения (Props interface)
2. Варианты и размеры
3. Storybook stories
4. Unit тесты
5. Accessibility тесты
6. Документацию использования
```

## Best Practices

### Naming Conventions

```typescript
// ✅ GOOD: Semantic names
colors.primary[500]
spacing[4]
typography.fontSize.base

// ❌ BAD: Magic values
'#6366F1'
'16px'
'1rem'
```

### Token Organization

```
tokens/
├── colors.ts
├── typography.ts
├── spacing.ts
├── shadows.ts
├── breakpoints.ts
└── index.ts (exports all)
```

### Component Structure

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
└── index.ts
```

## Инструменты

### Storybook Setup

```bash
# Install Storybook
npx sb init

# Run Storybook
npm run storybook
```

### Figma → Code

```
Инструменты для экспорта из Figma:
- Figma Tokens plugin
- Style Dictionary
- Figmagic
```

### Testing

```typescript
// Visual regression tests
import { test } from '@playwright/test';

test('button matches snapshot', async ({ page }) => {
  await page.goto('/button');
  await expect(page).toHaveScreenshot();
});
```

## Метрики качества

✓ Все компоненты используют design tokens
✓ Consisten naming convention
✓ WCAG AA accessibility
✓ Mobile responsive
✓ Storybook documentation
✓ Unit test coverage > 80%
✓ TypeScript strict mode

---

**Теги:** #design-system #ui #components #tokens #accessibility
