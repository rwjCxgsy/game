import { Object3D } from "three";
import { Interpreter, StateMachine } from "xstate";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export abstract class Role {


    abstract timeScale?: number

    abstract speed: number

    abstract fsm: StateMachine<any, any, any>

    abstract update (dt: number, controls: PointerLockControls): void;


    abstract load(): Promise<Object3D>;

    abstract service: Interpreter<any, any, any, any, any>
}

export abstract class Entity {
    abstract update (dt: number, controls: PointerLockControls): void;
}


export interface StageContext {
    scene: THREE.Scene;
    controls: PointerLockControls;
}