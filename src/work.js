import { Raycaster, PerspectiveCamera, Vector2, Mesh, BoxGeometry, MeshBasicMaterial} from 'three'

import sha from "js-sha256"
console.log(self);


const ray = new Raycaster()


const camera = new PerspectiveCamera(75, 940 / 927, 0.01, 1000)

camera.position.set(5,5,5)

ray.setFromCamera(new Vector2(), camera)

self.onmessage = function(event) {
    console.log('子线程收到消息：', event.data);
    const list = []

    for (let i = 0; i < 100000; i++) {
      list.push(new Mesh(new BoxGeometry(1, 1), new MeshBasicMaterial({color: 0xff0000})))
    }
    const ray = new Raycaster()
    
    
    const camera = new PerspectiveCamera(75, 940 / 927, 0.01, 1000)
    
    camera.lookAt(0, 0, 0)
    camera.position.set(5,5,5)
    
    ray.setFromCamera(new Vector2(0, 0), camera)
    
    console.time('start')
    const d = ray.intersectObjects(list)
    console.timeEnd('start')
    self.postMessage('get✔');
}
self.onerror = function (err) {
    console.log('子线程异常：', err);
}
