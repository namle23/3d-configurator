import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Modal from './containers/Modal'

import * as configuratorAction from './store/actions/index'

class App extends Component {
  componentDidMount() {
    this.props.onInitConfigurator()
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Modal />
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onInitConfigurator: () => dispatch(configuratorAction.initConfigurator())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
