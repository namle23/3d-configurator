const objectHightlight = (THREE, camera, selectedObject, objects) => {
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
    let intersects = raycaster.intersectObjects(objects)

    if (intersects.length > 0) {
      try {
        if (intersects[0].object !== selectedObject) {
          if (selectedObject) {
            selectedObject.material[0].color.setHex(selectedObject.currentHex)
          }
          selectedObject = intersects[0].object
          selectedObject.currentHex = selectedObject.material[0].color.getHex()
          selectedObject.material[0].color.setHex(0x00ff00)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      if (selectedObject) {
        try {
          selectedObject.material[0].color.setHex(selectedObject.currentHex)
        } catch (error) {
          console.log(error)
        }
      }
    }
  })
}

export default objectHightlight