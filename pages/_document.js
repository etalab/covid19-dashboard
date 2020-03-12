import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {...initialProps}
  }

  render() {
    return (
      <html lang='fr'>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>

        <style jsx global>{`
            * {
              box-sizing: border-box;
            }

            html,
            body {
              height: 100%;
              position: relative;
            }

            @font-face {
              font-family: "Source Sans Pro";
              src: url("/public/fonts/Source Sans Pro/SourceSansPro-Regular.otf");
              font-weight: 400;
            }

            @font-face {
              font-family: "Source Sans Pro";
              src: url("/public/fonts/Source Sans Pro/SourceSansPro-Bold.otf");
              font-weight: 800;
            }

            @font-face {
              font-family: "Source Sans Pro";
              src: url("/public/fonts/Source Sans Pro/SourceSansPro-It.otf");
              font-style: italic;
            }

            @font-face {
              font-family: "Evolventa";
              src: url("/public/fonts/Evolventa/Evolventa-Regular.ttf");
              font-weight: 400;
            }

            @font-face {
              font-family: "Evolventa";
              src: url("/public/fonts/Evolventa/Evolventa-Bold.ttf");
              font-weight: 800;
            }

            body {
              padding: 0;
              margin: 0;
              overflow: auto;
              font-family: "Source Sans Pro", Arial, sans-serif;
            }
          `}</style>
      </html>
    )
  }
}

export default MyDocument
