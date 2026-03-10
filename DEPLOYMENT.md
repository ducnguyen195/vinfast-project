# Deployment

Current deployment target is a single Next.js app service plus PostgreSQL.

## Docker deployment

```bash
docker compose up -d --build
```

## Notes

- Public entry point: port `3000`
- API served by Next.js routes under `/api/*`
- Uploaded files are served from `frontend/public/uploads/*`
