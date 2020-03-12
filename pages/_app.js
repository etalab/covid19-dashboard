import React from 'react'
import PropTypes from 'prop-types'

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

        @font-face {
          font-family: "Source Sans Pro";
          src: url("../public/fonts/Source Sans Pro/SourceSansPro-Regular.otf");
          font-weight: 400;
        }

        @font-face {
          font-family: "Source Sans Pro";
          src: url("../public/fonts/Source Sans Pro/SourceSansPro-Bold.otf");
          font-weight: 800;
        }

        @font-face {
          font-family: "Source Sans Pro";
          src: url("../public/fonts/Source Sans Pro/SourceSansPro-It.otf");
          font-style: italic;
        }

        @font-face {
          font-family: "Evolventa";
          src: url("../public/fonts/Evolventa/Evolventa-Regular.ttf");
          font-weight: 400;
        }

        @font-face {
          font-family: "Evolventa";
          src: url("../public/fonts/Evolventa/Evolventa-Bold.ttf");
          font-weight: 800;
        }

        body {
          padding: 0;
          margin: 0;
          overflow: auto;
          font-family: "Source Sans Pro", Arial, sans-serif;
        }
        `}</style>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.node.isRequired,
  pageProps: PropTypes.object.isRequired
}
