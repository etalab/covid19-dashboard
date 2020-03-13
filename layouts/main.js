import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../components/meta'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    description: PropTypes.string
  }

  static defaultProps = {
    children: null,
    title: 'veille-coronavirus.fr',
    description: 'Chiffres-clés sur la progression de l’épidémie de coronavirus en France'
  }

  render() {
    const {title, description, children} = this.props

    return (
      <div>
        <Meta title={title} description={description} />
        <main>
          {children}
        </main>
        <style jsx>{`
          div {
            display: flex;
            flex-direction: column;
            background-color: #fff;
          }

          main {
            flex: 1;
          }
        `}</style>
      </div>
    )
  }
}

export default Layout
