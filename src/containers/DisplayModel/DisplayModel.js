import React, { Component } from 'react'
import * as THREE from 'three'
import { connect } from 'react-redux'

import Footer from '../../containers/FooterContainer/Footer/Footer'
import KeyValueModel from '../../containers/KeyValueModel/KeyValueModel'

import * as configuratorAction from '../../store/actions/index'
// import separateObject from '../../components/CustomEvents/SeparateObject'

import CustomEvents from '../../components/CustomEvents/CustomEvents'

import './DisplayModel.css'

import DragControls from 'three-dragcontrols'

const OrbitControls = require('three-orbit-controls')(THREE)

const customEvents = new CustomEvents() //declare instance for CustomEvents
const path =
  window.location.protocol +
  '//' +
  window.location.host +
  '/' +
  window.location.pathname

let scene,
  camera,
  renderer,
  plane,
  selectedObject,
  offset = new THREE.Vector3(),
  orbitControls,
  obj3d,
  index = 0, //index of object in object array for navigation
  objIndex = [], //hold index if object sliced from selectedObject (part before X)
  instIndex = [], //hold index of instance in obj_obj from sliced (part after X)
  obj3dNotDefault,
  idInstArr = [], //this array holding the id of each instance under the format eg. 0X1 ..., according to the 3 dimentional indexes
  arrCode = [], //hold product code
  instancesColor = [],
  instances = [], //holding all the instances of the current model
  obj_obj_index_arr = [], //holding the indexes of obj_obj
  obj_obj_inst_index_arr = [], //holding the indexes of obj_obj_inst
  sceneInstance_arr = [], //holding the sceneInstance of each instance in popup window
  mouseDownCount = 0, //to ensure the popup window only runs once
  spotCreatedCount = 0, //count the time one spot is created
  spotArrayData = [], //to store data of spots
  spotArrayModel = [], //to store models of spots
  choose = false,
  onMouseDown,
  spotArrayObject = [],
  dragControls

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setClearColor(new THREE.Color(0x000, 1.0))
renderer.setSize(
  window.innerWidth - window.innerWidth * 0.01,
  window.innerHeight - window.innerHeight * 0.01
)
orbitControls = new OrbitControls(camera, renderer.domElement)
plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000, 18, 18),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.25,
    transparent: true
  })
)

let rendererInstance = new THREE.WebGLRenderer({ alpha: true })

rendererInstance.setSize(window.innerWidth, window.innerHeight)

const loadingManager = new THREE.LoadingManager()

