import { absoluteUrl } from '../src/utils/seo';

export async function getServerSideProps({ res }) {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin-login',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function RobotsTxt() {
  return null;
}
