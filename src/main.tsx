import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


console.log(window.THREE = THREE)

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);


camera.position.set(5,5,5)

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)

controls.rotateSpeed = 1.5
controls.enableDamping = true


// 创建立方体的几何体
const geometry = new THREE.BoxGeometry(2, 1, 3);

// 创建立方体的材质
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// 创建立方体的网格对象
const cube = new THREE.Mesh(geometry, material);

window.cube = cube

// 将立方体添加到场景中
scene.add(cube);


scene.add(new THREE.AxesHelper(10))


scene.add(new THREE.AmbientLight(0x404040, 1));


function animate() {
  requestAnimationFrame(animate);

  // 旋转立方体

  renderer.render(scene, camera);
}

animate()