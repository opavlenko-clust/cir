# CIR — Developer Guide

Цей документ для **yevhen.maslov@clust.team** — як розгорнути проєкт локально, працювати з Claude Code і деплоїти зміни.

---

## Що розгорнуто

| Сервіс | Посилання |
|--------|-----------|
| Prod app | https://cir.vercel.app |
| GitHub repo | https://github.com/opavlenko-clust/cir |
| Supabase (БД + Auth) | https://supabase.com/dashboard/project/ncqqoahcejisfaarhljv |
| Vercel (хостинг) | https://vercel.com/opavlenko-4802s-projects/cir |

### Стек

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — PostgreSQL + Auth (email/password)
- **OpenRouter** — AI (Feature Agent)
- **Stripe** — платежі (опціонально)
- **Resend** — email (опціонально)
- **Sentry** — моніторинг помилок (опціонально)
- **PostHog** — аналітика (опціонально)
- **Playwright** — e2e тести

---

## 1. Склонувати проєкт

```bash
git clone https://github.com/opavlenko-clust/cir.git
cd cir
npm install
```

---

## 2. Налаштувати env змінні

Скопіюй файл прикладу:

```bash
cp .env.example .env.local
```

Відкрий `.env.local` і заповни **обов'язкові** поля для локальної розробки:

```env
NEXT_PUBLIC_APP_NAME=cir
NEXT_PUBLIC_APP_DOMAIN=localhost:3000

# Supabase — беремо з https://supabase.com/dashboard/project/ncqqoahcejisfaarhljv/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://ncqqoahcejisfaarhljv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key з Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<service_role key з Supabase dashboard>

# OpenRouter — беремо з https://openrouter.ai/keys
OPENROUTER_API_KEY=<твій ключ>
```

> Stripe, Resend, Sentry, PostHog — опціональні. Локально без них все запрацює.

### Де взяти Supabase ключі

1. Відкрий https://supabase.com/dashboard/project/ncqqoahcejisfaarhljv/settings/api
2. Розділ **Legacy API Keys** → скопіюй `anon` і `service_role`

---

## 3. Запустити локально

```bash
npm run dev
```

Відкрий http://localhost:3000

**Логін адміна:**
- Email: `yevhen.maslov@clust.team`
- Password: `3CNPqldh212jKWq8`

---

## 4. Встановити і налаштувати Claude Code

Claude Code — це AI-асистент у терміналі, який пише і редагує код за твоїми інструкціями.

### Встановлення

```bash
npm install -g @anthropic-ai/claude-code
```

### Авторизація

```bash
claude
```

Перший запуск відкриє браузер → увійди через свій Anthropic акаунт (або створи на https://claude.ai).

### Використання в проєкті

```bash
cd cir
claude
```

Далі пиши завдання звичайною мовою, наприклад:

```
Додай сторінку /dashboard/reports з таблицею останніх замовлень
```

Claude сам читає файли, пише код, редагує компоненти. Коли задоволений результатом — пушиш як звичайно.

### Корисні команди всередині Claude Code

| Команда | Що робить |
|---------|-----------|
| `/help` | список команд |
| `/clear` | очистити контекст розмови |
| Ctrl+C | перервати поточну дію |
| Ctrl+D | вийти |

---

## 5. Пушити зміни

Стандартний git workflow:

```bash
git add .
git commit -m "feat: опис змін"
git push origin main
```

> Або через Claude Code — просто скажи йому "закомміть і запуш зміни".

---

## 6. Як працює деплой

```
git push → GitHub Actions → Vercel
```

### Гілки

| Гілка | Що відбувається |
|-------|----------------|
| `main` | деплой на **production** (https://cir.vercel.app) |
| `staging` | деплой на **preview** URL |
| будь-яка PR | preview деплой + запуск тестів |

### CI/CD pipeline (`.github/workflows/ci.yml`)

При пуші в `main` або `staging` автоматично запускається:

1. **Security scan** — Snyk на вразливості + ESLint security rules
2. **TypeScript check** — перевірка типів
3. **Playwright тести** — e2e тести (web + mobile + security)
4. **Deploy** — лише якщо всі попередні кроки зелені

> Якщо тести не пройшли — деплой не відбудеться. Перевір вкладку **Actions** на GitHub.

### Де дивитись статус деплою

- GitHub Actions: https://github.com/opavlenko-clust/cir/actions
- Vercel деплої: https://vercel.com/opavlenko-4802s-projects/cir/deployments

---

## 7. Feature Agent (AI-розробка прямо з браузера)

У адмін-панелі є **Feature Agent** — вбудований Claude Code у браузері. Він може:
- писати код і пушити в репо
- запускати деплой
- виконувати міграції в Supabase

Відкрий: https://cir.vercel.app/admin → Feature Agent

---

## 8. Структура проєкту

```
app/
  admin/         — адмін-панель (Feature Agent, управління)
  api/           — API routes
  auth/          — логін / реєстрація
  dashboard/     — основний інтерфейс користувача
  sign-in/
  sign-up/
lib/             — утиліти, supabase client, хелпери
supabase/        — міграції БД (config.toml)
scripts/         — допоміжні скрипти
tests/           — Playwright тести
.github/
  workflows/
    ci.yml       — CI/CD pipeline
```

---

## Контакти

Питання — пиши @opavlenko в Slack або o.pavlenko@clust.team
