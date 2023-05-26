import { createMachine } from "xstate";
// const fsm = createMachine(
//     {
//         id: "paladin",
//         initial: "loading",
//         states: {
//             loading: {
//                 on: {
//                     loaded: { target: "idle" },
//                 },
//             },
//             idle: {
//                 entry: "playIdle",
//                 on: {
//                     walk: {target: 'walk'},
//                     run: { target: "run" },
//                     attack: { target: "attack" },
//                     jump: { target: "jump" },
//                 },
//                 tags: ["canFacing"],
//             },
//             walk: {
//                 entry: "playWalk",
//                 on: {
//                     run: { target: "run" },
//                     stop: { target: "idle" },
//                     attack: { target: "attack" },
//                     jump: { target: "jump" },
//                 },
//                 tags: ["canMove", "canFacing"],
//             },
//             run: {
//                 entry: "playRun",
//                 on: {
//                     walk: {target: 'walk'},
//                     stop: { target: "idle" },
//                     attack: { target: "attack" },
//                     jump: { target: "jump" },
//                 },
//                 tags: ["canMove", "canFacing"],
//             },
//             attack: {
//                 entry: ["playAttack", 'throwHadouken'],
//                 on: {
//                     finish: {
//                         target: "idle"
//                     },
//                 },
//             },
//             jumpAttack: {
//                 entry: ["playJumpAttack"],
//                 on: {
//                     finish: { target: "idle" },
//                 },
//                 tags: ["canDamage"],
//             },
//             jump: {
//                 entry: ["playJump", "jump"],
//                 on: {
//                     finish: { target: "idle" },
//                     land: { target: "idle" },
//                     jump: { target: "doubleJump" },
//                 },
//                 tags: ["canMove"],
//             },
//             doubleJump: {
//                 entry: ["playJump", "jump"],
//                 on: {
//                     finish: { target: "idle" },
//                     land: { target: "idle" },
//                 },
//                 tags: ["canMove"],
//             },
//             dead: {
//                 entry: "playDead",
//                 type: "final",
//             },
//         },
//     },
//     {
//         actions: {
//             throwHadouken: () => {
//                 // const hadouken =  new Hadouken(this.mesh.position, this.context)
//                 // this.hadoukenes.push(hadouken)
//             },

//             playIdle: () => {
//                 this.fadeToAction("idle", 0.2);
//             },
//             playRun: () => {
//                 this.fadeToAction("running", 0.2);
//             },
//             playWalk: () => {
//                 this.fadeToAction('walking', 0.2)
//             },
//             playAttack: () => {

//                 this.oaction["punch"].timeScale = this.attackSpeed;
//                 this.fadeToAction("punch", 0.2);
//             },



//             playJumpAttack: () => {
//                 console.log('跳攻击')
//             },
//             jump: () => {
//                 //   this.body.velocity.y = 4
//             },
//             playJump: () => {
//                 this.fadeToAction("jump", 0.2);
//             },

//             playDead: () => {
//                 this.fadeToAction("Death", 0.2);
//             },
//         },
//     }
// );


const fsm = createMachine()