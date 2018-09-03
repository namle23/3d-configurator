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
        dispatch(setConfigurator(res.data, loading))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchConfiguratorFailed())
      })
  }
}
