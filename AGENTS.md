# JustSearch Platform — Agent Development Guide

> **Scope**: Frontend-only development standards. Backend integration is out of scope unless explicitly requested.
> **Rule**: Never auto-commit or auto-push to git. All git operations must be done manually by the user.

---

## 1. Project Overview

JustSearch is a **multi-tenant, white-label restaurant engagement platform** built as a Turborepo monorepo. Each restaurant gets a branded customer-facing site via subdomain, plus dedicated portals for staff, delivery agents, and platform admins.

**Frontend Apps**:
- `apps/customer-frontend` — Public restaurant site (menu, games, loyalty, checkout)
- `apps/delivery-portal` — Delivery agent dispatch dashboard
- `apps/restaurant-dashboard` — Restaurant owner POS & operations
- `apps/justsearch-admin` — Platform super-admin

**Shared Packages**:
- `packages/ui` — Shared component library
- `packages/types` — Unified TypeScript contracts
- `packages/utils` — Shared utilities & helpers
- `packages/config` — Shared Tailwind + TypeScript presets

---

## 2. Technology Stack (Approved Packages Only)

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Framework** | `next` | ^15 | App Router, RSC, SSR, SSG |
| **Language** | `typescript` | ^5 | Strict mode enabled |
| **Styling** | `tailwindcss` | ^4 | Utility-first CSS |
| **Components** | `@radix-ui/*` | Latest | Headless accessible primitives |
| **Animation** | `framer-motion` | Latest | Declarative animations |
| **Icons** | `lucide-react` | Latest | Consistent iconography |
| **State** | `zustand` | Latest | Lightweight global state |
| **Forms** | `react-hook-form` | Latest | Form handling + validation |
| **Validation** | `zod` | Latest | Schema validation |
| **Query** | `@tanstack/react-query` | Latest | Server state management |
| **Date** | `date-fns` | Latest | Date formatting & manipulation |
| **Class Merge** | `clsx` + `tailwind-merge` | Latest | Conditional class merging |

**Forbidden packages** (do not add without explicit approval):
- `moment` — use `date-fns` instead
- `lodash` — use native ES2023+ or `radash`
- `redux` — use `zustand` or React Context
- `styled-components` / `emotion` — use Tailwind only
- `axios` — use native `fetch` with React Query
- `@mui/material`, `antd`, `chakra-ui` — use Radix + custom UI

---

## 3. File Structure Standards

### 3.1 App Directory Structure

Every Next.js app must follow this exact structure:

```
app/
├── (routes)/                    # Route groups for layout splitting
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Loading UI
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404 page
│   ├── menu/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── eat-play/
│   │   ├── page.tsx
│   │   └── [gameId]/
│   │       ├── page.tsx
│   │       └── play/
│   │           └── page.tsx
│   └── profile/
│       ├── page.tsx
│       ├── layout.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [orderId]/
│       │       └── page.tsx
│       └── settings/
│           └── page.tsx
├── api/                         # Route handlers only
│   └── auth/
│       └── route.ts
├── globals.css
└── layout.tsx

components/
├── ui/                          # Generic reusable UI (buttons, inputs, cards)
├── layout/                      # Layout shells, headers, footers, sidebars
├── [feature]/                   # Feature-specific components
│   ├── index.ts                 # Barrel export
│   ├── [feature]-container.tsx     # Smart component (data + logic)
│   ├── [feature]-presenter.tsx       # Dumb component (props only)
│   ├── [feature]-card.tsx
│   ├── [feature]-list.tsx
│   ├── [feature]-item.tsx
│   ├── [feature]-header.tsx
│   ├── [feature]-empty.tsx
│   ├── [feature]-skeleton.tsx
│   ├── [feature]-error.tsx
│   ├── hooks/
│   │   ├── use-[feature].ts
│   │   └── use-[feature]-query.ts
│   ├── types/
│   │   └── [feature].types.ts
│   └── utils/
│       └── [feature].utils.ts
└── shared/                      # Cross-feature shared components

lib/
├── api/                         # API client functions
│   ├── index.ts
│   ├── client.ts                # Fetch wrapper
│   └── [resource].api.ts        # Per-resource API calls
├── constants/
│   └── [domain].constants.ts
├── utils/
│   └── [domain].utils.ts
├── hooks/
│   └── use-[domain].ts
├── types/
│   └── [domain].types.ts
└── validations/
    └── [domain].schema.ts       # Zod schemas

hooks/                           # Global hooks (rarely needed, prefer feature hooks)
types/                           # Global types
public/
├── games/
├── images/
└── fonts/
```

### 3.2 Package Directory Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── avatar.tsx
│   │   ├── tabs.tsx
│   │   └── index.ts             # Barrel export all
│   ├── hooks/
│   │   └── use-media-query.ts
│   ├── utils/
│   │   └── cn.ts                # clsx + tailwind-merge
│   └── index.ts
├── package.json
└── tsconfig.json

