import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

function App() {

  const canvasRef = useRef()

  useEffect(() => {

    const scene = new THREE.Scene()

    const bgLoader = new THREE.TextureLoader()
    bgLoader.load('/eid-bg.jpg', texture => {
      scene.background = texture
    })

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)

    const controls = new OrbitControls(camera, renderer.domElement)

    const stats = new Stats()
    document.body.appendChild(stats.dom)

    // Texture
    const loader = new THREE.TextureLoader()
    const texture = loader.load('/eid-texture.jpg')
    texture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })

    // Cube group
    const cubeGroup = new THREE.Group()
    scene.add(cubeGroup)

    const size = 1
    const faces = []

    function createFace(x, y, z, rx, ry) {

      const geometry = new THREE.PlaneGeometry(size, size)
      const face = new THREE.Mesh(geometry, material)

      face.position.set(x, y, z)
      face.rotation.set(rx, ry, 0)

      face.userData.direction = new THREE.Vector3(x, y, z).normalize()

      cubeGroup.add(face)
      faces.push(face)

    }

    createFace(0, 0, size/2, 0, 0)
    createFace(0, 0, -size/2, 0, Math.PI)
    createFace(size/2, 0, 0, 0, -Math.PI/2)
    createFace(-size/2, 0, 0, 0, Math.PI/2)
    createFace(0, size/2, 0, -Math.PI/2, 0)
    createFace(0, -size/2, 0, Math.PI/2, 0)

    let exploded = false
    let textShown = false

    function showEidText() {

      const fontLoader = new FontLoader()

      fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {

        const textGeometry = new TextGeometry('Eid Mubarak', {
          font: font,
          size: 0.3,
          height: 0.05
        })

        textGeometry.center()

        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xffd700
        })

        const textMesh = new THREE.Mesh(textGeometry, textMaterial)

        scene.add(textMesh)

      })

    }

    window.addEventListener('click', () => {
      exploded = true
    })

    const animate = () => {

      requestAnimationFrame(animate)

      stats.update()
      controls.update()

      if (!exploded) {

        cubeGroup.rotation.x += 0.01
        cubeGroup.rotation.y += 0.01

      } else {

        faces.forEach(face => {

          const move = face.userData.direction.clone().multiplyScalar(0.02)
          face.position.add(move)

        })

        if (!textShown) {

          textShown = true

          setTimeout(() => {
  showEidText()

  const msg = document.createElement('div')
  msg.innerText = 'Eid Mubarak'
  msg.style.position = 'absolute'
  msg.style.top = '50%'
  msg.style.left = '50%'
  msg.style.transform = 'translate(-50%, -50%)'
  msg.style.fontSize = '60px'
  msg.style.fontWeight = 'bold'
  msg.style.color = '#FFD700'
  msg.style.textShadow = '0 0 20px rgba(0,0,0,0.7)'
  msg.style.pointerEvents = 'none'
  document.body.appendChild(msg)

}, 800)

        }

      }

      renderer.render(scene, camera)

    }

    animate()

    const handleResize = () => {

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)

    }

    window.addEventListener('resize', handleResize)

    return () => {

      window.removeEventListener('resize', handleResize)
      document.body.removeChild(stats.dom)

    }

  }, [])

  return <canvas ref={canvasRef} />

}

export default App