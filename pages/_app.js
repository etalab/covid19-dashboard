import React from 'react'

import colors from '../styles/colors'

export default function MyApp({Component, pageProps}) {
  return (
    <>
      <Component {...pageProps} />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        a {
          color: ${colors.darkBlue};
        }

        @font-face {
          font-family: "Marianne";
          src: url(’/fonts/Marianne-Regular.woff2’);
        }

        body {
          padding: 0;
          margin: 0;
          font-family: "Marianne", Arial;
        }
      `}</style>
    </>
  )
}
