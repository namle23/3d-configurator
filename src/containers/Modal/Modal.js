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

  render() {
    let modal = null

    if (this.state.showModal) {
      modal = (
        <div name="modal">
          <div className="modal-mask">
            <div className="modal-wrapper">
              <div className="modal-container">
                <div className="modal-body">
                  <slot name="body">
                    <h4>Start browse products</h4>
                  </slot>
                </div>

                <div className="modal-footer">
                  <slot name="footer">
                    <button
                      className="btn btn-default"
                      onClick={this.toggleShowModal}
                    >
                      <Link to="/display">OK</Link>
                    </button>
                  </slot>
                </div>
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
