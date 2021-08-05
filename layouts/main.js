import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Meta from '../components/meta'
import Modal from '../components/modal'

class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  static propTypes = {
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  componentDidMount() {
    console.log('mounted')
    this.setState({showModal: true})
  }

  render() {
    const {children} = this.props

    return (
      <div>
        <Meta />
        <main>
          <div id="modal-root"></div>
          <div>
            <Modal
              onClose={() => this.setState({showModal: false})}
              show={this.state.showModal}
            >
              <p>
                Le tableau de bord que vous consultez est le fruit d'une collaboration entre les membres du collectif
                OpenCovid et le département Etalab de la Direction Interministérielle du Numérique.
                Son objectif est d'informer les citoyens sur l'évolution de l'épidémie de la Covid-19 en France.
              </p>

              <p>
                Afin de toucher le maximum de citoyen, le tableau de bord a été propulsé en avril 2021
                sur <a href="https://gouvernement.fr">gouvernement.fr</a> et a connu des évolutions successives avec l'introduction de nouveaux indicateurs.
                Afin de s'adapter aux évolutions des indicateurs et de faciliter la navigation des utilisateurs,
                une refonte graphique et technique du tableau de bord officiel du gouvernement a été réalisé en mai 2021.
              </p>

              <p>
                <strong>⚠️ Par conséquent, l'outil que vous consultez n'est désormais plus maintenu.
                Les valeurs des indicateurs exposées sur cet outil peuvent être erronées,
                puisque certaines méthodes de calcul ont évoluée.</strong>
              </p>
              <p>
                Si vous vous souhaitez consulter les indicateurs à jour,
                nous vous invitons à consulter le <a href="https://www.gouvernement.fr/info-coronavirus/carte-et-donnees">tableau de bord officiel du gouvernement.</a>
              </p>
            </Modal>
          </div>
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
