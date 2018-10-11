import React, { Component } from 'react'
import { connect } from 'react-redux'

import AngleControl from '../AngleControl/AngleControl'

import './Footer.css'

class Footer extends Component {
  render() {
    let code = this.props.objects[this.props.index].objects
      .map(x =>
        // eslint-disable-next-line
        x.instances.map(y => {
          if (y.default === 1) return y.code
        })
      )
      .reduce((total, num) => total + num)
      .replace(/,/g, '')

    let price = (
      <div>
        <h3 id="name">{this.props.obj_names[this.props.index]}</h3>
        <p id="code">{code}</p>
        <h3 id="price">{this.props.price_total[this.props.index]}€</h3>
      </div>
    )

    return (
      <div className="footer-wrap">
        <div>{price}</div>

        <AngleControl
          className="angle-control"
          camera={this.props.camera}
          update={this.props.update}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    objects: state.conf.objects,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,
    code: state.conf.obj_obj_insts_code,
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
