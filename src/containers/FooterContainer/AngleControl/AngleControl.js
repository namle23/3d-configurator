import React, { Component } from 'react'

import style from './AngleControl.css'

class AngleControl extends Component {
  angleTop(camera) {
    camera.position.set(0, 90, 90)
  }

  angleRight(camera) {
    camera.position.set(0, 0, 90)
  }

  angleBottom(camera) {
    camera.position.set(0, -90, 90)
  }

  angleLeft(camera) {
    camera.position.set(0, 0, -90)
  }

  render() {
    return (
      <div className={style.circle}>
        <button
          className="btn btn-default btn-circle btn-lg"
          onClick={() => this.angleTop(this.props.camera)}
        >
          Top
        </button>
        <button
          className="btn btn-default btn-circle btn-lg"
          onClick={() => this.angleRight(this.props.camera)}
        >
          Right
        </button>
        <button className="btn btn-default btn-circle btn-lg">Rotation</button>
        <button
          className="btn btn-default btn-circle btn-lg"
          onClick={() => this.angleBottom(this.props.camera)}
        >
          Bottom
        </button>
        <button
          className="btn btn-default btn-circle btn-lg"
          onClick={() => this.angleLeft(this.props.camera)}
        >
          Left
        </button>
      </div>
    )
  }
}

export default AngleControl
