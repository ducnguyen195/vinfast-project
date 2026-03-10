FROM node:20-alpine

WORKDIR /app

# Install frontend dependencies first for better layer caching
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source
COPY frontend ./frontend

# Build Next.js app
RUN cd frontend && npm run build

EXPOSE 3000

CMD ["sh", "-c", "cd frontend && npm start"]
