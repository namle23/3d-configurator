import axios from 'axios'
import * as THREE from 'three'

const loadData = state => {
  axios.get('assets/data.json').then(response => {
    const data = response.data

    state.imageroot = data.imageroot

    try {
      for (let i = 0; i <= data.objects.length; i++) {
        state.obj.push(data.objects[i])
        state.obj_codes.push(data.objects[i].code)
        state.obj_names.push(data.objects[i].name)

        state.arrayObj_obj_length.push(data.objects[i].objects.length)

        for (let j = 0; j < data.objects[i].objects.length; j++) {
          for (
            let k = 0;
            k < data.objects[i].objects[j].instances.length;
            k++
          ) {
            state.obj_obj_insts.push(data.objects[i].objects[j].instances[k])
            state.uploadedJSON3Dlinks.push(
              'http://localhost:3000/uploads/JSONModels/' +
                data.objects[i].objects[j].instances[k].json3d
            )
          }

          state.scenes[i] = new THREE.Scene()

          const ambientLight = new THREE.AmbientLight(0x383838)
          state.scenes[i].add(ambientLight)
          const spotLight = new THREE.SpotLight(0xffffff)
          spotLight.position.set(300, 300, 300)
          spotLight.intensity = 1
          state.scenes[i].add(spotLight)
        }
      }
    } catch (error) {
      console.log(error)
    }

    for (let i = 0; i < state.arrayObj_obj_length.length; i++) {
      state.sortedJSON3Dlinks[i] = state.uploadedJSON3Dlinks.splice(
        0,
        state.arrayObj_obj_length[i]
      )
    }
  })

  state.loading = false
}

export default loadData
