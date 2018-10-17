import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Modal from './containers/Modal/Modal'

import * as configuratorAction from './store/actions/index'

class App extends Component {
  componentDidMount() {
    this.props.onInitConfigurator()
  }

  render() {
    let style = {
      backgroundImage: 'url(http://localhost:3000//assets/img/lake.jpg)'
    }

    return (
      <BrowserRouter>
        <div className="App" style={style}>
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
