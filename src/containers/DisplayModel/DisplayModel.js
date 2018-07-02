import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import AngleControl from '../../containers/FooterContainer/AngleControl/AngleControl'
import Spinner from '../../components/Spinner/Spinner'

import * as configuratorAction from '../../store/actions/index'

import customEvent from '../../components/SeparateObject/SeparateObject'

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
  rotation = false

class DisplayModel extends Component {
  create3d() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
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

    const loader = new THREE.JSONLoader()
    //load model to THREE
    for (let i = 0; i < this.props.json3dlinks.length; i++) {
      for (let j = 0; j < this.props.json3dlinks[i].length; j++) {
        loader.load(this.props.json3dlinks[i][j][0], (geo, mat) => {
          obj3d = new THREE.Mesh(geo, mat)
          obj3d.scale.set(15, 15, 15)
          objects.push(obj3d)
          this.props.scenes[i].add(obj3d)
        })
      }
      this.props.json3dlinks.splice(0, this.props.json3dlinks[i])
    }

    //default scene assigned to scene 0
    scene = this.props.scenes[0]

    const render = () => {
      // if (true) {
      //   try {
      //     obj3d.rotation.y += 0.001
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }

      renderer.autoClear = false
      orbitControls.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    document.getElementById('default-product').appendChild(renderer.domElement)

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

  selectScene(index) {
    scene = this.props.scenes[index]
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
    let spinner = this.props.loading ? (
      <Spinner />
    ) : (
      <p>{this.props.obj_prices}</p>
    )

    let btnSelectScene = (
      <div>
        {this.props.obj_names.map((obj_name, index) => (
          <button
            className="btn btn-default"
            key={index}
            onClick={() => this.selectScene(index)}
          >
            {obj_name}
          </button>
        ))}
      </div>
    )

    return (
      <div>
        <AngleControl camera={camera} rotation={rotation} />
        {spinner}
        <div id="default-product" />
        {btnSelectScene}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    imageroot: state.conf.imageroot,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,
    obj_prices: state.conf.obj_prices,

    obj_obj_names: state.conf.obj_obj_names,

    default: state.conf.obj_obj_insts_default,
    code: state.conf.obj_obj_insts_code,
    name: state.conf.obj_obj_insts_name,
    price: state.conf.obj_obj_insts_price,

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