class DisplayModel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keyValuePopup: null,
      popup: null,
      enableRotation: false,
      pPrice: 0,
      totalPrice: 0,
      currentIndex: index,
      destroySpot: false,
      spotArrayData: [],
      spotArrayModel: []
    }

    this.enableEditState = this.enableEditState.bind(this)
    this.FindIdTempInstance_index = this.FindIdTempInstance_index.bind(this)
    this.create3d = this.create3d.bind(this)
  }

  enableEditState(val) {
    this.setState({
      enableRotation: val
    })
  }

  create3d(index) {
    spotCreatedCount = 0

    spotArrayData = []
    spotArrayModel = []

    //empty all the relevant arrays
    obj_obj_index_arr = []
    obj_obj_inst_index_arr = []
    idInstArr = []
    instances = []
    instancesColor = []

    //empty all the children of the scene
    for (let i = scene.children.length - 1; i >= 0; i--)
      scene.remove(scene.children[i])

    camera.position.set(69, 250, 117)

    const ambientLight = new THREE.AmbientLight(0x383838)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(300, 300, 300)
    spotLight.intensity = 1
    scene.add(spotLight)

    renderer.gammaInput = true
    renderer.gammaOutput = true

    try {
      loadingManager.onLoad = () => {
        const loadingScreenNode = document.getElementById('loading-screen')
        loadingScreenNode.classList.add('fade-out')
        loadingScreenNode.addEventListener('transitionend', () => {
          document.getElementById('loading-screen').remove()
        })

        this.setVisibility()
      }

      loadingManager.onStart = () => {
        const waitingScreenNode = document.getElementById('waiting-screen')
        let loadingScreenNode = document.createElement('div')
        loadingScreenNode.setAttribute('id', 'loading-screen')
        let loaderNode = document.createElement('div')
        loaderNode.setAttribute('id', 'loader')
        loadingScreenNode.appendChild(loaderNode)
        waitingScreenNode.appendChild(loadingScreenNode)
      }

      const loader = new THREE.JSONLoader(loadingManager)

      for (let i = 0; i < this.props.default.length; i++)
        for (let j = 0; j < this.props.default[i].length; j++) instIndex.push(j)

      for (let i = 0; i < this.props.default[index].length; i++) {
        idInstArr[i] = []
        objIndex.push(i)
        obj_obj_index_arr.push(i)

        for (let j = 0; j < this.props.default[index][i].length; j++) {
          obj_obj_inst_index_arr.push(j)

          if (this.props.default[index][i][j] === 1) {
            // eslint-disable-next-line
            loader.load(
              path + this.props.json3dlinks[index][i][j],
              // eslint-disable-next-line
              (geo, mat) => {
                obj3d = new THREE.Mesh(geo, mat)
                obj3d.scale.set(50, 50, 50)
                scene.add(obj3d)
                obj3d.name = index + 'X' + i
                idInstArr[i][j] = obj3d.name
                instances.push(obj3d)
                instancesColor.push({
                  key: obj3d.name,
                  value: obj3d.material[0].color.getHex()
                })
              }
            )
          } else {
            // eslint-disable-next-line
            loader.load(
              path + this.props.json3dlinks[index][i][j],
              // eslint-disable-next-line
              (geo, mat) => {
                obj3dNotDefault = new THREE.Mesh(geo, mat)
                obj3dNotDefault.scale.set(50, 50, 50)
                scene.add(obj3dNotDefault)
                obj3dNotDefault.name = index + 'X' + i + 'Y' + j //format 0X1Y1
                idInstArr[i][j] = obj3dNotDefault.name
                instances.push(obj3dNotDefault)
                instancesColor.push({
                  key: obj3dNotDefault.name,
                  value: obj3dNotDefault.material[0].color.getHex()
                })
              }
            )
          }
        }
      } //end for loop loader
    } catch (error) {
      console.log(error)
    }

    camera.lookAt(scene.position)

    const render = () => {
      renderer.autoClear = false
      orbitControls.update()
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    document.getElementById('display').appendChild(renderer.domElement) //append models to screen

    // let coverNode = document.getElementById('cover')

    //map array of objects and instances
    let arr_instIndex = customEvents.mappingCenter(instIndex)

    let timer

    document.getElementById('display').addEventListener('click', event => {
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

      let intersects = raycaster.intersectObjects(instances)
      let obj_obj_index, obj_obj_inst_index

      //key events
      if (event.shiftKey) {
        if (intersects.length > 0) {
          let intersect = intersects[0]

          selectedObject = intersects[0].object

          //prepare point location
          let x = intersect.point.x + 0.35
          let y = intersect.point.y + 0.35
          let z = intersect.point.z + 0.35

          let addSpot = new THREE.Mesh(
            new THREE.SphereGeometry(2, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2),
            new Array(new THREE.MeshBasicMaterial({ color: 0xcccccc }))
          )

          addSpot.position.copy(intersect.point).add(intersect.face.normal)
          addSpot.position
            .divideScalar(50)
            .floor()
            .multiplyScalar(50)
            .addScalar(25)
          addSpot.position.set(x, y, z)
          addSpot.scale.set(2, 2, 2)

          addSpot.name = 'Spot ' + spotCreatedCount
          addSpot.userData.spotIndex = spotCreatedCount
          spotCreatedCount++
          scene.add(addSpot)

          //to add the spot into the instances array so that its can be highlighted
          instances.push(addSpot)

          spotArrayObject.push(addSpot)

          //for dragging the spot to reposition
          dragControls = new DragControls(
            spotArrayObject,
            camera,
            renderer.domElement
          )
          dragControls.addEventListener('dragstart', event => {
            orbitControls.enabled = false
          })

          //adding the spot's current hex color for later comparision
          instancesColor.push({
            key: addSpot.name,
            value: addSpot.material[0].color.getHex()
          })

          render()

          this.handleAddSpot(addSpot.name, addSpot.userData.spotIndex)
        }
      } else if (event.ctrlKey) {
        let intersect = intersects[0]

        try {
          if (intersect.object !== plane) {
            intersect.object.visible = false
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        if (intersects.length > 0) {
          selectedObject = intersects[0].object
          mouseDownCount = mouseDownCount + 1
          try {
            offset.copy(intersects[0].point).sub(plane.position)

            if (!selectedObject.name.startsWith('Spot') && choose) {
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
              if (mouseDownCount === 1) {
                this.confirmIndex(
                  index,
                  obj_obj_index,
                  obj_obj_inst_index,
                  arr_instIndex
                )
              }
            } else {
              let spotIndex = selectedObject.userData.spotIndex

              this.setState({
                keyValuePopup: spotArrayModel[spotIndex]
              })
            }
          } catch (error) {
            console.log('mousedown error' + error)
          }
        }
      }
      choose = false
    })

    onMouseDown = event => {
      choose = true

      timer = setInterval(() => {
        choose = false
      }, 100)
    }

    document
      .getElementById('display')
      .addEventListener('mousedown', onMouseDown)

    document.getElementById('display').addEventListener('mouseup', event => {
      clearInterval(timer)
      orbitControls.enabled = true
      selectedObject = null
      mouseDownCount = 0
    })

    customEvents.objectHighlight(THREE, camera, instancesColor, instances)
  } //end create3d()

  confirmIndex = (
    index, //the index of the current model in JSON tree
    obj_obj_index, //index of current displayed model (has to be equal to index)
    obj_obj_inst_index, //index of current selected object of model (instance index)
    arr_instIndex
  ) => {
    if (index === obj_obj_index) {
      //empty the holding array
      sceneInstance_arr = []

      rendererInstance.autoClear = true

      //store instances of object
      let tempInstances = this.props.objects[obj_obj_index].objects[
        obj_obj_inst_index
      ].instances

      let numOfInstances = tempInstances.length

      let row = parseInt(numOfInstances / 2, 10) + 1

      const loaderInstance = new THREE.JSONLoader()

      let sceneWidth = window.innerWidth / 2
      let sceneHeight = 300

      rendererInstance.setSize(window.innerWidth, row * sceneHeight)

      //define a timer for setInterval and clearInterval, boolean chooser for checking if we choose the instance
      let timer,
        choose = false

      //create orbit control area for each instance according to the size of rendererInstace's view port and scissor
      let createInstanceNode = tempInstances.map((t, inst_index) => {
        let style = {}

        style = {
          position: 'absolute',
          marginLeft: '0px auto',
          width: sceneWidth,
          height: sceneHeight,
          left: sceneWidth * (inst_index % 2) + 30 + 'px',
          top: sceneHeight * parseInt(inst_index / 2, 10) + 20 + 'px',
          padding: '50px',
          borderStyle: 'solid',
          borderColor: 'gray',
          zIndex: 0
        }

        let codes = this.props.objects[index].objects.map(x =>
          x.instances.map(y => y.code)
        )

        let objCodes = this.props.objects[index].objects.map((x, i) =>
          x.instances.map(y => {
            return {
              key: i,
              value: y.code
            }
          })
        )

        return (
          <div
            id={'instance ' + inst_index}
            key={inst_index}
            style={style}
            onMouseUp={() => {
              clearInterval(timer)

              if (choose) {
                let matchedCodes = []

                arrCode.splice(0, 0, {
                  key: obj_obj_inst_index,
                  value: codes[obj_obj_inst_index][inst_index]
                }) //hold changing object code, not unique

                let changing = customEvents.delDuplicateObject(arrCode) //going to change object, unique

                let remain = customEvents.checkRemainIndex(
                  arr_instIndex[index],
                  customEvents.delDuplicate(arrCode.map(c => c.key))
                ) //the remaining object that haven't been selected

                for (let i = 0; i < objCodes.length; i++)
                  for (let j = 0; j < objCodes[i].length; j++)
                    for (let k = 0; k < remain.length; k++)
                      if (remain[k] === objCodes[i][j].key)
                        matchedCodes.push(objCodes[i][j])

                changing = [
                  ...changing,
                  ...customEvents.delDuplicateObject(matchedCodes)
                ].sort((a, b) => (b.key < a.key ? 1 : -1)) //spread into one array of newly created product code

                let nextNodeCode = document.createTextNode(
                  changing.map(c => c.value).reduce((t, n) => t + n)
                )
                let nextCode = document.getElementById('code')
                nextCode.replaceChild(nextNodeCode, nextCode.childNodes[0])

                let idTempInstance = idInstArr[obj_obj_inst_index][inst_index] //this is the id for current temp instance, eg: 0X4 or 0X4Y1

                let idTempInstace_index = scene.children.findIndex(
                  child => child.name === idTempInstance
                ) //the index of the id of the current temp instance in
                // the scene's children array

                // set the child to be visible
                scene.children[idTempInstace_index].visible = true

                // set all the children, who are from the same array with the chosen one to be invisible (eg: we chose 0X4Y1, and the default unchose is 0X4 => 0X4 invisible)
                for (let i = 0; i < idInstArr[obj_obj_inst_index].length; i++)
                  if (i !== inst_index) {
                    idTempInstance = idInstArr[obj_obj_inst_index][i]
                    idTempInstace_index = this.FindIdTempInstance_index(
                      idTempInstance
                    )
                    scene.children[idTempInstace_index].visible = false
                  }

                let finalPrice = 0

                scene.children
                  .filter(child => child.visible === true)
                  .map(child => {
                    for (let i = 0; i < idInstArr.length; i++)
                      for (let j = 0; j < idInstArr[i].length; j++)
                        if (child.name === idInstArr[i][j])
                          finalPrice += this.props.objects[index].objects[i]
                            .instances[j].price
                        else continue

                    return 1 //just for surpressing the warning of returing something when using Array.map()
                  })

                let priceNode = document.createTextNode(finalPrice)
                let price = document.getElementById('price')
                price.replaceChild(priceNode, price.childNodes[0])

                let nameNode = document.createTextNode(
                  this.props.obj_names[index] + ' (modified)'
                )
                let name = document.getElementById('name')
                name.replaceChild(nameNode, name.childNodes[0])

                //close popup
                this.setState({ popup: null })
                let instancesNode = document.getElementById('instances')
                instancesNode.removeChild(instancesNode.firstChild)
                cancelAnimationFrame(idRequestAnimate)
              }
            }}
            onMouseDown={() => {
              //initially choose the instance
              choose = true

              //next is to set a timer to check if the current mouse is held down then choose equals false => able to rotate and observe
              timer = setInterval(() => {
                choose = false
              }, 100)
            }}
          />
        )
      })

      this.setState({
        popup: (
          <div>
            <div className="m-mask">
              <div className="m-wrapper">
                <div id="m-container" className="m-container">
                  {createInstanceNode}
                  <div id="instances" />
                </div>
              </div>
            </div>
          </div>
        )
      }) //end setState to add popup

      //assign the DOM element of the rendererInstace
      let instancesNode = document.getElementById('instances')
      instancesNode.appendChild(rendererInstance.domElement)

      //create appropriate sceneInstance to each instance in the popup window and store them in sceneInstance_arr
      tempInstances.forEach((tempInstance, inst_index) => {
        let sceneInstance = new THREE.Scene()
        let instanceNode = document.getElementById('instance ' + inst_index)

        loaderInstance.load(
          path + tempInstance.json3d,
          // eslint-disable-next-line
          (geo, mat) => {
            let mesh = new THREE.Mesh(geo, mat)
            mesh.scale.set(20, 20, 20)
            sceneInstance.add(mesh)
          }
        )
        const ambientLight = new THREE.AmbientLight(0x383838)
        sceneInstance.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff)
        spotLight.position.set(300, 300, 300)
        spotLight.intensity = 1
        sceneInstance.add(spotLight)

        let cameraInstance = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / sceneHeight,
          1,
          1000
        )
        cameraInstance.position.set(100, 35, 40)
        cameraInstance.lookAt(sceneInstance.position)
        sceneInstance.userData.camera = cameraInstance

        sceneInstance.userData.element = {
          X: (inst_index % 2) * sceneWidth,
          Y: sceneHeight * parseInt(inst_index / 2, 10)
        }

        sceneInstance.userData.oElement = instanceNode

        let oControl = new OrbitControls(
          cameraInstance,
          sceneInstance.userData.oElement
        )
        sceneInstance.userData.oControl = oControl
        sceneInstance_arr.push(sceneInstance)
      })

      //for canceling the requestAnimationFrame in popup window
      let idRequestAnimate

      const render = () => {
        rendererInstance.autoClear = false

        rendererInstance.setScissor(true)

        sceneInstance_arr.forEach(function(sceneInstance) {
          var element = sceneInstance.userData.element

          rendererInstance.setViewport(
            element.X,
            element.Y,
            sceneWidth,
            sceneHeight
          )
          rendererInstance.setScissor(
            element.X,
            element.Y,
            sceneWidth,
            sceneHeight
          )

          var camera = sceneInstance.userData.camera
          rendererInstance.render(sceneInstance, camera)
        })

        idRequestAnimate = requestAnimationFrame(render)
      }

      render()
    }
  }

  handleAddSpot = (name, index) => {
    spotArrayData[index] = []

    this.setState({
      spotArrayData: spotArrayData
    })

    spotArrayModel[index] = (
      <KeyValueModel
        spotName={name}
        spotIndex={index}
        handleDestroy={this.handleDestroySpot}
        handleAddPair={this.handleAddKeyValuePair}
        handleDeletePair={this.handleDeleteKeyValuePair}
        handleExit={this.handleExit}
        spotData={this.state.spotArrayData[index]}
      />
    )

    this.setState({
      keyValuePopup: spotArrayModel[index]
    })
  }

  handleDestroySpot = (name, index) => {
    try {
      if (spotArrayData[index] && spotArrayModel[index]) {
        spotArrayModel.splice(index, 1, name)
        spotArrayData.splice(index, 1, name)

        spotArrayModel.forEach(model => {
          let spotIndex = scene.children.findIndex(
            child => child.name === model
          )
          scene.remove(scene.children[spotIndex])
        })

        this.setState({
          keyValuePopup: null
        })
      }
    } catch (err) {
      console.log(err + ' at line 707')
    }
  }

  handleAddKeyValuePair = (index, key, value) => {
    try {
      if (spotArrayData[index]) {
        spotArrayData[index].push({
          key: key,
          value: value
        })

        this.setState({
          spotArrayData: spotArrayData
        })
      }
    } catch (err) {
      console.log(err + ' at line 736')
    }
  }

  handleDeleteKeyValuePair = (index, pairIndex) => {
    try {
      if (spotArrayData[index]) {
        spotArrayData[index].splice(pairIndex, 1, '')

        this.setState({
          spotArrayData: spotArrayData
        })
      }
    } catch (err) {
      console.log(err + ' at line 751')
    }
  }

  handleExit = index => {
    this.setState({
      keyValuePopup: null
    })
  }
  //this method is for surpressing the warning of dont make a function in a loop
  FindIdTempInstance_index(id) {
    return scene.children.findIndex(child => child.name === id)
  }

  nextScene(obj_names_length) {
    arrCode = []
    index++
    camera.position.set(69, 250, 117)

    let displayNode = document.getElementById('display')
    displayNode.removeChild(displayNode.firstChild)

    let newDisplayNode = displayNode.cloneNode(true)
    displayNode.parentNode.replaceChild(newDisplayNode, displayNode)

    if (index >= obj_names_length) {
      index = 0

      let code = this.props.objects[0].objects
        .map(x =>
          // eslint-disable-next-line
          x.instances.map(y => {
            if (y.default === 1) return y.code
            else if (y.default === 0) return ''
          })
        )
        .reduce((total, num) => total + num)
        .replace(/,/g, '')

      let nextNodeCode = document.createTextNode(code)
      let nextCode = document.getElementById('code')
      nextCode.replaceChild(nextNodeCode, nextCode.childNodes[0])

      this.setState({
        currentIndex: index
      })
      this.create3d(index)
    } else {
      let code = this.props.objects[index].objects
        .map(x =>
          // eslint-disable-next-line
          x.instances.map(y => {
            if (y.default === 1) return y.code
          })
        )
        .reduce((total, num) => total + num)
        .replace(/,/g, '')

      let nextNodeCode = document.createTextNode(code)
      let nextCode = document.getElementById('code')
      nextCode.replaceChild(nextNodeCode, nextCode.childNodes[0])

      this.setState({
        currentIndex: index
      })
      this.create3d(index)
    }
  } //end nextScene

  prevScene(obj_names_length) {
    arrCode = []
    index--

    let displayNode = document.getElementById('display')
    displayNode.removeChild(displayNode.firstChild)

    let newDisplayNode = displayNode.cloneNode(true)
    displayNode.parentNode.replaceChild(newDisplayNode, displayNode)

    if (index < 0) {
      // when index < 0 then we choose the last object
      index = obj_names_length - 1
      this.setState({
        currentIndex: index
      })

      let code = this.props.objects[index].objects
        .map(x =>
          // eslint-disable-next-line
          x.instances.map(y => {
            if (y.default === 1) return y.code
          })
        )
        .reduce((total, num) => total + num)
        .replace(/,/g, '')

      let nextNodeCode = document.createTextNode(code)
      let nextCode = document.getElementById('code')
      nextCode.replaceChild(nextNodeCode, nextCode.childNodes[0])

      this.create3d(index)
    } else {
      this.setState({
        currentIndex: index
      })

      let code = this.props.objects[index].objects
        .map(x =>
          // eslint-disable-next-line
          x.instances.map(y => {
            if (y.default === 1) return y.code
          })
        )
        .reduce((total, num) => total + num)
        .replace(/,/g, '')

      let nextNodeCode = document.createTextNode(code)
      let nextCode = document.getElementById('code')
      nextCode.replaceChild(nextNodeCode, nextCode.childNodes[0])

      this.create3d(index)
    }
  } //end prevScene

  //set visibility of not default instances to false (by default)
  setVisibility() {
    for (let i = 0; i < scene.children.length; i++)
      if (scene.children[i].name.indexOf('Y') > -1)
        scene.children[i].visible = false
  }

  componentDidMount() {
    this.create3d(index)
    window.addEventListener(
      'resize',
      () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
  }

  //to update the next total price if we did any changes in the previous model
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.currentIndex !== this.state.currentIndex) {
      let priceNode = document.createTextNode(
        this.props.price_total[this.state.currentIndex]
      )
      let price = document.getElementById('price')
      price.replaceChild(priceNode, price.childNodes[0])
    }

    orbitControls.enabled = true
  }

  render() {
    return (
      <div id="cover">
        <div id="waiting-screen" />
        <div id="display" />

        <i
          className="prev"
          onClick={() => this.prevScene(this.props.obj_names.length)}
        />
        <i
          className="next"
          onClick={() => this.nextScene(this.props.obj_names.length)}
        />
        <div>{this.state.keyValuePopup}</div>
        <div>{this.state.popup}</div>

        <div id="footer">
          <Footer
            camera={camera}
            update={this.enableEditState}
            index={this.state.currentIndex}
          />
        </div>
      </div>
    )
  }
} // end of class component

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
    total_init: state.conf.obj_obj_insts_price_total,

    json3dlinks: state.conf.json3dlinks,
    scenes: state.conf.scenes,
    price_total: state.conf.obj_obj_insts_price_total
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
