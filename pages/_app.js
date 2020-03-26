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

        html,
        body {
          height: 100%;
          position: relative;
        }

        a {
          color: ${colors.darkBlue}
        }

        @font-face {
          font-family: "Marianne";
          src: url('/fonts/Marianne-Regular.woff2')
        .extra-class {
          font-size: .5em !important;
          pointer-events: auto !important;
        }

        @font-face {
          font-family: "Source Sans Pro";
          src: url("/fonts/Source Sans Pro/SourceSansPro-Regular.otf");
          font-weight: 400;
        }

        @font-face {
          font-family: "Source Sans Pro";
          src: url("/fonts/Source Sans Pro/SourceSansPro-Bold.otf");
          font-weight: 800;
        }

        @font-face {
          font-family: "Source Sans Pro";
          src: url("/fonts/Source Sans Pro/SourceSansPro-It.otf");
          font-style: italic;
        }

        body {
          padding: 0;
          margin: 0;
          overflow: auto;
          font-family: "Marianne", Arial;
        }
      `}</style>
    </>
  )
}
