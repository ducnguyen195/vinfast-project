import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'postgresql://localhost:5432/postgres';

export const pool = new Pool({
  connectionString,
});

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      description TEXT,
      price DOUBLE PRECISION NOT NULL DEFAULT 0,
      image_url VARCHAR(500),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      product VARCHAR(255) NOT NULL,
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      telegram_sent VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Backward compatibility for old databases created before these columns existed.
  await pool.query(`ALTER TABLE customer_requests ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';`);
  await pool.query(`ALTER TABLE customer_requests ADD COLUMN IF NOT EXISTS telegram_sent VARCHAR(50) DEFAULT 'pending';`);
  await pool.query(`ALTER TABLE customer_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS media_uploads (
      id BIGSERIAL PRIMARY KEY,
      file_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(255) NOT NULL DEFAULT 'application/octet-stream',
      purpose VARCHAR(50),
      entity_type VARCHAR(50),
      entity_key VARCHAR(255),
      content BYTEA NOT NULL,
      byte_size INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS purpose VARCHAR(50);`);
  await pool.query(`ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50);`);
  await pool.query(`ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS entity_key VARCHAR(255);`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      image_url VARCHAR(500),
      content TEXT,
      author VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_colors (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      hex_code VARCHAR(20),
      image_url VARCHAR(500),
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  schemaReady = true;
}
