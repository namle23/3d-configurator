import axios from 'axios'

import * as actionTypes from '../actionTypes'

export const setConfigurator = (data, loading, sorted) => {
  return {
    type: actionTypes.SET_CONFIGURATOR,
    data: data,
    loading: loading,
    sorted: sorted
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

        let json = res.data.objects.map(objects =>
          objects.objects.map(objects_objects =>
            objects_objects.instances.map(
              objects_objects_instances => objects_objects_instances.json3d
            )
          )
        )

        let arr_length = []

        for (let i = 0; i < res.data.objects.length; i++) {
          arr_length.push(res.data.objects[i].objects.length)
        }

        let sorted = []

        for (let i = 1; i < arr_length.length; i++) {
          sorted[i] = json.splice(0, arr_length[i])
        }

        dispatch(setConfigurator(res.data, loading, sorted))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchConfiguratorFailed())
      })
  }
}
