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
      camera.position.set(-274, 73, 30)
    } catch (error) {
      console.log(error)
    }
  }

  angleLeft(camera) {
    try {
      camera.position.set(16, -283, 10)
    } catch (error) {
      console.log(error)
    }
  }

  angleRotation(rotation) {
    rotation = !rotation
    enableRotation = !enableRotation
    this.props.update(enableRotation)
  }

  enableActivateAddingSpot = () => {
    this.props.enableActivateAddingSpot()
  }

  switchBetweenCubeAndSphere = () => {
    this.props.switchBetweenCubeAndSphere()
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
            className="center-before"
            id="circle-center"
            onClick={this.enableActivateAddingSpot}
          />
        </div>
        {this.props.enableAddingSpot ? (
          this.props.sphereSelected ? (
            <div className="switches-container">
              <div className="switch-to-cube">
                <button
                  id="switch-to-cube-bttn"
                  onClick={this.switchBetweenCubeAndSphere}
                >
                  Switch to cube
                </button>
              </div>
              <div className="switch-to-sphere">
                <button
                  id="switch-to-sphere-bttn"
                  onClick={this.switchBetweenCubeAndSphere}
                  disabled
                >
                  Switch to sphere
                </button>
              </div>
            </div>
          ) : (
            <div className="switches-container">
              <div className="switch-to-cube">
                <button
                  id="switch-to-cube-bttn"
                  onClick={this.switchBetweenCubeAndSphere}
                  disabled
                >
                  Switch to cube
                </button>
              </div>
              <div className="switch-to-sphere">
                <button
                  id="switch-to-sphere-bttn"
                  onClick={this.switchBetweenCubeAndSphere}
                >
                  Switch to sphere
                </button>
              </div>
            </div>
          )
        ) : null}
      </div>
    )
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.enableAddingSpot !== this.props.enableAddingSpot) {
      if (this.props.enableAddingSpot) {
        document
          .getElementById('circle-center')
          .classList.remove('center-before')
        document.getElementById('circle-center').classList.add('center-after')
      } else {
        document
          .getElementById('circle-center')
          .classList.remove('center-after')
        document.getElementById('circle-center').classList.add('center-before')
      }
    }

    // if(prevState.sphereSelected !== this.state.sphereSelected){
    //   if(this.state.sphereSelected){
    //     document.getElementById("switch-to-cube-bttn").disabled = true
    //     document.getElementById("switch-to-sphere-bttn").disabled = false
    //   }
    //   else{
    //     document.getElementById("switch-to-sphere-bttn").disabled = true
    //     document.getElementById("switch-to-cube-bttn").disabled = false
    //   }
    // }
  }
}

export default AngleControl
