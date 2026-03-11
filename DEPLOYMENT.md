# Deployment

Current deployment target is a single Next.js app service plus PostgreSQL.

## Docker deployment

Set production env vars before running compose (recommended via shell export, CI secret, or `.env` file in project root):

```bash
export POSTGRES_USER=vinfast_user
export POSTGRES_PASSWORD=<strong-password>
export POSTGRES_DB=vinfast
export NEXT_PUBLIC_SITE_URL=https://your-domain.com
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=<strong-password>
export ADMIN_TOKEN=<random-long-token>
```

```bash
docker compose up -d --build
```

## Notes

- Public entry point: port `3000`
- API served by Next.js routes under `/api/*`
- Uploaded files are served from `frontend/public/uploads/*`
- Uploaded files are persisted in Docker volume `uploads_data`
