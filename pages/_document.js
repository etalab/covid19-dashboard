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

            body {
              padding: 0;
              margin: 0;
              overflow: auto;
            }
          `}</style>
      </html>
    )
  }
}

export default MyDocument
