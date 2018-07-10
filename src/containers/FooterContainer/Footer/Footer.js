import React, { Component } from 'react'
import { connect } from 'react-redux'

import AngleControl from '../AngleControl/AngleControl'
import Spinner from '../../../components/Spinner/Spinner'

import './Footer.css'

class Footer extends Component {
  render() {
    let spinner = this.props.loading ? (
      <Spinner />
    ) : (
      <div>
        <div className="name">
          <h3>{this.props.obj_names}</h3>
        </div>
        <div className="price">
          <h3>{this.props.price_total}</h3>
        </div>
      </div>
    )

    return (
      <div className="footer-wrap">
        <div className="spinner">{spinner}</div>

        <AngleControl className="angle-control" camera={this.props.camera} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    obj_names: state.conf.obj_names,

    obj_obj_insts_price: state.conf.obj_obj_insts_price,
    price_total: state.conf.obj_obj_insts_price_total
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
