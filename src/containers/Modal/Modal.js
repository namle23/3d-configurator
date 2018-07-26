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
                  <div name="body">
                    <h4>Click to start</h4>
                  </div>
                </div>

                <div className="modal-footer">
                  <div name="footer">
                    <button className="btn btn-default">
                      <Link
                        to="/display"
                        className="btn btn-default"
                        onClick={this.toggleShowModal}
                      >
                        OK
                      </Link>
                    </button>
                  </div>
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
