import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import Footer from '../../containers/FooterContainer/Footer/Footer'

import * as configuratorAction from '../../store/actions/index'
// import separateObject from '../../components/CustomEvents/SeparateObject'

import CustomEvents from '../../components/CustomEvents/CustomEvents'

import './DisplayModel.css'

const OrbitControls = require('three-orbit-controls')(THREE)
const customEvents = new CustomEvents() //declare instance for CustomEvents
let scene,
  camera,
  renderer,
  plane,
  selectedObject,
  offset = new THREE.Vector3(),
  objects = [], //hold object model for separation (default only)
  orbitControls,
  obj3d,
  index = 0, //index of object in object array for navigation
  objIndex = [], //hold index if object sliced from selectedObject (part before X)
  instIndex = [], //hold index of instance in obj_obj from sliced (part after X)
  instIndex_index = [], //hold index of selected instance of instances,
  obj3dNotDefault,
  objectsNotDefault = []

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const path =
  window.location.protocol +
  '//' +
  window.location.host +
  '/' +
  window.location.pathname

class DisplayModel extends Component {
  state = {
    popup: null
  }

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

      this.setVisibility()
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
          } else {
            // eslint-disable-next-line
            loader.load(path + this.props.json3dlinks[i][j][k], (geo, mat) => {
              obj3dNotDefault = new THREE.Mesh(geo, mat)
              obj3dNotDefault.scale.set(15, 15, 15)
              this.props.scenes[i].add(obj3dNotDefault)
              obj3dNotDefault.name = i + 'X' + j + 'Y' + k //format 0X1Y1

              objectsNotDefault.sort((a, b) => {
                let x = a.name.toLowerCase()
                let y = b.name.toLowerCase()
                return x < y ? -1 : x > y ? 1 : 0
              })
            })
          }
        }
      }
    }

    scene = this.props.scenes[0]
    camera.lookAt(scene.position)

    const render = () => {
      renderer.autoClear = false
      orbitControls.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    document.getElementById('display').appendChild(renderer.domElement) //append models to screen

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

          //get index accordingly
          obj_obj_index = customEvents.getNameIndex(
            selectedObject.name,
            0,
            selectedObject.name.indexOf('X')
          )
          obj_obj_inst_index = customEvents.getNameIndex(
            selectedObject.name,
            selectedObject.name.indexOf('X') + 1
          )

          this.confirmIndex(
            objIndex,
            obj_obj_index,
            obj_obj_inst_index,
            arr_instIndex,
            arr_instIndex_index,
            selectedObject
          )
        } catch (error) {
          console.log('mousedown error' + error)
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
    objIndex, //[0,1,2,3...], depends on the amount of models
    obj_obj_index, //index of current displayed model
    obj_obj_inst_index, //index of current selected object of model (instance index)
    arr_instIndex,
    arr_instIndex_index,
    selectedObject
  ) => {
    if (objIndex.indexOf(obj_obj_index) !== -1) {
      if (
        arr_instIndex[objIndex.indexOf(obj_obj_index)].indexOf(
          obj_obj_inst_index
        ) !== -1
      ) {
        let childNames = scene.children.map(children => children.name)
        //index of object in current scene
        let matchedIndex = childNames.findIndex(x => x === selectedObject.name)
        let matchedChild = scene.children[matchedIndex]

        let mappedInstance = this.props.objects[obj_obj_index].objects[
          obj_obj_inst_index
        ].instances.map((instance, inst_index) => {
          return (
            <button
              key={inst_index}
              className="btn btn-default"
              onClick={() => {
                //hide selected default object
                matchedChild.visible = false

                let arrMatchedChildName = [],
                  indexOfY = [],
                  slicedValue = []

                for (let i = 0; i < childNames.length; i++) {
                  if (childNames[i].indexOf(matchedChild.name) > -1) {
                    arrMatchedChildName.push(childNames[i])
                    indexOfY.push(childNames[i].indexOf('Y'))
                  }
                }

                let splitArray = customEvents.splitArray(
                  customEvents.mergeArray(arrMatchedChildName, indexOfY)
                )

                for (let i = 0; i < splitArray.length; i++) {
                  slicedValue.push(splitArray[i][0].slice(splitArray[i][1] + 1))
                }

                //change value of default (without Y) to 0 to match index
                if (slicedValue.indexOf(selectedObject.name) > -1) {
                  slicedValue[slicedValue.indexOf(selectedObject.name)] = '0'
                }

                //convert string values to integer value
                let intSlicedValue = slicedValue.map(x => parseInt(x, 10))

                if (intSlicedValue.indexOf(inst_index) > -1) {
                  for (let i = 0; i < scene.children.length; i++) {
                    if (
                      scene.children[i].name ===
                      arrMatchedChildName[intSlicedValue.indexOf(inst_index)]
                    ) {
                      scene.children[i].visible = true
                    }
                  }
                }
              }}
            >
              {instance.name}
            </button>
          )
        })

        this.setState({
          popup: (
            <div>
              <div className="m-mask">
                <div className="m-wrapper">
                  <div className="m-container">
                    <span
                      className="close"
                      onClick={() => {
                        this.setState({ popup: null })
                      }}
                    >
                      &times;
                    </span>

                    <ul>{mappedInstance}</ul>

                    <div id="instance" />
                  </div>
                </div>
              </div>
            </div>
          )
        })

        let ins1
        let sceneInstance = new THREE.Scene()
        let cameraInstance = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        )
        const rendererInstance = new THREE.WebGLRenderer({ alpha: true })
        rendererInstance.setSize(300, 200)
        let oControl = new OrbitControls(
          cameraInstance,
          rendererInstance.domElement
        )

        //empty div before append new child element
        document.getElementById('instance').innerHTML = ''

        document
          .getElementById('instance')
          .appendChild(rendererInstance.domElement)

        const ambientLight1 = new THREE.AmbientLight(0x383838)
        sceneInstance.add(ambientLight1)

        const spotLight1 = new THREE.SpotLight(0xffffff)
        spotLight1.position.set(300, 300, 300)
        spotLight1.intensity = 1
        sceneInstance.add(spotLight1)

        const loaderInstance = new THREE.JSONLoader()

        for (
          let i = 0;
          i <
          this.props.objects[obj_obj_index].objects[obj_obj_inst_index]
            .instances.length;
          i++
        ) {
          loaderInstance.load(
            path +
              this.props.objects[obj_obj_index].objects[obj_obj_inst_index]
                .instances[i].json3d,
            // eslint-disable-next-line
            (geo, mat) => {
              ins1 = new THREE.Mesh(geo, mat)
              ins1.scale.set(20, 20, 20)
              sceneInstance.add(ins1)
            }
          )
        }

        cameraInstance.position.set(30, 35, 40)
        cameraInstance.lookAt(sceneInstance.position)

        const render = () => {
          requestAnimationFrame(render)
          oControl.update()
          rendererInstance.render(sceneInstance, cameraInstance)
        }

        render()
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

    this.setVisibility()
  }

  prevScene(obj_names_length) {
    if (index <= 0) {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = false
        }
      })
    } else {
      //need help
      this.props.scenes[index - 1].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    }

    index--

    if (index <= 0) {
      index = obj_names_length
      scene = this.props.scenes[0]
      camera.position.set(70, 70, 70)

      let prevNodePrice = document.createTextNode(this.props.obj_prices[0])
      let prevPrice = document.getElementById('price')
      prevPrice.replaceChild(prevNodePrice, prevPrice.childNodes[0])

      let prevNodeName = document.createTextNode(this.props.obj_names[0])
      let prevName = document.getElementById('name')
      prevName.replaceChild(prevNodeName, prevName.childNodes[0])

      this.props.scenes[index].traverse(object => {
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

    this.setVisibility()
  }

  //set visibility of not default instances to false (by default)
  setVisibility() {
    for (let i = 0; i < this.props.scenes.length; i++) {
      for (let j = 0; j < this.props.scenes[i].children.length; j++) {
        if (this.props.scenes[i].children[j].name.indexOf('Y') > -1) {
          this.props.scenes[i].children[j].visible = false
        }
      }
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

        <div>{this.state.popup}</div>

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
