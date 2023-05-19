import { Raycaster, Mesh, BoxGeometry, MeshBasicMaterial, PerspectiveCamera, Vector2} from 'three'

// import { spawn, Thread } from "threads"
import {GPU} from 'gpu.js'






// import MyWorker from "./work.js?worker"

// console.log(MyWorker)

// // const b = new Blob([work], {
// //   type: 'application/javascript'
// // })




// // const worker: Worker = MyWorker()





// // worker.onmessage = (message) => {
// //   console.log(message)
// // }

// // worker.onerror = (onerror) => {
// //   console.log(onerror)
// // }
// const list = []

// for (let i = 0; i < 100000; i++) {
//   list.push(new Mesh(new BoxGeometry(1, 1), new MeshBasicMaterial({color: 0xff0000})))
// }
// const ray = new Raycaster()


// const camera = new PerspectiveCamera(75, 940 / 927, 0.01, 1000)

// camera.lookAt(0, 0, 0)
// camera.position.set(5,5,5)

// ray.setFromCamera(new Vector2(0, 0), camera)

// console.time('start')
// // const d = ray.intersectObjects(list)
// console.timeEnd('start')

// setInterval(() => {
//   console.log('set time')
// }, 10);
// // worker.postMessage([])


const gpu = new GPU();
const multiplyMatrix = gpu.createKernel(function(a: number[][], b: number[][]) {
  let sum = 0;
  for (let i = 0; i < 512; i++) {
    sum += a[this.thread.y][i] * b[i][this.thread.x];
  }
  return sum;
}).setOutput([512, 512]);

const c = multiplyMatrix([[2, 3, 4, 5]], [[2, 1, 0, -2]]) as number[][];

console.log(c)




// console.log("Hashed password:", hashed)


// async function setup () {


//   console.log('setup')

//   const auth = await spawn(worker)


//   console.log(auth)
//   const hashed = await auth.hashPassword("Super secret password", "1234")
//   console.log(hashed)
//   // await Thread.terminate(auth)
// }

// setup()