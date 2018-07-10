import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import Footer from '../../containers/FooterContainer/Footer/Footer'

import * as configuratorAction from '../../store/actions/index'
import customEvent from '../../components/SeparateObject/SeparateObject'

import './DisplayModel.css'

const OrbitControls = require('three-orbit-controls')(THREE)
let scene,
  camera,
  renderer,
  plane,
  selectedObject,
  offset = new THREE.Vector3(),
  objects = [], //hold object model for separation
  orbitControls,
  obj3d,
  modelIndex = 0

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const path = window.location.protocol + '//' + window.location.host + '/'

class DisplayModel extends Component {
  create3d() {
    camera.position.set(70, 70, 70)

    renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(new THREE.Color(0x000, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)

    plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000, 18, 18),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.25,
        transparent: true
      })
    )

    orbitControls = new OrbitControls(camera, renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x383838)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(300, 300, 300)
    spotLight.intensity = 1
    scene.add(spotLight)

    renderer.gammaInput = true
    renderer.gammaOutput = true

    const loadingManager = new THREE.LoadingManager(() => {
      const loadingScreen = document.getElementById('loading-screen')
      loadingScreen.classList.add('fade-out')
      loadingScreen.addEventListener('transitionend', () => {
        document.getElementById('loading-screen').remove()
      })
    })

    const loader = new THREE.JSONLoader(loadingManager)
    for (let i = 0; i < this.props.json3dlinks.length; i++) {
      for (let j = 0; j < this.props.json3dlinks[i].length; j++) {
        // eslint-disable-next-line
        loader.load(path + '' + this.props.json3dlinks[i][j], (geo, mat) => {
          obj3d = new THREE.Mesh(geo, mat)
          obj3d.scale.set(15, 15, 15)
          objects.push(obj3d)
          this.props.scenes[i].add(obj3d)
        })
      }
    }

    scene = this.props.scenes[0]

    const render = () => {
      renderer.autoClear = false
      orbitControls.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    document.getElementById('display').appendChild(renderer.domElement)

    customEvent(
      THREE,
      camera,
      selectedObject,
      plane,
      offset,
      objects,
      orbitControls
    )
  }

  getIndex(index) {
    console.log('index ' + index)
  }

  nextScene(obj_names_length) {
    ++modelIndex
    console.log(modelIndex)
    this.getIndex(modelIndex)

    if (modelIndex >= obj_names_length) {
      modelIndex = 0
      scene = this.props.scenes[0]
    } else {
      scene = this.props.scenes[modelIndex]
    }

    camera.position.set(70, 70, 70)
  }

  prevScene(obj_names_length) {
    --modelIndex
    console.log(modelIndex)

    if (modelIndex <= 0) {
      modelIndex = obj_names_length
      scene = this.props.scenes[0]
    } else {
      scene = this.props.scenes[modelIndex]
    }

    camera.position.set(70, 70, 70)
  }

  componentDidMount() {
    this.create3d()

    window.addEventListener(
      'resize',
      function() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
  }

  render() {
    return (
      <div>
        <div id="loading-screen">
          <div id="loader" />
        </div>
        <div id="display" />
        <i
          className="prev"
          onClick={() => this.prevScene(this.props.obj_names.length)}
        />
        <i
          className="next"
          onClick={() => this.nextScene(this.props.obj_names.length)}
        />
        <div id="footer">
          <Footer camera={camera} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    imageroot: state.conf.imageroot,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,

    obj_obj_names: state.conf.obj_obj_names,

    default: state.conf.obj_obj_insts_default,
    code: state.conf.obj_obj_insts_code,
    name: state.conf.obj_obj_insts_name,

    json3dlinks: state.conf.json3dlinks,
    sortedJson3dlinks: state.conf.sortedJson3dlinks,
    scenes: state.conf.scenes,

    loading: state.conf.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitConfigurator: () => dispatch(configuratorAction.initConfigurator())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayModel)
