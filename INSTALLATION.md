# Installation

## Requirements

- Docker and Docker Compose
- Optional local dev: Node.js 18+

## Run with Docker

```bash
docker compose up -d --build
```

Open `http://localhost:3000`.

## Local Dev (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Set env values in `frontend/.env` when needed.
