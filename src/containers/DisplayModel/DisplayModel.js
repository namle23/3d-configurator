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
      if (rotation) {
        try {
          coal.rotation.y += 0.001
          cap.rotation.y += 0.001
          outter.rotation.y += 0.001
          pipe.rotation.y += 0.001
          ring.rotation.y += 0.001
          smoke.rotation.y += 0.001
          inner.rotation.y += 0.001
        } catch (error) {
          console.log(error)
        }
      }

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
    let spinner = this.props.loading ? (
      <Spinner />
    ) : (
      <p>{this.props.obj_prices}</p>
    )

    return (
      <div>
        <AngleControl camera={camera} rotation={rotation} />
        {spinner}
        <div id="default-product" />
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
    arrayObj_obj_length: state.conf.arrayObj_obj_length,

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
