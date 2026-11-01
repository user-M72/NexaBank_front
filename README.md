# 🏦 NexaBank Frontend

![Vue](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Ant Design Vue](https://img.shields.io/badge/Ant_Design_Vue-0170FE?style=flat-square&logo=antdesign&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)

Веб-интерфейс для банковского приложения **NexaBank**. Работает поверх REST API,
написанного на Java и Spring Boot: [NexaBank (backend)](https://github.com/user-M72/NexaBank).

🌐 **Live demo:** [nexabank-front.muzaffarazamov007.workers.dev](https://nexabank-front.muzaffarazamov007.workers.dev)

> Бэкенд работает на бесплатном хостинге: первый запрос (вход или регистрация)
> может занять до минуты, пока сервер «просыпается».

![Screenshot](docs/screenshot.png)

---

## 🔑 Демо-доступ

Войди под готовым аккаунтом или зарегистрируй свой на странице регистрации.

| Роль | Username | Password |
|---|---|---|
| USER | `demo_user` | `DemoUser2026` |

> Это публичная демо-база без реальных данных.

---

## ✨ Возможности

- 🔐 Регистрация и вход, авторизация через JWT
- 👤 Профиль пользователя
- 🛡 Защищённые страницы: переход только после входа
- ⚠️ Валидация форм и показ ошибок сервера
- ⏳ Индикатор загрузки при запросах
- 📱 Адаптивная вёрстка
- 🌍 Язык интерфейса: узбекский

---

## 🛠 Стек

| Категория | Технологии |
|---|---|
| Фреймворк | Vue 3 (Composition API, `<script setup>`) |
| Сборка | Vite |
| UI-компоненты | Ant Design Vue |
| Стили | Tailwind CSS |
| Маршрутизация | Vue Router |
| Состояние | store для авторизации (`stores/auth`) |
| Качество кода | ESLint |
| Хостинг | Cloudflare Workers |

---

## 🚀 Запуск локально

### Требования

- Node.js 18+
- Запущенный бэкенд (локально или демо на Render)

### Шаги

```bash
git clone https://github.com/user-M72/NexaBank_front
cd NexaBank_front
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

### Сборка

```bash
npm run build
```

### Адрес бэкенда

Адрес API задаётся в [УКАЖИ ФАЙЛ ИЛИ ПЕРЕМЕННУЮ, например `.env` → `VITE_API_URL`].
Для демо-бэкенда:

```
https://nexabank-26mc.onrender.com
```

---

## ☁️ Деплой

Фронтенд развёрнут на Cloudflare Workers. Конфигурация лежит в `wrangler.jsonc`,
серверная часть Worker находится в папке `worker/`.

```bash
npm run build
npx wrangler deploy
```

---

## 🏗 Структура проекта

```
NexaBank_front/
├── src/
│   ├── views/        # страницы (вход, регистрация, профиль)
│   ├── stores/       # состояние авторизации
│   └── router/       # маршруты
├── worker/           # Cloudflare Worker
├── index.html
├── vite.config.js
├── tailwind.config.js
└── wrangler.jsonc
```

---

## 🔗 Связанные проекты

- [NexaBank](https://github.com/user-M72/NexaBank): REST API на Java 21 и Spring Boot
  (счета, карты, переводы, JWT). Swagger:
  [nexabank-26mc.onrender.com](https://nexabank-26mc.onrender.com/swagger-ui/index.html)

---

## 🗺 Планы

- [ ] Страницы счетов, карт и истории операций
- [ ] Перевод между картами из интерфейса
- [ ] Автообновление токена (refresh)
- [ ] Английская версия интерфейса

---

## 👤 Автор

**Muzaffar Azamov**
GitHub: [@user-M72](https://github.com/user-M72)
Telegram: [@muzaffar_o_O](https://t.me/muzaffar_o_O)
Email: muzaffarazamov007@gmail.com
