# Chat-App


Real-time чат на основе Next.js и Pusher. Пользователи могут обмениваться сообщениями в режиме реального времени, видеть список онлайн пользователей и историю переписки. Все сообщения сохраняются в облачной базе данных Turso(SQLite).

## [Ссылка на деплой](https://chat-application-react-pi.vercel.app/)

## Стек

Frontend: React, Next.js, Tailwind CSS

Backend: Next.js API Routes

База данных: Prisma ORM + Turso (облачный SQLite)

## Запуск локально

1. Склонировать репозиторий и установить зависимости
```
npm install
```

2. Создать файл .env на основе .env.example и заполнить своими ключами

3. Создай базу данных:
```
npx prisma db push
```

4. Запусти проект:
```
npm run dev
```

### Code Climate Badge
[![Maintainability](https://qlty.sh/gh/Herbaa/projects/Chat-application-react/maintainability.svg)](https://qlty.sh/gh/Herbaa/projects/Chat-application-react)
