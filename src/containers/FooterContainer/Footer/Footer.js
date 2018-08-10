import React, { Component } from 'react'
import { connect } from 'react-redux'

import AngleControl from '../AngleControl/AngleControl'

import './Footer.css'

class Footer extends Component {
  render() {
    let price = (
      <div>
        <h3 id="price">{this.props.price_total[0]}€</h3>
        <h3 id="name">{this.props.obj_names[0]}</h3>
      </div>
    )

    return (
      <div className="footer-wrap">
        <div>{price}</div>
        <AngleControl className="angle-control" camera={this.props.camera} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    obj_names: state.conf.obj_names,
    price_total: state.conf.obj_obj_insts_price_total,

    loading: state.conf.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
