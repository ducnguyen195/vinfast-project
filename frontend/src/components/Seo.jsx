import Head from 'next/head';

export default function Seo({
  title,
  description,
  url,
  image,
  type = 'website',
  locale = 'vi_VN',
  noindex = false,
}) {
  return (
    <Head>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      {url ? <meta property="og:url" content={url} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      {type ? <meta property="og:type" content={type} /> : null}
      {locale ? <meta property="og:locale" content={locale} /> : null}
      <meta property="og:site_name" content="VinFast Ha Thanh" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      {url ? <link rel="canonical" href={url} /> : null}
    </Head>
  );
}
