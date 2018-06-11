import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

const OrbitControls = require('three-orbit-controls')(THREE)
let scene, camera, renderer

let plane,
  selectedObject,
  offset = new THREE.Vector3(),
  objects = [],
  orbitControls

let coal, cap, inner, outter, pipe, ring, smoke

class DefaultModel extends Component {
  create3d() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
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

    const ambientLight = new THREE.AmbientLight(0x383838)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(300, 300, 300)
    spotLight.intensity = 1
    scene.add(spotLight)

    const loader = new THREE.JSONLoader()

    loader.load('assets/default/coal.js', (geo, mat) => {
      coal = new THREE.Mesh(geo, mat[0])
      coal.scale.set(5, 5, 5)
      objects.push(coal)
      scene.add(coal)
    })
    loader.load('assets/default/cap.js', (geo, mat) => {
      cap = new THREE.Mesh(geo, mat[0])
      cap.scale.set(5, 5, 5)
      objects.push(cap)
      scene.add(cap)
    })
    loader.load('assets/default/inner.js', (geo, mat) => {
      inner = new THREE.Mesh(geo, mat[0])
      inner.scale.set(5, 5, 5)
      objects.push(inner)
      scene.add(inner)
    })
    loader.load('assets/default/outter.js', (geo, mat) => {
      outter = new THREE.Mesh(geo, mat[0])
      outter.scale.set(5, 5, 5)
      objects.push(outter)
      scene.add(outter)
    })
    loader.load('assets/default/pipe.js', (geo, mat) => {
      pipe = new THREE.Mesh(geo, mat[0])
      pipe.scale.set(5, 5, 5)
      objects.push(pipe)
      scene.add(pipe)
    })
    loader.load('assets/default/ring.js', (geo, mat) => {
      ring = new THREE.Mesh(geo, mat[0])
      ring.scale.set(5, 5, 5)
      objects.push(ring)
      scene.add(ring)
    })
    loader.load('assets/default/smoke.js', (geo, mat) => {
      smoke = new THREE.Mesh(geo, mat[0])
      smoke.scale.set(5, 5, 5)
      objects.push(smoke)
      scene.add(smoke)
    })

    camera.position.set(35, 35, 35)

    orbitControls = new OrbitControls(camera, renderer.domElement)

    const render = () => {
      renderer.autoClear = false
      requestAnimationFrame(render)
      renderer.render(scene, camera)
      orbitControls.update()
    }

    render()

    // this.refs.webgl.appendChild(renderer.domElement)
    document.getElementById('default-product').appendChild(renderer.domElement)

    document.addEventListener('mousemove', event => {
      event.preventDefault()

      let vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      )

      vector.unproject(camera)

      let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      )

      if (selectedObject) {
        let intersects = raycaster.intersectObject(plane)
        selectedObject.position.copy(intersects[0].point.sub(offset))
      } else {
        let intersects = raycaster.intersectObjects(objects)

        if (intersects.length > 0) {
          plane.position.copy(intersects[0].object.position)
          plane.lookAt(camera.position)
        }
      }
    })

    document.addEventListener('mousedown', event => {
      let vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      )

      vector.unproject(camera)

      let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      )

      let intersects = raycaster.intersectObjects(objects)

      if (intersects.length > 0) {
        orbitControls.enabled = false

        selectedObject = intersects[0].object

        intersects = raycaster.intersectObject(plane)
        offset.copy(intersects[0].point).sub(plane.position)
      }
    })

    document.addEventListener('mouseup', event => {
      orbitControls.enabled = true
      selectedObject = null
    })
  }

  componentDidMount() {
    this.create3d()
  }

  render() {
    return <div id="default-product" />
  }
}

const mapStateToProps = state => {
  return {
    obj: state.obj,
    obj_codes: state.obj_codes,
    obj_names: state.obj_names,
    obj_obj_names: state.obj_obj_names,
    obj_obj_insts: state.obj_obj_insts
  }
}

// const mapDispatchToProps = dispatch => {
//   return {}
// }

export default connect(mapStateToProps)(DefaultModel)
