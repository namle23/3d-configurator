import React, { Component } from 'react'

import './AngleControl.css'
let enableRotation = false

class AngleControl extends Component {
  angleTop(camera) {
    try {
      camera.position.set(69, 250, 117)
    } catch (error) {
      console.log(error)
    }
  }

  angleRight(camera) {
    try {
      camera.position.set(260, 90, 73)
    } catch (error) {
      console.log(error)
    }
  }

  angleBottom(camera) {
    try {
      camera.position.set(16, -283, 10)
    } catch (error) {
      console.log(error)
    }
  }

  angleLeft(camera) {
    try {
      camera.position.set(-274, 73, 30)
    } catch (error) {
      console.log(error)
    }
  }

  angleRotation(rotation) {
    rotation = !rotation
    enableRotation = !enableRotation
    this.props.update(enableRotation)
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
          <p
            className="center"
            onClick={() => this.angleRotation(this.props.rotation)}
          />
        </div>
      </div>
    )
  }
}

export default AngleControl
