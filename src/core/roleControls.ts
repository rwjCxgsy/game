
import { Entity, Role } from './const'

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

class RoleControls implements Entity {
  holdKey: Record<string, boolean> = {}
  tickKey: Record<string, boolean> = {}
  seqKey: any[] = []
  timeoutSeqKey = null
  prevTime = 0

  // TODO: RoleControls should update before role, otherwise role.mesh.position will delay one frame after role.body.position.


  constructor(public role: Role) {




    window.addEventListener('keydown', (event) => {
      if (this.holdKey[event.code]) return 
      this.holdKey[event.code] = true
      this.tickKey[event.code] = true

    })
    window.addEventListener('keyup', (event) => {
      this.holdKey[event.code] = false

      switch (event.code) {
        case 'KeyJ':
        case 'Numpad4':
          this.role.service.send('keyJUp')
          break
        case 'KeyU':
        case 'Numpad7':
          this.role.service.send('keyUUp')
          break
        case 'KeyL':
        case 'Numpad6':
          this.role.service.send('keyLUp')
          this.seqKey.length = 0
          break
        case 'KeyO':
        case 'Numpad9':
          this.role.service.send('keyOUp')
          this.seqKey.length = 0
          break
      }
    })

    window.addEventListener('click', () => {
      console.log('click')
      this.tickKey['Numpad4'] = true
      this.holdKey['Numpad4'] = true
    })
  }

  update(dt: number, controls: PointerLockControls) {



    // if (Object.keys(this.holdKey)?.length) {
      
    //   console.log(Object.keys(this.holdKey))
    // }

    if ((this.tickKey.KeyJ || this.tickKey.Numpad4) && (this.tickKey.KeyK || this.tickKey.Numpad5) && (this.tickKey.KeyL || this.tickKey.Numpad6)) {
      // this.role.pop?.pop() // Whether need use: this.role.service.send('pop') ?
    } else {
      switch (
        Object.keys(this.tickKey)[0] // note: The order of Object.keys may not by added order, but should no big problem.
      ) {
        case 'KeyJ':
        case 'Numpad4':
          this.role.service.send('attack')
          break
        case 'KeyK':
        case 'Space':
          this.role.service.send('jump')
          break
        case 'KeyI':
        case 'Numpad8':
          this.role.service.send('dash')
          break
        case 'KeyU':
        case 'Numpad7':
          this.role.service.send('bash')
          break
        case 'KeyL':
        case 'Numpad6':
          this.role.service.send('block')
          break
        case 'KeyO':
        case 'Numpad9':
          this.role.service.send('launch')
          break
      }
    }

    // const direction = new THREE.Vector2()

    let forward = false;
    let backward = false;
    let left = false;
    let right = false;

    // this.role.direction.set(0, 0)
    if (this.holdKey.KeyW || this.holdKey.ArrowUp) forward = true // todo: performance.
    if (this.holdKey.KeyS || this.holdKey.ArrowDown) backward = true
    if (this.holdKey.KeyA || this.holdKey.ArrowLeft) left = true
    if (this.holdKey.KeyD || this.holdKey.ArrowRight) right = true

    // if (this.role.service.state.hasTag('canMove')) {
    //   if (directionLengthSq > 0) {
    //     this.role.facing.copy(this.role.direction)
    //   }
    //   this.role.mesh.rotation.y = -this.role.facing.angle() + Math.PI / 2

    // }


    const FBDistance = Number(forward) - Number(backward);
    const LRDistance = Number(left) - Number(right);





    if (FBDistance !==0) {
      this.role.timeScale = FBDistance
      if (this.holdKey.ShiftLeft) {
        this.role.service.send('run')
      } else {
        this.role.service.send('walk')
      }
    } else {
      this.role.service.send('stop')
    }

    this.tickKey = {}

    controls.moveForward(FBDistance / (this.holdKey.ShiftLeft ? 3 : 5))
    // controls.moveRight(LRDistance / 5)
  }
  setRole(role: any) {
    this.role = role
  }
}

export { RoleControls }
