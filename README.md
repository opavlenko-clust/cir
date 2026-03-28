# MVP Template — Venture Factory

Базовий темплейт для запуску нових продуктів через AI-фабрику.

## Стек

| Шар | Технологія |
|-----|-----------|
| Frontend + Backend | Next.js 14 (App Router + API Routes) |
| PWA | next-pwa |
| Mobile wrapper | Capacitor.js |
| Auth | Clerk |
| Database | Supabase |
| Payments | Stripe |
| AI | OpenRouter (всі моделі, один ключ) |
| Email | Resend |
| Analytics | PostHog |
| Errors | Sentry → GitHub Issues |
| Metrics | Grafana + Prometheus |
| QA | Playwright (web + mobile) |
| Security | Snyk + OWASP ZAP + ESLint Security |
| CI | GitHub Actions |
| CD | Vercel |
| Secrets | 1Password CLI |

## Дефолтні ролі

| Роль | Сторінки |
|------|---------|
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/settings`, `/admin/billing`, `/admin/features` |
| User | `/dashboard`, `/profile`, `/billing` |

## /admin/features — Feature Agent

Чат з AI агентом для додавання нового функціоналу:
1. Описуєш що треба
2. Агент уточнює деталі
3. Показує план змін
4. Після підтвердження → деплоїть на staging
5. Перевіряєш → Deploy to Prod або Rollback

## Швидкий старт

```bash
# Клонувати темплейт
gh repo create my-product --private --template venture-factory/mvp-template
cd my-product

# Встановити залежності
npm install

# Скопіювати env
cp .env.example .env.local
# Заповнити всі змінні

# Запустити локально
npm run dev

# Запустити тести
npm test
```

## Environments

| Branch | URL | Призначення |
|--------|-----|-------------|
| `staging` | `staging.[domain]` | Тестування |
| `main` | `[domain]` | Production |

## Secrets (1Password)

Всі ключі зберігаються в 1Password:
- `op://Factory Infrastructure/` — shared ключі фабрики
- `op://[product] Production/` — ключі конкретного продукту
- `op://[product] Staging/` — staging ключі

## Скіли (Cowork)

| Скіл | Що робить |
|------|-----------|
| `bootstrap-startup` | Розгортає новий продукт з нуля |
| `add-feature` | Додає функціонал через Feature Agent |
| `run-qa` | Запускає Playwright тести |
| `rollback` | Відкочує до попередньої версії |
| `security-scan` | OWASP + Snyk сканування |
