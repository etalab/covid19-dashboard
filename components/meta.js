import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

const SITE_NAME = 'Suivi de l’épidémie de nouveau coronavirus'

const Meta = ({title, description}) => {
  return (
    <Head>
      {title ? <title>{title} | {SITE_NAME}</title> : <title>{SITE_NAME}</title>}

      {/* Search Engine */}
      <meta name='description' content={description} />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

Meta.defaultProps = {
  title: '',
  description: ''
}

export default Meta