packages/types/
├── src/
│   ├── restaurant.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   ├── game.types.ts
│   ├── delivery.types.ts
│   └── index.ts
└── package.json

packages/utils/
├── src/
│   ├── formatters/
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   └── phone.ts
│   ├── validators/
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   └── index.ts
└── package.json
```

---

## 4. Component Architecture (Maximum Split Rule)

### 4.1 The Golden Rule

**Never write more than 80 lines in a single component file.** If a component exceeds 80 lines, it must be split.

### 4.2 Component Types

| Type | Responsibility | Location | Max Lines |
|------|---------------|----------|-----------|
| **Page** | Route entry point, data fetching, metadata | `app/**/page.tsx` | 30 |
| **Layout** | Structure wrapper, providers | `app/**/layout.tsx` | 40 |
| **Container** | Data fetching, state, business logic | `components/[feature]/container.tsx` | 60 |
| **Presenter** | Props-only rendering, no logic | `components/[feature]/presenter.tsx` | 50 |
| **Card** | Single item display | `components/[feature]/*-card.tsx` | 40 |
| **List** | Array rendering with loading/empty | `components/[feature]/*-list.tsx` | 50 |
| **Item** | Minimal presentational piece | `components/[feature]/*-item.tsx` | 30 |
| **Form** | Input collection with validation | `components/[feature]/*-form.tsx` | 60 |
| **Empty** | Empty state illustration | `components/[feature]/*-empty.tsx` | 25 |
| **Skeleton** | Loading placeholder | `components/[feature]/*-skeleton.tsx` | 25 |
| **Error** | Error fallback UI | `components/[feature]/*-error.tsx` | 25 |
| **Header** | Section title + actions | `components/[feature]/*-header.tsx` | 25 |

### 4.3 Splitting Strategy

```tsx
// ❌ BAD: One massive component (150+ lines)
function RestaurantMenuPage() {
  // ...data fetching
  // ...state management
  // ...filtering logic
  // ...rendering categories
  // ...rendering items
  // ...cart logic
  // ...loading state
  // ...empty state
}

// ✅ GOOD: Split into atomic pieces
// app/menu/page.tsx (15 lines)
export default function MenuPage() {
  return <MenuContainer />;
}

// components/menu/menu-container.tsx (40 lines)
export function MenuContainer() {
  const { categories, isLoading } = useMenuQuery();
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredItems = useFilteredItems(categories, activeCategory);

  if (isLoading) return <MenuSkeleton />;
  if (!categories.length) return <MenuEmpty />;

  return (
    <MenuPresenter
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      items={filteredItems}
    />
  );
}

// components/menu/menu-presenter.tsx (35 lines)
export function MenuPresenter({ categories, activeCategory, onCategoryChange, items }) {
  return (
    <div>
      <MenuHeader title="Our Menu" itemCount={items.length} />
      <CategoryFilterTabs
        categories={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />
      <MenuItemList items={items} />
    </div>
  );
}

// components/menu/menu-item-list.tsx (20 lines)
export function MenuItemList({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// components/menu/menu-item-card.tsx (35 lines)
export function MenuItemCard({ item }) {
  const { addToCart } = useCartStore();

  return (
    <Card>
      <MenuItemImage src={item.image} alt={item.name} />
      <MenuItemInfo name={item.name} description={item.description} price={item.price} />
      <MenuItemTags tags={item.tags} />
      <Button onClick={() => addToCart(item)}>Add to Cart</Button>
    </Card>
  );
}
```

### 4.4 Naming Convention

```
Components: PascalCase (MenuItemCard, RestaurantHeader)
Hooks: camelCase prefixed with 'use' (useMenuQuery, useCartStore)
Utilities: camelCase (formatCurrency, parsePhoneNumber)
Constants: SCREAMING_SNAKE_CASE (MAX_CART_ITEMS, DEFAULT_PAGE_SIZE)
Types/Interfaces: PascalCase with domain suffix (MenuItem, OrderStatus)
Files: kebab-case (menu-item-card.tsx, use-menu-query.ts)
```

---

## 5. Clean Code Standards

### 5.1 General Rules

1. **Single Responsibility**: One component/file does one thing only
2. **No Magic Numbers**: Extract to named constants
3. **Early Returns**: Reduce nesting, return early for guards
4. **Destructuring**: Always destructure props and hook returns
5. **No `any`**: Use `unknown` if type is uncertain, then narrow
6. **No `console.log`**: Use proper error boundaries and logging
7. **No Inline Styles**: Use Tailwind classes only
8. **No Prop Drilling**: Use Zustand or Context for deep data

### 5.2 Function Standards

```tsx
// ❌ BAD
function handleClick() {
  console.log('clicked');
  setState(true);
  fetch('/api').then(r => r.json()).then(d => {
    console.log(d);
  });
}

// ✅ GOOD
const handleAddToCart = useCallback(
  async (item: MenuItem) => {
    try {
      await addToCart(item);
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item');
    }
  },
  [addToCart]
);
```

### 5.3 TypeScript Strictness

```ts
// ❌ BAD
const data: any = await response.json();

// ✅ GOOD
const data: MenuResponse = await response.json();

// ❌ BAD
function processItem(item) { ... }

// ✅ GOOD
function processItem(item: MenuItem): ProcessedMenuItem { ... }

// ❌ BAD
const [state, setState] = useState();

// ✅ GOOD
const [isOpen, setIsOpen] = useState<boolean>(false);
```

### 5.4 Import Ordering

```tsx
// 1. React/Next imports
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party packages
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

// 3. Internal shared packages
import { Button } from '@justsearch/ui';
import { formatCurrency } from '@justsearch/utils';

// 4. Local imports (absolute path via @/)
import { useMenuQuery } from '@/components/menu/hooks/use-menu-query';
import { MenuItemCard } from '@/components/menu/menu-item-card';

// 5. Types
import type { MenuItem } from '@/types/menu.types';

// 6. Styles (last)
import './menu-page.css'; // Rarely needed with Tailwind
```

---

## 6. State Management Standards

### 6.1 Hierarchy

| Scope | Tool | Example |
|-------|------|---------|
| **Server State** | React Query | Menu data, orders, user profile |
| **Global UI State** | Zustand | Cart, sidebar open, toast queue |
| **Feature State** | React hooks | Form inputs, filters, pagination |
| **Component State** | useState | Modal open, hover state |

### 6.2 Zustand Store Pattern

```ts
// stores/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

---

## 7. API & Data Fetching Standards

### 7.1 React Query Pattern

```ts
// lib/api/menu.api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchMenu(restaurantId: string): Promise<MenuCategory[]> {
  const response = await fetch(`${API_BASE}/restaurants/${restaurantId}/menu`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 }, // ISR for menu
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu: ${response.status}`);
  }

  return response.json();
}

// components/menu/hooks/use-menu-query.ts
import { useQuery } from '@tanstack/react-query';

export function useMenuQuery(restaurantId: string) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => fetchMenu(restaurantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 7.2 Error Handling

```tsx
// components/menu/menu-error.tsx
export function MenuError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-red-500">Failed to load menu</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <Button onClick={onRetry} variant="outline">Try Again</Button>
    </div>
  );
}
```

---

## 8. Form Standards

### 8.1 React Hook Form + Zod

```tsx
// components/menu/menu-item-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(200, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Select a category'),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.string()).max(3, 'Maximum 3 tags'),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

export function MenuItemForm({ onSubmit, defaultValues }: MenuItemFormProps) {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Whipped Hummus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Item'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 9. Animation Standards

### 9.1 Framer Motion Rules

```tsx
// ❌ BAD: Inline animation config clutter
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
>

// ✅ GOOD: Extracted animation variants
import { fadeInUp } from '@/lib/animations/variants';

<motion.div variants={fadeInUp} initial="hidden" animate="visible">

// lib/animations/variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
```

---

## 10. Testing Standards (When Implemented)

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

- Unit test all utilities and hooks
- Integration test API functions with MSW
- E2E test critical user flows only

---

## 11. Performance Rules

1. **Images**: Use `next/image` with proper `sizes` and `priority` for above-fold
2. **Fonts**: Use `next/font` for optimal loading
3. **Code Splitting**: Use dynamic imports for heavy components
4. **Lists**: Always use `key` with stable IDs, never index
5. **Memoization**: Use `useMemo`/`useCallback` for expensive computations and stable callbacks
6. **State**: Keep state as close to usage as possible (lift only when necessary)
7. **Effects**: Minimize `useEffect`, prefer React Query for async

---

## 12. Git Workflow (Manual Only)

**Never** run these commands automatically:
- `git add`
- `git commit`
- `git push`
- `git merge`
- `git rebase`

If the user asks to save work, only show them the exact commands to run manually. Never execute git mutations unless explicitly asked and confirmed.

---

## 13. Summary Checklist

Before marking any feature as complete, verify:

- [ ] No component exceeds 80 lines
- [ ] Every component has a single responsibility
- [ ] All props are typed with TypeScript interfaces
- [ ] No `any` types used
- [ ] No `console.log` statements
- [ ] Loading, empty, and error states are handled
- [ ] Uses approved packages only
- [ ] Follows file structure standards
- [ ] Uses barrel exports for clean imports
- [ ] No prop drilling beyond 2 levels
- [ ] All magic numbers extracted to constants
- [ ] Images use `next/image`
- [ ] Fonts use `next/font`
- [ ] Animations use extracted variants
- [ ] Forms use React Hook Form + Zod
- [ ] API calls use React Query
- [ ] No git commands executed automatically

---

*This document is the living standard for JustSearch frontend development. All code must conform to these rules.*
