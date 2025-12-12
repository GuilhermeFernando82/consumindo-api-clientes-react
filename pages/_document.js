import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* --- OPEN GRAPH TAGS --- */}
        <meta property="og:title" content="Sistema de Clientes" />
        <meta property="og:description" content="Gerenciamento de clientes." />
        <meta
          property="og:image"
          content="https://cdls.org.br/wp-content/uploads/cdlce_base/2020/07/iStock-1223604108.jpg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Para Facebook reconhecer */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://SEU-SITE-AQUI.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
