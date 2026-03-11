FROM node:20-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install frontend dependencies first for better layer caching
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source
COPY frontend ./frontend

# Build Next.js app
RUN cd frontend && npm run build

# Ensure runtime upload directory exists and is writable by non-root user.
RUN mkdir -p /app/frontend/public/uploads && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["sh", "-c", "cd frontend && npm start"]
