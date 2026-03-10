import { ensureSchema, pool } from '../src/server/db';
import { absoluteUrl } from '../src/utils/seo';

function toUrlEntry(path, changefreq = 'weekly', priority = '0.7') {
  return `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function getServerSideProps({ res }) {
  const urls = [
    toUrlEntry('/', 'daily', '1.0'),
    toUrlEntry('/products', 'daily', '0.9'),
    toUrlEntry('/posts', 'daily', '0.8'),
    toUrlEntry('/price-table', 'weekly', '0.7'),
    toUrlEntry('/contact', 'monthly', '0.6'),
  ];

  try {
    await ensureSchema();

    const [productsResult, postsResult] = await Promise.all([
      pool.query("SELECT slug FROM products WHERE slug IS NOT NULL AND slug <> ''"),
      pool.query("SELECT slug FROM posts WHERE slug IS NOT NULL AND slug <> ''"),
    ]);

    productsResult.rows.forEach((row) => {
      urls.push(toUrlEntry(`/products/${row.slug}`, 'weekly', '0.8'));
    });

    postsResult.rows.forEach((row) => {
      urls.push(toUrlEntry(`/posts/${row.slug}`, 'weekly', '0.7'));
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
