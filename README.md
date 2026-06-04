# GwauCread

Современный каталог GwauCread для Vercel: товары, заявки, админ-панель, загрузка картинок и сохранение изменений в GitHub.

## Переменные окружения Vercel

Создайте в Vercel Project Settings -> Environment Variables:

- `ADMIN_PASSWORD` - пароль от админки, значение: `gwau062026`
- `GITHUB_TOKEN` - GitHub Personal Access Token с правом записи в репозиторий
- `GITHUB_OWNER` - `SupremeGoogle`
- `GITHUB_REPO` - `GwauCread`
- `GITHUB_BRANCH` - `main`
- `GOOGLE_SCRIPT_URL` - URL опубликованного Google Apps Script Web App

Админка находится по адресу `/admin`.

## Google Sheets

1. Создайте Google Sheet.
2. Откройте Extensions -> Apps Script.
3. Вставьте код из `scripts/google-apps-script.js`.
4. Deploy -> New deployment -> Web app.
5. Execute as: Me, Who has access: Anyone.
6. Скопируйте Web App URL в `GOOGLE_SCRIPT_URL`.

## Локальный запуск

```bash
npm install
npm run dev
```
