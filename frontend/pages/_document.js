import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#003366" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}