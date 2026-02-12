# ZAVOD NEWS - Noel Gomile

## Setup
- `git clone https://github.com/ngomile/zavod_news.git`
- `python -m venv venv`
- `python -m pip install -r requirements.txt`
- `python -m manage.py runserver`
- Open browser and navigate to: `http://localhost:8000`.

## Logging In
- Database used, `db.sqlite3`, it is together with the repository to test app functionality easier.
- Database has two users below with associated password:
    - admin: admin123
    - tester: tester123
- In case of no database, database can be seeded with command: `python manage.py seeddata`.

### Deployment and development setup:
- Configured Vite to build the React app to a folder that Django can serve to simplify deployment for testing and viewing.
- The React application is being served from the `news_app` Django application and has been compiled and built using `npm run build`. It builds its assets into `news_app/templates/news_app`, and that's what gets published when you run `python manage.py runserver`.
- For development, the React app can be served independently on port `3000` by doing the following:
    - Navigate to `news_app`
    - Run `npm install`
    - Run `npm run dev`
