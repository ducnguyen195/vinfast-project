import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#003366" />
        <link rel="icon" type="image/png" href="/images/logo/favicon.png" />
        <link rel="apple-touch-icon" href="/images/logo/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}