const separateObject = (
  THREE,
  camera,
  selectedObject,
  plane,
  offset,
  objects,
  orbitControls,
  objIndex,
  instIndex
) => {
  console.log(objIndex)
  console.log(instIndex)

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
        console.log(selectedObject.name)

        obj_obj_index = selectedObject.name.slice(
          0,
          selectedObject.name.indexOf('X')
        )
        obj_obj_inst_index = selectedObject.name.slice(
          selectedObject.name.indexOf('X') + 1
        )

        if (obj_obj_index === '0') {
          if (obj_obj_inst_index === '1') {
            console.log('Nam Le')
          }
        }
      } catch (error) {
        console.log('mousedown error')
      }
    }
  })

  document.addEventListener('mouseup', event => {
    orbitControls.enabled = true
    selectedObject = null
  })
}

export default separateObject
