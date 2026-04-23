# CIR — Developer Guide

| Сервіс | Посилання |
|--------|-----------|
| Prod app | https://cir.vercel.app |
| GitHub repo | https://github.com/opavlenko-clust/cir |
| Supabase | https://supabase.com/dashboard/project/ncqqoahcejisfaarhljv |
| Vercel | https://vercel.com/opavlenko-4802s-projects/cir |

---

## 1. Налаштувати GitHub

1. Створи акаунт на https://github.com якщо немає
2. Попроси o.pavlenko@clust.team додати тебе як collaborator до репо
3. Встанови Git: https://git-scm.com/downloads
4. Склонуй проєкт:

```bash
git clone https://github.com/opavlenko-clust/cir.git
cd cir
npm install
npm run dev
```

Відкрий http://localhost:3000

**Логін:**
- Email: `yevhen.maslov@clust.team`
- Password: `3CNPqldh212jKWq8`

---

## 2. Встановити Claude Code

Claude Code — AI-асистент у терміналі. Пишеш задачу словами, він сам редагує файли і може одразу закомітити і запушити.

```bash
npm install -g @anthropic-ai/claude-code
```

Запуск (перший раз відкриє браузер для авторизації):

```bash
cd cir
claude
```

Приклади що можна написати всередині:

```
Додай сторінку /dashboard/reports з таблицею замовлень
```

```
Закомміть і запуш зміни
```

---

## 3. Як працює деплой

```
git push origin main → GitHub Actions → Vercel production
```

- `main` → **production** https://cir.vercel.app
- `staging` → preview URL
- будь-яка PR → preview + тести

GitHub Actions автоматично запускає перевірки (типи, тести) і лише після них деплоїть. Статус: https://github.com/opavlenko-clust/cir/actions

> Токени Vercel вже прописані в секретах репо — окремий акаунт Vercel не потрібен.

---

## 4. Feature Agent

В адмін-панелі є вбудований Claude Code — він сам пише код, пушить і деплоїть прямо з браузера.

https://cir.vercel.app/admin → Feature Agent
