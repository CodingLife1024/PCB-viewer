import './style.css';
import { renderer } from './renderer'

const container = document.body;

renderer(
  container,
  [
    { path: '/models/led.wrl', position: { x: 0, y: 6 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/diode.wrl', position: { x: 17, y: 10 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/laird.wrl', position: { x: -5, y: -5 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/inductor2.wrl', position: { x: 17, y: 4 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
    { path: '/models/inductor2.wrl', position: { x: 17, y: -4 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
    { path: '/models/inductor2.wrl', position: { x: 17, y: 0 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
  ],
  [
    { position: { x: 5, y: 5 }, radius: 1 },
    { position: { x: -10, y: -8 }, radius: 1 },
  ]
);
