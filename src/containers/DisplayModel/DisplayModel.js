import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import Footer from '../../containers/FooterContainer/Footer/Footer'

import * as configuratorAction from '../../store/actions/index'
import separateObject from '../../components/CustomEvents/SeparateObject'
import objectHightlight from '../../components/CustomEvents/ObjectHighlight'

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
  index

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
    for (let i = 0; i < this.props.default.length; i++) {
      for (let j = 0; j < this.props.default[i].length; j++) {
        for (let k = 0; k < this.props.default[i][j].length; k++) {
          if (this.props.default[i][j][k] === 1) {
            // eslint-disable-next-line
            loader.load(path + this.props.json3dlinks[i][j][k], (geo, mat) => {
              obj3d = new THREE.Mesh(geo, mat)
              obj3d.scale.set(15, 15, 15)
              objects.push(obj3d)
              this.props.scenes[i].add(obj3d)
            })
          }
        }
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

    separateObject(
      THREE,
      camera,
      selectedObject,
      plane,
      offset,
      objects,
      orbitControls
    )

    objectHightlight(THREE, camera, selectedObject, objects)
  }

  getNextIndex = (index = 1, obj_names_length, direction) => {
    switch (direction) {
      case 'next':
        scene = this.props.scenes[index]
        camera.position.set(70, 70, 70)

        let nextNodePrice = document.createTextNode(
          this.props.obj_prices[index]
        )
        let nextPrice = document.getElementById('price')
        nextPrice.replaceChild(nextNodePrice, nextPrice.childNodes[0])

        let nextNodeName = document.createTextNode(this.props.obj_names[index])
        let nextName = document.getElementById('name')
        nextName.replaceChild(nextNodeName, nextName.childNodes[0])

        return (index + 1) % obj_names_length
      case 'prev':
        scene = this.props.scenes[index]
        camera.position.set(70, 70, 70)

        let prevNodePrice = document.createTextNode(
          this.props.obj_prices[index]
        )
        let prevPrice = document.getElementById('price')
        prevPrice.replaceChild(prevNodePrice, prevPrice.childNodes[0])

        let prevNodeName = document.createTextNode(this.props.obj_names[index])
        let prevName = document.getElementById('name')
        prevName.replaceChild(prevNodeName, prevName.childNodes[0])

        return (index === 0 && obj_names_length - 1) || index - 1
      default:
        return index
    }
  }

  getNewIndex = (direction, obj_names_length) => {
    index = this.getNextIndex(index, obj_names_length, direction)
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
          onClick={() => this.getNewIndex('prev', this.props.obj_names.length)}
        />
        <i
          className="next"
          onClick={() => this.getNewIndex('next', this.props.obj_names.length)}
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
    obj_prices: state.conf.obj_prices,

    obj_obj_names: state.conf.obj_obj_names,

    default: state.conf.obj_obj_insts_default,
    code: state.conf.obj_obj_insts_code,
    name: state.conf.obj_obj_insts_name,
    price: state.conf.obj_obj_insts_price,
    price_total: state.conf.obj_obj_insts_price_total,

    json3dlinks: state.conf.json3dlinks,
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
