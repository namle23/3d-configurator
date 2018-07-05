import React, { Component } from 'react'
import { connect } from 'react-redux'

import AngleControl from '../AngleControl/AngleControl'
import Spinner from '../../../components/Spinner/Spinner'

import style from './Footer.css'

class Footer extends Component {
  render() {
    let spinner = this.props.loading ? (
      <Spinner />
    ) : (
      <p>{this.props.obj_prices}</p>
    )

    return (
      <div className="footer-wrap">
        <div className="spinner">{spinner}</div>

        <AngleControl className="angle-control" />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    obj_prices: state.conf.obj_prices,
    price: state.conf.obj_obj_insts_price
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
