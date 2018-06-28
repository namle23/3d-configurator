import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import DisplayModel from './DisplayModel/DisplayModel'

class Modal extends Component {
  render() {
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li>
                <Link
                  to={{
                    pathname: '/display'
                  }}
                >
                  New Post
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <Route path="/display" exact component={DisplayModel} />
      </div>
    )
  }
}

export default Modal
