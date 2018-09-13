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
  objectsNotDefault = [],
  cubeGeo = new THREE.BoxGeometry(1, 1, 1),
  cubeMat = new THREE.MeshBasicMaterial({ color: 0x000000 }),
  nPrice,
  tPrice

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
  constructor(props) {
    super(props)

    this.state = {
      popup: null,
      enableRotation: false,
      pPrice: 0,
      totalPrice: 0
    }

    this.enableEditState = this.enableEditState.bind(this)
  }

  enableEditState(val) {
    this.setState({
      enableRotation: val
    })
  }

  create3d() {
    camera.position.set(69, 250, 117)

    renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(new THREE.Color(0x000, 1.0))
    renderer.setSize(
      window.innerWidth - window.innerWidth * 0.01,
      window.innerHeight - window.innerHeight * 0.01
    )

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

    try {
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
              loader.load(
                path + this.props.json3dlinks[i][j][k],
                // eslint-disable-next-line
                (geo, mat) => {
                  obj3d = new THREE.Mesh(geo, mat)
                  obj3d.scale.set(50, 50, 50)
                  this.props.scenes[i].add(obj3d)
                  obj3d.name = i + 'X' + j // does this need to go first the above line?
                  objects.sort((a, b) => {
                    let x = a.name.toLowerCase()
                    let y = b.name.toLowerCase()
                    return x < y ? -1 : x > y ? 1 : 0
                  })
                  objects.push(obj3d)
                }
              )
            } else {
              // eslint-disable-next-line
              loader.load(
                path + this.props.json3dlinks[i][j][k],
                // eslint-disable-next-line
                (geo, mat) => {
                  obj3dNotDefault = new THREE.Mesh(geo, mat)
                  obj3dNotDefault.scale.set(50, 50, 50)
                  this.props.scenes[i].add(obj3dNotDefault)
                  obj3dNotDefault.name = i + 'X' + j + 'Y' + k //format 0X1Y1, // does this need to go first the above line?

                  objectsNotDefault.sort((a, b) => {
                    let x = a.name.toLowerCase()
                    let y = b.name.toLowerCase()
                    return x < y ? -1 : x > y ? 1 : 0
                  })
                }
              )
            }
          }
        }
      } //end for loop loader
    } catch (error) {
      console.log(error)
    }

    //initialize total price
    tPrice = this.props.total_init[index]

    scene = this.props.scenes[0]
    camera.lookAt(scene.position)

    const render = () => {
      renderer.autoClear = false
      orbitControls.update()

      // if (this.state.enableRotation) {
      //   for (let i = 3; i < scene.length; i++) {
      //     scene.children[i].rotation.y += 0.001
      //   }
      // }

      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    document.getElementById('display').appendChild(renderer.domElement) //append models to screen

    //map array of objects and instances
    let arr_instIndex = customEvents.mappingCenter(instIndex)
    let arr_instIndex_index = customEvents.mappingCenter(instIndex_index)

    //mouse events
    // document.addEventListener('mousemove', event => {
    //   customEvents.mouseMove(
    //     THREE,
    //     event,
    //     camera,
    //     selectedObject,
    //     plane,
    //     offset,
    //     objects
    //   )
    // })

    const onMouseDown = event => {
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

      //key events
      if (event.shiftKey) {
        if (intersects.length > 0) {
          let intersect = intersects[0]

          //prepare point location
          let x = intersect.point.x + 0.25
          let y = intersect.point.y + 0.25
          let z = intersect.point.z + 0.25

          let cube = new THREE.Mesh(cubeGeo, cubeMat)
          cube.position.copy(intersect.point).add(intersect.face.normal)
          cube.position
            .divideScalar(50)
            .floor()
            .multiplyScalar(50)
            .addScalar(25)
          cube.position.set(x, y, z)

          scene.add(cube)
          render()
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
              selectedObject,
              onMouseDown
            )
          } catch (error) {
            console.log('mousedown error' + error)
          }
        }
      }

      document.removeEventListener('mousedown', onMouseDown)
    }

    const onKeyUp = event => {
      if (!event.shiftKey) {
        document
          .getElementById('display')
          .addEventListener('mousedown', onMouseDown, false)
      } else if (!event.ctrlKey) {
        document
          .getElementById('display')
          .addEventListener('mousedown', onMouseDown, false)
      }
    }

    document.addEventListener('keyup', onKeyUp, false)
    document
      .getElementById('display')
      .addEventListener('mousedown', onMouseDown, false)
    document.addEventListener(
      'mouseup',
      event => {
        orbitControls.enabled = true
        selectedObject = null
      },
      false
    )

    customEvents.objectHighlight(
      THREE,
      camera,
      selectedObject,
      objects,
      orbitControls
    )
  } //end create3d()

  confirmIndex = (
    objIndex, //[0,1,2,3...], depends on the amount of models
    obj_obj_index, //index of current displayed model
    obj_obj_inst_index, //index of current selected object of model (instance index)
    arr_instIndex,
    arr_instIndex_index,
    selectedObject,
    onMouseDown
  ) => {
    //counting the number of time that button(btn) is clicked
    let flag = 0

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
        //store instances of object

        let tempInstances = this.props.objects[obj_obj_index].objects[
          obj_obj_inst_index
        ].instances

        //store default values of each instances(many)
        let defaultOfInstance = tempInstances.map(t => t.default)

        //price of the default instance
        let defaultPrice
        for (let i = 0; i < defaultOfInstance.length; i++) {
          if (defaultOfInstance[i] === 1) {
            defaultPrice =
              tempInstances[defaultOfInstance.indexOf(defaultOfInstance[i])]
                .price
          }
        }

        const loaderInstance = new THREE.JSONLoader()

        //get index of all element in tempInstances
        let tempArrIndex = []
        for (let i = 0; i < tempInstances.length; i++) {
          tempArrIndex.push(i)
        }

        let mappedInstance = tempInstances.map((tempInstance, inst_index) => {
          let rendererInstance = new THREE.WebGLRenderer({ alpha: true })
          rendererInstance.setSize(
            window.innerWidth / 4,
            window.innerHeight / 4
          )

          let cameraInstance = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          )

          const oControl = new OrbitControls(
            cameraInstance,
            rendererInstance.domElement
          )

          let sceneInstance = new THREE.Scene()
          const ambientLight = new THREE.AmbientLight(0x383838)
          sceneInstance.add(ambientLight)

          const spotLight = new THREE.SpotLight(0xffffff)
          spotLight.position.set(300, 300, 300)
          spotLight.intensity = 1
          sceneInstance.add(spotLight)

          loaderInstance.load(
            path + tempInstance.json3d,
            // eslint-disable-next-line
            (geo, mat) => {
              let mesh = new THREE.Mesh(geo, mat)
              mesh.scale.set(20, 20, 20)
              sceneInstance.add(mesh)

              cameraInstance.position.set(30, 35, 40)
              cameraInstance.lookAt(sceneInstance.position)

              const render = () => {
                requestAnimationFrame(render)
                oControl.update()
                rendererInstance.render(sceneInstance, cameraInstance)
              }

              render()

              document
                .getElementById('instances')
                .appendChild(rendererInstance.domElement)
            }
          )

          let style = { marginLeft: '220px' }

          return (
            <button
              style={style}
              key={inst_index}
              className="btn btn-default btn-xs"
              id={'btn' + inst_index}
              onClick={() => {
                //hide selected default object
                // matchedChild.visible = false

                flag++

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
                      //set selected instance to be visible
                      scene.children[i].visible = true

                      //name of the selected child mesh of instances
                      let selectedName = arrMatchedChildName.indexOf(
                        scene.children[i].name
                      )

                      //array of unselected mesh that need to be invisible
                      let toInvisibleChild = arrMatchedChildName
                        .slice(0, selectedName)
                        .concat(arrMatchedChildName.slice(selectedName + 1))

                      //prepare to make mesh invisible by name
                      for (let j = 0; j < toInvisibleChild.length; j++) {
                        for (let k = 0; k < scene.children.length; k++) {
                          if (toInvisibleChild[j] === scene.children[k].name) {
                            scene.children[k].visible = false
                            // scene.children[k].disabled = true
                          }
                        }
                      }

                      let toDisplayButton = tempArrIndex
                        .slice(0, inst_index)
                        .concat(tempArrIndex.slice(inst_index + 1))

                      //button can be clicked only once
                      document.getElementById(
                        'btn' + inst_index
                      ).disabled = true

                      //enable other buttons
                      for (let i = 0; i < toDisplayButton.length; i++) {
                        document.getElementById(
                          'btn' + toDisplayButton[i]
                        ).disabled = false
                      }

                      nPrice = tempInstance.price

                      this.setState({
                        pPrice: tempInstance.price
                      })

                      //calculate price base on flag value
                      if (flag === 1) {
                        tPrice =
                          tPrice - this.state.pPrice + nPrice - defaultPrice
                      } else {
                        tPrice = tPrice - this.state.pPrice + nPrice
                      }

                      let priceNode = document.createTextNode(tPrice)
                      let price = document.getElementById('price')
                      price.replaceChild(priceNode, price.childNodes[0])

                      let nameNode = document.createTextNode(
                        this.props.obj_names[index] + ' (modified)'
                      )
                      let name = document.getElementById('name')
                      name.replaceChild(nameNode, name.childNodes[0])
                    }
                  }
                } //end if
              }}
            >
              {tempInstance.name}
            </button>
          )
        }) //end map

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
                        document.getElementById('instances').innerHTML = ''
                        //add mousedown event after press exit
                        document
                          .getElementById('display')
                          .addEventListener('mousedown', onMouseDown, false)

                        this.setState({
                          pPrice: null
                        })
                      }}
                    >
                      &times;
                    </span>

                    <div className="map-instances">{mappedInstance}</div>
                    <div id="instances" />
                  </div>
                </div>
              </div>
            </div>
          )
        }) //end setState to add popup
      }
    } //end first if condition
  }

  nextScene(obj_names_length) {
    
    if (index >= obj_names_length) {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = false
        }
      })
    } else {
      this.props.scenes[index].traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.visible = true
        }
      })
    }

    index++
    camera.position.set(69, 250, 117)

    //set total price according to displaying model
    tPrice = this.props.total_init[index]

    if (index >= obj_names_length) {
      index = 0
      scene = this.props.scenes[0]

      let nextNodePrice = document.createTextNode(this.props.total_init[0])
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

      let nextNodePrice = document.createTextNode(this.props.total_init[index])
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

    // console.log("next " + index);
    this.setVisibility()
  } //end nextScene

  prevScene(obj_names_length) { //fixed previouse button behaves wrong

    

    if (index < 0) {
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
    camera.position.set(80, 220, 160)

    if (index < 0) { // when index < 0 then we choose the last object
      index = obj_names_length - 1
      scene = this.props.scenes[index]

      //set total price according to displaying model
      tPrice = this.props.total_init[index]
      let prevNodePrice = document.createTextNode(this.props.total_init[index])
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
     else if (index === 0){ // when index == 0 then we take the object whose index is 0
      scene = this.props.scenes[0]

      //set total price according to displaying model
      tPrice = this.props.total_init[index]
      let prevNodePrice = document.createTextNode(this.props.total_init[0])
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
     }
    
    else { // when index > 0 procede as normal
      scene = this.props.scenes[index]

      //set total price according to displaying model
      tPrice = this.props.total_init[index]
      let prevNodePrice = document.createTextNode(this.props.total_init[index])
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

    // console.log("previous " + index);
    this.setVisibility()
  } //end prevScene

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
      () => {
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

        <div id="info">
          <strong>click</strong>: show instances,
          <strong>shift + hover + click</strong>: add spot
          {/* <strong>ctrl + hover + click</strong>: remove spot */}
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
          <Footer camera={camera} update={this.enableEditState} />
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
    total_init: state.conf.obj_obj_insts_price_total,

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
