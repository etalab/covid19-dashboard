import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

const SITE_NAME = 'Tableau de bord de suivi de l’épidémie de coronavirus en France'

const Meta = ({title, description}) => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='x-ua-compatible' content='ie=edge' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      {title ? <title>{title} | {SITE_NAME}</title> : <title>{SITE_NAME}</title>}

      <link rel='icon' href='/images/favicon.ico' />

      {/* Search Engine */}
      <meta name='description' content={description} />
      <meta name='image' content='https://veille-coronavirus.fr/images/previews/default.png' />

      {/* Schema.org for Google */}
      <meta itemProp='name' content={title} />
      <meta itemProp='description' content={description} />
      <meta itemProp='image' content='https://veille-coronavirus.fr/images/previews/default.png' />


      {/* Twitter */}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image:src' content='https://veille-coronavirus.fr/images/previews/default.png' />

      {/* Open Graph general (Facebook, Pinterest & Google+) */}
      <meta name='og:title' content={title} />
      <meta name='og:description' content={description} />
      <meta name='og:image' content='https://veille-coronavirus.fr/images/previews/facebook.png' />
      <meta name='og:url' content='https://veille-coronavirus.fr/' />
      <meta name='og:site_name' content={title} />
      <meta name='og:locale' content='fr_FR' />
      <meta name='og:type' content='website' />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

Meta.defaultProps = {
  title: 'veille-coronavirus.fr',
  description: 'L‘information sur la progression de l’épidémie de coronavirus en France'
}

export default Meta
