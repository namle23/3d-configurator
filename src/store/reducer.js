import * as actionTypes from './actionTypes'

import loadData from './actions'

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

const reducer = (state = initState, action) => {
  loadData(state)

  switch (action.type) {
    case actionTypes.ACTIONLOADING:
      return {
        ...state,
        loading: true
      }
    default:
      break
  }

  return state
}

export default reducer
