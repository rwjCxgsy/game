import * as THREE from "three";
import { Interpreter, createMachine, interpret } from "xstate";
import { Entity, StageContext } from "./const";

export class Hadouken implements Entity {
    speed = 0.5;


    service: Interpreter<any, any, any, any, any>;


    movement = 1

    fsm = createMachine(
        {
            id: "hadouken",
            initial: "move",
            states: {
                move: {
                    on: {
                        rebound: { target: "rebound" },
                    },
                    after: {
                        2000: { target: "dispose" },
                    },
                },
                rebound: {
                    entry: "entryRebound",
                    after: {
                        1000: { target: "dispose" },
                    },
                },
                dispose: {
                    entry: "entryDispose",
                },
            },
        },
        {
            actions: {
                entryDispose: () => {
                    this.dispose();
                },
                entryRebound: () => {
                    console.log('返回')
                    this.movement = -1
                },
            },
        }
    );


    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({color: 'cyan'}))
    

    /**
     * 方向
     *
     * @memberof Hadouken
     */
    dir3 = new THREE.Vector3()
    position: THREE.Vector3;

    constructor(public rootPosition: THREE.Vector3, public context: StageContext) {
        
        const position = this.position = rootPosition.clone()

        context.controls.getObject().getWorldDirection(this.dir3)
        this.dir3.normalize()

        this.service = interpret(this.fsm);
        this.service.start();

        this.mesh.position.copy(position)
        this.mesh.position.y = 1
        setTimeout(() => {
            this.service.send("rebound");
        }, 1000)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        context.scene.add(this.mesh)
    }

    dispose = () => {
        this.mesh.visible = false
        console.log("dispose ---> 销毁");
        this.mesh.parent?.remove(this.mesh)
        this.mesh.material.dispose()
        this.mesh.geometry.dispose()
    };

    update() {
        if (this.movement < 0) {
            const dir = this.mesh.position.clone().sub(this.rootPosition.clone())
            if (dir.length() < 2) {
                this.mesh.visible = false
            }
            this.dir3 = dir.normalize()
        }
        const p = this.dir3.clone().multiplyScalar(this.movement / 2)

        this.position.add(p)
        this.mesh.position.copy(this.position)
        this.mesh.position.y = 1

    }
}
