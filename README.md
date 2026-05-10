# Система управления товарами (Тестовое задание)

Тестовое задание: CRUD для управления товарами.

## Стек технологий
* **Backend:** PHP 8.5, Laravel 13
* **Frontend:** Vue 3 (Composition API), TypeScript, Tailwind CSS
* **State/Routing:** Inertia.js
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose

## Инструкция по запуску

### 1. Предварительные требования
 
Перед началом убедитесь, что у вас установлены:
 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) v22 или выше
- [NPM](https://www.npmjs.com/)
---
 
### 2. Настройка окружения
 
Склонируйте репозиторий, перейдите в корень проекта и создайте файл конфигурации:
 
```bash
cp .env.example .env
```
 
> **Важно:** убедитесь, что в `.env` параметр `DB_HOST=db`, так как база данных работает внутри Docker-сети.
 
---
 
### 3. Запуск Backend (Docker)
 
Поднимите контейнеры (PHP-FPM, PostgreSQL, Nginx):
 
```bash
docker-compose up -d
```
 
Установите зависимости и подготовьте базу данных:
 
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh --seed
```
 
---
 
### 4. Запуск Frontend (локально)
  
```bash
npm install
npm run dev
```
 
---

## Доступ к приложению
 
| Параметр | Значение |
|---------|---------|
| **URL** | http://localhost |
| **Email** | `test@example.com` |
| **Пароль** | `password` |