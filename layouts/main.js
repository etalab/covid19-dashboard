import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../components/meta'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {children} = this.props

    return (
      <div>
        <Meta />
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
