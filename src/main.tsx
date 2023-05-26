import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";


// import { Player } from "./state/game.ts";

import "./index.css";
import { Entity, StageContext } from "./core/const.ts";
import { Robot } from "./core/role.ts";
import { RoleControls } from "./core/roleControls.ts";

const clock = new THREE.Clock();

// 创建场景
const scene = new THREE.Scene();


scene.background = new THREE.Color(0xe0e0e0);
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

const grid = new THREE.GridHelper(10000, 1000, new THREE.Color(0xffffff));
grid.position.y = 0.03;
scene.add(grid);

// lights

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(0, 20, 10);
scene.add(dirLight);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshPhongMaterial({ color: new THREE.Color(0xaaaaaa) }));


ground.receiveShadow = true

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

camera.position.set(0, 2, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

controls.maxPolarAngle = (Math.PI / 5) * 3;
controls.minPolarAngle = Math.PI / 2;

controls.addEventListener("lock", function () {
    // menu.style.display = 'none';
});

controls.addEventListener("unlock", function () {
    // menu.style.display = 'block';
});


renderer.domElement.addEventListener("click", () => {
    controls.lock();
});

const stageContext: StageContext = {
    scene, controls
}

const updateList: Entity[] = [];

const robot = new Robot(stageContext);

robot.load().then((obj) => {
    scene.add(obj);
});

updateList.push(robot);

const roleControls =  new RoleControls(robot)
updateList.push(roleControls)


const helper = new THREE.AxesHelper(1000)

helper.position.y = 0.02
scene.add(helper);

scene.add(new THREE.AmbientLight(0xffffff, 1));
scene.add(new THREE.DirectionalLight(0xffffff, 1));

function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();

    updateList.forEach((role) => {
        role.update(dt, controls);
    });

    renderer.render(scene, camera);
}

animate();
