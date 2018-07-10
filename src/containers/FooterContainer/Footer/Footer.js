import React, { Component } from 'react'
import { connect } from 'react-redux'

import AngleControl from '../AngleControl/AngleControl'
import Spinner from '../../../components/Spinner/Spinner'

import './Footer.css'

class Footer extends Component {
  render() {
    let spinner = this.props.loading ? <Spinner /> : <div />

    return (
      <div className="footer-wrap">
        <div className="spinner">{spinner}</div>
        {this.props.arrayIndex}
        <AngleControl className="angle-control" camera={this.props.camera} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    obj_names: state.conf.obj_names
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
