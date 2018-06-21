import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import AngleControl from '../../containers/FooterContainer/AngleControl/AngleControl'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

import * as configuratorAction from '../../store/actions/configuratorAction'

import customEvent from '../../components/SeparateObject/SeparateObject'

const OrbitControls = require('three-orbit-controls')(THREE)
let scene,
  camera,
  renderer,
  plane,
  selectedObject,
  offset = new THREE.Vector3(),
  objects = [],
  orbitControls,
  rotation = false

let coal, cap, inner, outter, pipe, ring, smoke

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

    loader.load('assets/default/coal.js', (geo, mat) => {
      coal = new THREE.Mesh(geo, mat[0])
      coal.scale.set(10, 10, 10)
      objects.push(coal)
      scene.add(coal)
    })
    loader.load('assets/default/cap.js', (geo, mat) => {
      cap = new THREE.Mesh(geo, mat[0])
      cap.scale.set(10, 10, 10)
      objects.push(cap)
      scene.add(cap)
    })
    loader.load('assets/default/inner.js', (geo, mat) => {
      inner = new THREE.Mesh(geo, mat[0])
      inner.scale.set(10, 10, 10)
      objects.push(inner)
      scene.add(inner)
    })
    loader.load('assets/default/outter.js', (geo, mat) => {
      outter = new THREE.Mesh(geo, mat[0])
      outter.scale.set(10, 10, 10)
      objects.push(outter)
      scene.add(outter)
    })
    loader.load('assets/default/pipe.js', (geo, mat) => {
      pipe = new THREE.Mesh(geo, mat[0])
      pipe.scale.set(10, 10, 10)
      objects.push(pipe)
      scene.add(pipe)
    })
    loader.load('assets/default/ring.js', (geo, mat) => {
      ring = new THREE.Mesh(geo, mat[0])
      ring.scale.set(10, 10, 10)
      objects.push(ring)
      scene.add(ring)
    })
    loader.load('assets/default/smoke.js', (geo, mat) => {
      smoke = new THREE.Mesh(geo, mat[0])
      smoke.scale.set(10, 10, 10)
      objects.push(smoke)
      scene.add(smoke)
    })

    const render = () => {
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

  componentDidMount() {
    this.props.onInitConfigurator()
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
        <AngleControl camera={camera} rotation={rotation} />
        {this.props.loading ? <LoadingSpinner /> : <i>{this.props.obj}</i>}
        <div id="default-product" />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    obj: state.conf.obj,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,
    obj_obj_names: state.conf.obj_obj_names,
    obj_obj_insts: state.conf.obj_obj_insts,

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
