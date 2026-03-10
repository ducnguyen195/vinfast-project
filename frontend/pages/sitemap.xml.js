import { ensureSchema, pool } from '../src/server/db';
import { absoluteUrl } from '../src/utils/seo';

function toIsoDate(value) {
  if (!value) return new Date().toISOString();
  try {
    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function toUrlEntry(path, changefreq = 'weekly', priority = '0.7', lastmod) {
  return `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n    <lastmod>${toIsoDate(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function getServerSideProps({ res }) {
  const now = new Date().toISOString();
  const urls = [
    toUrlEntry('/', 'daily', '1.0', now),
    toUrlEntry('/products', 'daily', '0.9', now),
    toUrlEntry('/posts', 'daily', '0.8', now),
    toUrlEntry('/price-table', 'weekly', '0.7', now),
    toUrlEntry('/contact', 'monthly', '0.6', now),
  ];

  try {
    await ensureSchema();

    const [productsResult, postsResult] = await Promise.all([
      pool.query("SELECT slug, created_at FROM products WHERE slug IS NOT NULL AND slug <> ''"),
      pool.query("SELECT slug, COALESCE(updated_at, created_at) AS lastmod FROM posts WHERE slug IS NOT NULL AND slug <> ''"),
    ]);

    productsResult.rows.forEach((row) => {
      urls.push(toUrlEntry(`/products/${row.slug}`, 'weekly', '0.8', row.created_at));
    });

    postsResult.rows.forEach((row) => {
      urls.push(toUrlEntry(`/posts/${row.slug}`, 'weekly', '0.7', row.lastmod));
    });
  } catch (error) {
    // Keep core URLs even if DB is temporarily unavailable.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function SitemapXml() {
  return null;
}
