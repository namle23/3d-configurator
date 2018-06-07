import React, { Component } from 'react'
import * as THREE from 'three'

let OrbitControls = require('three-orbit-controls')(THREE)

export default class DefaultModel extends Component {
  componentDidMount() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(new THREE.Color(0x000, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const loader = new THREE.JSONLoader()
    let coal, cap, inner, outter, pipe, ring, smoke

    loader.load('assets/default/coal.js', (geo, mat) => {
      coal = new THREE.Mesh(geo, mat[0])
      coal.scale.set(5, 5, 5)
      scene.add(coal)
    })
    loader.load('assets/default/cap.js', (geo, mat) => {
      cap = new THREE.Mesh(geo, mat[0])
      cap.scale.set(5, 5, 5)
      scene.add(cap)
    })
    loader.load('assets/default/inner.js', (geo, mat) => {
      inner = new THREE.Mesh(geo, mat[0])
      inner.scale.set(5, 5, 5)
      scene.add(inner)
    })
    loader.load('assets/default/outter.js', (geo, mat) => {
      outter = new THREE.Mesh(geo, mat[0])
      outter.scale.set(5, 5, 5)
      scene.add(outter)
    })
    loader.load('assets/default/pipe.js', (geo, mat) => {
      pipe = new THREE.Mesh(geo, mat[0])
      pipe.scale.set(5, 5, 5)
      scene.add(pipe)
    })
    loader.load('assets/default/ring.js', (geo, mat) => {
      ring = new THREE.Mesh(geo, mat[0])
      ring.scale.set(5, 5, 5)
      scene.add(ring)
    })
    loader.load('assets/default/smoke.js', (geo, mat) => {
      smoke = new THREE.Mesh(geo, mat[0])
      smoke.scale.set(5, 5, 5)
      scene.add(smoke)
    })

    camera.position.x = 15
    camera.position.y = 8
    camera.position.z = 40

    const orbitControls = new OrbitControls(camera, renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x383838)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(300, 300, 300)
    spotLight.intensity = 1
    scene.add(spotLight)

    const render = () => {
      renderer.autoClear = false
      requestAnimationFrame(render)
      renderer.render(scene, camera)
      orbitControls.update()
    }

    render()

    // this.refs.webgl.appendChild(renderer.domElement)
    document.getElementById('webgl').appendChild(renderer.domElement)
  }

  render() {
    return <div id="webgl" />
  }
}
