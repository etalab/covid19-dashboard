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
    title: null,
    description: null
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
          main {
            flex: 1;
          }

          div {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #fff;
          }
        `}</style>
      </div>
    )
  }
}

export default Layout
