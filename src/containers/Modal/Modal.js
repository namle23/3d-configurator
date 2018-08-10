import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import DisplayModel from '../DisplayModel/DisplayModel'

import './Modal.css'

class Modal extends Component {
  state = {
    showModal: true
  }

  toggleShowModal = () => {
    const doesShow = this.state.showModal
    this.setState({ showModal: !doesShow })
  }

  componentDidMount() {
    setTimeout(() => {
      document.getElementById('auto-click').click()
    }, 50)
  }

  render() {
    let modal = null

    if (this.state.showModal) {
      modal = (
        <div name="modal">
          <div className="modal-mask">
            <div className="modal-wrapper">
              <div className="modal-container">
                <div className="modal-body">
                  <div name="body">
                    <h4>Please wait...</h4>
                  </div>
                </div>

                <Link
                  to="/display"
                  className="btn btn-default"
                  onClick={this.toggleShowModal}
                  id="auto-click"
                />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        {/* <Redirect from="/" to="/display" /> */}
        {modal}
        <Route path="/display" exact component={DisplayModel} />
      </div>
    )
  }
}

export default Modal
