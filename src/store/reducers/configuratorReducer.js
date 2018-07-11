import * as THREE from 'three'

import * as actionTypes from '../actionTypes'

const initState = {
  imageroot: '',
  obj_codes: [],
  obj_names: [],
  obj_prices: [],

  obj_obj_names: [],

  obj_obj_insts_default: [],
  obj_obj_insts_code: [],
  obj_obj_insts_name: [],
  obj_obj_insts_price: [],
  totalPrice: null,

  json3dlinks: [], //hold temporary 3D file information
  sortedJson3dlinks: [], //hold array of array of 3d links
  scenes: [],

  loading: true,
  error: false
}

const reducerConfigurator = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CONFIGURATOR:
      return {
        ...state,
        imageroot: action.data.imageroot,
        obj_codes: action.data.objects.map(objects => objects.code),
        obj_names: action.data.objects.map(objects => objects.name),
        obj_prices: action.data.objects.map(objects => objects.price),

        obj_obj_names: action.data.objects.map(objects =>
          objects.objects.map(objects_objects =>
            objects_objects.instances.map(
              objects_objects_instances => objects_objects_instances.name
            )
          )
        ),

        obj_obj_insts_default: action.data.objects.map(objects =>
          objects.objects.map(
            objects_objects =>
              objects_objects.instances.map(
                objects_objects_instances => objects_objects_instances.default
              )[0]
          )
        ),
        obj_obj_insts_code: action.data.objects.map(objects =>
          objects.objects.map(objects_objects =>
            objects_objects.instances.map(
              objects_objects_instances => objects_objects_instances.code
            )
          )
        ),
        obj_obj_insts_name: action.data.objects.map(objects =>
          objects.objects.map(
            objects_objects =>
              objects_objects.instances.map(
                objects_objects_instances => objects_objects_instances.name
              )[0]
          )
        ),

        obj_obj_insts_price: action.data.objects.map(objects =>
          objects.objects.map(
            objects_objects =>
              objects_objects.instances.map(
                objects_objects_instances => objects_objects_instances.price
              )[0]
          )
        ),

        obj_obj_insts_price_total: action.data.objects.map(objects =>
          objects.objects
            .map(
              objects_objects =>
                objects_objects.instances.map(
                  objects_objects_instances => objects_objects_instances.price
                )[0]
            )
            .reduce((total, num) => total + num)
        ),

        json3dlinks: action.data.objects.map(objects =>
          objects.objects.map(objects_objects =>
            objects_objects.instances.map(
              objects_objects_instances => objects_objects_instances.json3d
            )
          )
        ),

        scenes: action.data.objects.map(() => {
          state.scenes = new THREE.Scene()
          const ambientLight = new THREE.AmbientLight(0x383838)
          state.scenes.add(ambientLight)

          const spotLight = new THREE.SpotLight(0xffffff)
          spotLight.position.set(300, 300, 300)
          spotLight.intensity = 1
          state.scenes.add(spotLight)

          return state.scenes
        }),

        loading: false,
        error: false
      }
    case actionTypes.FETCH_CONFIGURATOR_FAILED:
      return {
        ...state,
        error: true
      }
    default:
      break
  }

  return state
}

export default reducerConfigurator
