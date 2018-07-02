import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import DisplayModel from './DisplayModel/DisplayModel'

class Modal extends Component {
  render() {
    return (
      <div>
        <header>
          <nav>
            <li>
              <Link to="/display">Start</Link>
            </li>
          </nav>
        </header>

        <Route path="/display" exact component={DisplayModel} />
        {/* <Redirect from="/" to="/display" /> */}
      </div>
    )
  }
}

export default Modal
