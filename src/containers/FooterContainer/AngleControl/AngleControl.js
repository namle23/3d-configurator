import React, { Component } from 'react'

import './AngleControl.css'

class AngleControl extends Component {
  angleTop(camera) {
    try {
      camera.position.set(0, 90, 90)
    } catch (error) {
      console.log(error)
    }
  }

  angleRight(camera) {
    try {
      camera.position.set(0, 0, 90)
    } catch (error) {
      console.log(error)
    }
  }

  angleBottom(camera) {
    try {
      camera.position.set(0, -90, 90)
    } catch (error) {
      console.log(error)
    }
  }

  angleLeft(camera) {
    try {
      camera.position.set(0, 0, -90)
    } catch (error) {
      console.log(error)
    }
  }

  angleRotation(rotation) {
    rotation = !rotation
  }

  render() {
    return (
      <div className="circle">
        <div className="wrap">
          <i
            className="quart"
            onClick={() => this.angleTop(this.props.camera)}
          />
          <i
            className="quart"
            onClick={() => this.angleRight(this.props.camera)}
          />
          <i
            className="quart"
            onClick={() => this.angleBottom(this.props.camera)}
          />
          <i
            className="quart"
            onClick={() => this.angleLeft(this.props.camera)}
          />
          <i
            className="center"
            onClick={() => this.angleRotation(this.props.rotation)}
          />
        </div>
      </div>
    )
  }
}

export default AngleControl
