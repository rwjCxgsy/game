// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )


import shaders from './shader.glsl?raw'


const canvas = document.querySelector('#canvas') as HTMLCanvasElement


const vertices = new Float32Array([
  0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1, 0,
  0, 1, 1,
]);

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength, // make it big enough to store vertices in
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

async function setup () {
  const gpu = navigator.gpu as GPU
  if (gpu) {
    const adapter = await gpu.requestAdapter();
    const device = await adapter!.requestDevice();


    const context = canvas.getContext('webgpu')!

    const shaderModule = device.createShaderModule({
      code: shaders,
    });

    context.configure({
      device: device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "premultiplied",
    });
  }
}

setup()