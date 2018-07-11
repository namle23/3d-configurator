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
        <h3 id="price">{this.props.price_total[0]}€</h3>
        <h3 id="name">{this.props.obj_names[0]}</h3>
      </div>
    )

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
    obj_names: state.conf.obj_names,
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
