var camera, scene, renderer, geometry, material, mesh, stats
var worldWidth = 256,
  worldDepth = 256,
  worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2

init()
animate()

function init() {
  stats = initStats()
  // call the render function
  var step = 0
  /* Controls Start */
  // setup the control gui
  var controls = new function() {
    // we need the first child, since it's a multimaterial
    this.radius = 10
    this.detail = 0
    this.type = 'Icosahedron'

    this.redraw = function() {
      // remove the old plane
      scene.remove(mesh)
      // create a new one

      switch (controls.type) {
        case 'Icosahedron':
          mesh = createMesh(
            new THREE.IcosahedronGeometry(controls.radius, controls.detail)
          )
          break
        case 'Tetrahedron':
          mesh = createMesh(
            new THREE.TetrahedronGeometry(controls.radius, controls.detail)
          )
          break
        case 'Octahedron':
          mesh = createMesh(
            new THREE.OctahedronGeometry(controls.radius, controls.detail)
          )
          break
        case 'Custom':
          var vertices = [
            [1, 0, 1],
            [1, 0, -1],
            [-1, 0, -1],
            [-1, 0, 1],
            [0, 1, 0]
          ]

          var faces = [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]]

          mesh = createMesh(
            new THREE.PolyhedronGeometry(
              vertices,
              faces,
              controls.radius,
              controls.detail
            )
          )
          break
      }

      // add it to the scene.
      scene.add(mesh)
    }
  }()

  var gui = new dat.GUI()
  gui
    .add(controls, 'radius', 0, 40)
    .step(1)
    .onChange(controls.redraw)
  gui
    .add(controls, 'detail', 0, 3)
    .step(1)
    .onChange(controls.redraw)
  gui
    .add(controls, 'type', [
      'Icosahedron',
      'Tetrahedron',
      'Octahedron',
      'Custom'
    ])
    .onChange(controls.redraw)
  /* Controls End */

  scene = new THREE.Scene()
  //scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

  /* Camera Start */
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // position and point the camera to the center of the scene
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 50
  camera.lookAt(new THREE.Vector3(10, 0, 0))
  scene.add(camera)
  /* Camera End */

  /* Ground Mesh Start */
  var groundGeom = new THREE.PlaneGeometry(700, 700, 4, 4)
  var groundMesh = new THREE.Mesh(
    groundGeom,
    new THREE.MeshBasicMaterial({
      color: 0x777777
    })
  )
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.position.y = -200
  scene.add(groundMesh)
  /* Ground Mesh End */

  /* Mesh Start */
  mesh = createMesh(new THREE.IcosahedronGeometry(15, 0))
  // add the sphere to the scene
  scene.add(mesh)
  /* Mesh End */

  var ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)
  var spotLight = new THREE.SpotLight(0xffffff)
  scene.add(spotLight)

  renderer = new THREE.CanvasRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)
}

function createMesh(geom) {
  // assign two materials
  var meshMaterial = new THREE.MeshNormalMaterial()
  meshMaterial.side = THREE.DoubleSide
  var wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true

  // create a multimaterial
  var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [
    meshMaterial,
    wireFrameMat
  ])

  return mesh
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  stats.update()

  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.02

  renderer.render(scene, camera)
}

function initStats() {
  var stats = new Stats()
  stats.setMode(0) // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.left = '0px'
  stats.domElement.style.top = '0px'

  document.body.appendChild(stats.domElement)

  return stats
}
