import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import Footer from '../../containers/FooterContainer/Footer/Footer'

import * as configuratorAction from '../../store/actions/index'
// import separateObject from '../../components/CustomEvents/SeparateObject'

import CustomEvents from '../../components/CustomEvents/CustomEvents'

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
  index = 0, //index of object in object array for navigation
  objIndex = [], //hold index if object sliced from selectedObject (part before X)
  instIndex = [], //hold index of instance in obj_obj from sliced (part after X)
  instIndex_index = [] //hold index of selected instance of instances

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
      objIndex.push(i)
      for (let j = 0; j < this.props.default[i].length; j++) {
        instIndex.push(j)
        for (let k = 0; k < this.props.default[i][j].length; k++) {
          instIndex_index.push(k)

          if (this.props.default[i][j][k] === 1) {
            // eslint-disable-next-line
            loader.load(path + this.props.json3dlinks[i][j][k], (geo, mat) => {
              obj3d = new THREE.Mesh(geo, mat)
              obj3d.scale.set(15, 15, 15)
              this.props.scenes[i].add(obj3d)
              obj3d.name = i + 'X' + j

              objects.sort((a, b) => {
                let x = a.name.toLowerCase()
                let y = b.name.toLowerCase()
                return x < y ? -1 : x > y ? 1 : 0
              })
              objects.push(obj3d)
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

    document.getElementById('display').appendChild(renderer.domElement) //append THREE model to screen

    const customEvents = new CustomEvents() //declare instance for CustomEvents

    //map array of objects and instances
    let arr_instIndex = customEvents.mappingCenter(instIndex)
    let arr_instIndex_index = customEvents.mappingCenter(instIndex_index)

    //mouse events
    document.addEventListener('mousemove', event => {
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

        try {
          selectedObject.position.copy(intersects[0].point.sub(offset))
        } catch (error) {
          console.log('mousemove ' + error)
        }
      } else {
        let intersects = raycaster.intersectObjects(objects)

        try {
          if (intersects.length > 0) {
            plane.position.copy(intersects[0].object.position)
            plane.lookAt(camera.position)
          }
        } catch (error) {
          console.log('mousemove else ' + error)
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
      let obj_obj_index, obj_obj_inst_index

      if (intersects.length > 0) {
        orbitControls.enabled = false
        selectedObject = intersects[0].object
        intersects = raycaster.intersectObject(plane)
        try {
          offset.copy(intersects[0].point).sub(plane.position)
          console.log(selectedObject.name)

          obj_obj_index = parseInt(
            selectedObject.name.slice(0, selectedObject.name.indexOf('X')),
            10
          )
          obj_obj_inst_index = parseInt(
            selectedObject.name.slice(selectedObject.name.indexOf('X') + 1),
            10
          )

          this.confirmIndex(
            objIndex,
            obj_obj_index,
            obj_obj_inst_index,
            arr_instIndex,
            arr_instIndex_index
          )
        } catch (error) {
          console.log('mousedown error')
        }
      }
    })

    document.addEventListener('mouseup', event => {
      orbitControls.enabled = true
      selectedObject = null
    })

    customEvents.objectHighlight(
      THREE,
      camera,
      selectedObject,
      objects,
      orbitControls
    )
  }

  confirmIndex = (
    objIndex,
    obj_obj_index,
    obj_obj_inst_index,
    arr_instIndex,
    arr_instIndex_index
  ) => {
    if (objIndex.indexOf(obj_obj_index) !== -1) {
      if (
        arr_instIndex[objIndex.indexOf(obj_obj_index)].indexOf(
          obj_obj_inst_index
        ) !== -1
      ) {
        // let popup = document.createElement('div')
        // popup.className = 'popup'
        // popup.id = 'test'
        // let cancel = document.createElement('div')
        // cancel.className = 'cancel'
        // cancel.innerHTML = 'X'
        // cancel.onclick = function(event) {
        //   popup.parentNode.removeChild(popup)
        // }
        // let innerBlue = document.createElement('input')
        // innerBlue.type = 'button'
        // innerBlue.id = 'innerBlueCSS'
        // innerBlue.onclick = function() {}
        // let innerBlack = document.createElement('input')
        // innerBlack.type = 'button'
        // innerBlack.id = 'innerBlackCSS'
        // innerBlack.onclick = function() {}
        // let innerGray = document.createElement('input')
        // innerGray.type = 'button'
        // innerGray.id = 'innerGrayCSS'
        // innerGray.onclick = function() {}
        // popup.appendChild(innerBlue)
        // popup.appendChild(innerBlack)
        // popup.appendChild(innerGray)
        // popup.appendChild(cancel)
        // document.getElementById('display').appendChild(popup)
        // console.log(
        //   this.props.objects[objIndex.indexOf(obj_obj_index)].objects[
        //     arr_instIndex[objIndex.indexOf(obj_obj_index)].indexOf(
        //       obj_obj_inst_index
        //     )
        //   ]
        // )
      }
    }
  }

  nextScene(obj_names_length) {
    if (index >= obj_names_length) {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    } else {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = false
        }
      })
    }

    index++

    if (index >= obj_names_length) {
      index = 0
      scene = this.props.scenes[0]
      camera.position.set(70, 70, 70)

      let nextNodePrice = document.createTextNode(this.props.obj_prices[0])
      let nextPrice = document.getElementById('price')
      nextPrice.replaceChild(nextNodePrice, nextPrice.childNodes[0])

      let nextNodeName = document.createTextNode(this.props.obj_names[0])
      let nextName = document.getElementById('name')
      nextName.replaceChild(nextNodeName, nextName.childNodes[0])

      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    } else {
      scene = this.props.scenes[index]
      camera.position.set(70, 70, 70)

      let nextNodePrice = document.createTextNode(this.props.obj_prices[index])
      let nextPrice = document.getElementById('price')
      nextPrice.replaceChild(nextNodePrice, nextPrice.childNodes[0])

      let nextNodeName = document.createTextNode(this.props.obj_names[index])
      let nextName = document.getElementById('name')
      nextName.replaceChild(nextNodeName, nextName.childNodes[0])

      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    }
  }

  prevScene(obj_names_length) {
    if (index <= 0) {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    } else {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = false
        }
      })
    }

    index--

    if (index <= 0) {
      index = obj_names_length
      console.log(index)

      scene = this.props.scenes[0]
      camera.position.set(70, 70, 70)

      let prevNodePrice = document.createTextNode(this.props.obj_prices[0])
      let prevPrice = document.getElementById('price')
      prevPrice.replaceChild(prevNodePrice, prevPrice.childNodes[0])

      let prevNodeName = document.createTextNode(this.props.obj_names[0])
      let prevName = document.getElementById('name')
      prevName.replaceChild(prevNodeName, prevName.childNodes[0])

      this.props.scenes[0].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    } else {
      scene = this.props.scenes[index]
      camera.position.set(70, 70, 70)

      let prevNodePrice = document.createTextNode(this.props.obj_prices[index])
      let prevPrice = document.getElementById('price')
      prevPrice.replaceChild(prevNodePrice, prevPrice.childNodes[0])

      let prevNodeName = document.createTextNode(this.props.obj_names[index])
      let prevName = document.getElementById('name')
      prevName.replaceChild(prevNodeName, prevName.childNodes[0])

      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    }
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
    objects: state.conf.objects,

    imageroot: state.conf.imageroot,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,
    obj_prices: state.conf.obj_prices,

    obj_obj_names: state.conf.obj_obj_names,
    obj_obj_insts: state.conf.obj_obj_instances,

    default: state.conf.obj_obj_insts_default,
    code: state.conf.obj_obj_insts_code,
    name: state.conf.obj_obj_insts_name,
    price: state.conf.obj_obj_insts_price,
    price_total: state.conf.obj_obj_insts_price_total,

    json3dlinks: state.conf.json3dlinks,
    scenes: state.conf.scenes
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
