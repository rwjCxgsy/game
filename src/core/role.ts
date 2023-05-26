import { Interpreter, createMachine, interpret } from "xstate";
import { Entity, Role, StageContext } from "./const";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Hadouken } from "./hadouken";


const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
dracoLoader.setDecoderConfig({ type: "js" });

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export class Robot implements Role, Entity {
    oaction: Record<string, THREE.AnimationAction> = {};

    attackSpeed = 1;

    mesh!: THREE.Object3D;

    gltf!: GLTF;

    action_act!: THREE.AnimationAction;

    speed = 1;

    service: Interpreter<any, any, any, any, any>;

    fsm = createMachine(
        {
            id: "role ----> robot",
            initial: "loading",
            states: {
                loading: {
                    on: {
                        loaded: { target: "idle" },
                    },
                },
                idle: {
                    entry: "playIdle",
                    on: {
                        walk: {target: 'walk'},
                        run: { target: "run" },
                        attack: { target: "attack" },
                        jump: { target: "jump" },
                    },
                    tags: ["canFacing"],
                },
                walk: {
                    entry: "playWalk",
                    on: {
                        run: { target: "run" },
                        stop: { target: "idle" },
                        attack: { target: "attack" },
                        jump: { target: "jump" },
                    },
                    tags: ["canMove", "canFacing"],
                },
                run: {
                    entry: "playRun",
                    on: {
                        walk: {target: 'walk'},
                        stop: { target: "idle" },
                        attack: { target: "attack" },
                        jump: { target: "jump" },
                    },
                    tags: ["canMove", "canFacing"],
                },
                attack: {
                    entry: ["playAttack", 'throwHadouken'],
                    on: {
                        finish: {
                            target: "idle"
                        },
                    },
                },
                jumpAttack: {
                    entry: ["playJumpAttack"],
                    on: {
                        finish: { target: "idle" },
                    },
                    tags: ["canDamage"],
                },
                jump: {
                    entry: ["playJump", "jump"],
                    on: {
                        finish: { target: "idle" },
                        land: { target: "idle" },
                        jump: { target: "doubleJump" },
                    },
                    tags: ["canMove"],
                },
                doubleJump: {
                    entry: ["playJump", "jump"],
                    on: {
                        finish: { target: "idle" },
                        land: { target: "idle" },
                    },
                    tags: ["canMove"],
                },
                dead: {
                    entry: "playDead",
                    type: "final",
                },
            },
        },
        {
            actions: {
                throwHadouken: () => {
                    const hadouken =  new Hadouken(this.mesh.position, this.context)
                    this.hadoukenes.push(hadouken)
                },

                playIdle: () => {
                    this.fadeToAction("idle", 0.2);
                },
                playRun: () => {
                    this.fadeToAction("running", 0.2);
                },
                playWalk: () => {
                    this.fadeToAction('walking', 0.2)
                },
                playAttack: () => {

                    this.oaction["punch"].timeScale = this.attackSpeed;
                    this.fadeToAction("punch", 0.2);
                },



                playJumpAttack: () => {
                    console.log('跳攻击')
                },
                jump: () => {
                    //   this.body.velocity.y = 4
                },
                playJump: () => {
                    this.fadeToAction("jump", 0.2);
                },

                playDead: () => {
                    this.fadeToAction("Death", 0.2);
                },
            },
        }
    );
    tmpVec3 = new THREE.Vector3();

    mixer!: THREE.AnimationMixer;
    timeScale = 1;
    hadoukenes: Hadouken[] = [];

    constructor(public context: StageContext) {
        this.service = interpret(this.fsm).start();
        console.log(this.fsm,  this.service)
    }

    load() {
        return new Promise<THREE.Object3D>((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                "/models/gltf/RobotExpressive/RobotExpressive.glb",
                (gltf: GLTF) => {
                    this.gltf = gltf;
                    this.mesh = this.gltf.scene;

                    this.mesh.traverse((child) => {
                        if (child.type === "Mesh") {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this.mesh.scale.set(0.26, 0.26, 0.26);
                    this.mixer = new THREE.AnimationMixer(this.mesh);
                    gltf.animations.forEach((animation) => {
                        const name = animation.name.toLowerCase();
                        const action = this.mixer.clipAction(animation);
                        this.oaction[name] = action;
                        if (["jump", "punch", "dance"].includes(name)) {
                            action.loop = THREE.LoopOnce;
                        }
                        if (["death"].includes(name)) {
                            action.loop = THREE.LoopOnce;
                            action.clampWhenFinished = true;
                        }
                        this.oaction.dance.timeScale = 3;
                    });
                    this.action_act = this.oaction.idle;
                    this.action_act.play();
                    this.mixer.addEventListener("finished", (event) => {
                        // console.log('finished')
                        this.service.send("finish");
                    });
                    this.service.send("loaded");
                    resolve(this.mesh);
                },
                undefined,
                (event) => {
                    console.error(event);
                    reject();
                }
            );
        });
    }

    update(dt: number, controls: PointerLockControls) {
        if (this.service.state.value === "loading") return;
        this.mixer.update(dt);
        // TODO: 更新位置

        const camera = controls.getObject()

        // 获取相机朝向
        const direct = new THREE.Vector3();
        camera.getWorldDirection(direct);
        direct.y = 0;
        direct.normalize();
        // 相机位置
        const position = camera.position.clone();

        // 设置模型朝向位置
        const aimPosition = position.clone().add(direct.clone().multiplyScalar(8));
        aimPosition.y = 1.5;

        this.mesh.lookAt(aimPosition);

        const modelPosition = direct.clone().multiplyScalar(4);
        position.add(modelPosition);

        position.y = 0;

        this.hadoukenes.forEach(v => {
            v.update()
        })

        this.mesh.position.copy(position);


        // this.mesh.position.set(this.body.position.x, this.body.position.y - this.bodySize, this.body.position.z)
    }

    fadeToAction(name: string, time = 1) {
        console.log(name, time)
        this.action_act.stop();
        this.oaction[name].reset().play();
        this.action_act.timeScale = this.timeScale
        this.action_act = this.oaction[name];
    }
}
