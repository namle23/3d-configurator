import axios from 'axios'

import * as actionTypes from '../actionTypes'

export const setConfigurator = (data, loading) => {
  return {
    type: actionTypes.SET_CONFIGURATOR,
    data: data,
    loading: loading
  }
}

export const fetchConfiguratorFailed = () => {
  return {
    type: actionTypes.FETCH_CONFIGURATOR_FAILED
  }
}

export const initConfigurator = () => {
  return dispatch => {
    axios
      .get('assets/data.json')
      .then(res => {
        let loading = true
        let arr_length = [] //hold number of obj_obj

        for (let i = 0; i < res.data.objects.length; i++) {
          arr_length.push(res.data.objects[i].objects.length)
        }

        // for (let i = 0; i < arr_length.length; i++) {
        //   sorted[i] = prices.splice(0, arr_length[i])
        // }

        dispatch(setConfigurator(res.data, loading))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchConfiguratorFailed())
      })
  }
}
