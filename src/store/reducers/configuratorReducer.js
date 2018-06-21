import * as actionTypes from '../actionTypes'

const initState = {
  imageroot: '',
  obj: [],
  obj_codes: [],
  obj_names: [],
  obj_obj_names: [],
  obj_obj_insts: [],
  obj_obj_insts_default: [],

  uploadedJSONconfigurator: null,
  uploadedJSON3D: [],
  uploadedJSON3Dlinks: [], //hold temporary 3D file information
  sortedJSON3Dlinks: [], //hold array of array of 3d links
  scenes: [],
  arrayObj_obj_length: [], //hold number of obj_obj

  loading: false
}

const reducerConfigurator = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      break
  }

  return state
}

export default reducerConfigurator
