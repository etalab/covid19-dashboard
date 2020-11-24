import React from 'react'
import Head from 'next/head'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Tableau de bord COVID-19'
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Suivi de l’épidémie de COVID-19 en France'

const Meta = () => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='x-ua-compatible' content='ie=edge' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <title>{SITE_NAME} {SITE_DESCRIPTION}</title>

      <link rel='icon' href='/images/favicon.ico' />
      <link rel='stylesheet' href='/styles/mapbox-gl.css' />

      {/* Search Engine */}
      <meta name='description' content={SITE_DESCRIPTION} />
      <meta name='image' content={`${SITE_URL}/images/previews/default.png`} />

      {/* Schema.org for Google */}
      <meta itemProp='name' content={SITE_NAME} />
      <meta itemProp='description' content={SITE_DESCRIPTION} />
      <meta itemProp='image' content={`${SITE_URL}/images/previews/default.png`} />

      {/* Twitter */}
      <meta name='twitter:title' content={SITE_NAME} />
      <meta name='twitter:description' content={SITE_DESCRIPTION} />
      <meta name='twitter:image:src' content={`${SITE_URL}/images/previews/default.png`} />

      {/* Open Graph general (Facebook, Pinterest & Google+) */}
      <meta name='og:title' content={SITE_NAME} />
      <meta name='og:description' content={SITE_DESCRIPTION} />
      <meta name='og:image' content={`${SITE_URL}/images/previews/facebook.png`} />
      <meta name='og:url' content={SITE_URL} />
      <meta name='og:site_name' content={SITE_NAME} />
      <meta name='og:locale' content='fr_FR' />
      <meta name='og:type' content='website' />
    </Head>
  )
}

export default Meta
