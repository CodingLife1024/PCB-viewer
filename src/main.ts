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
    { position: { x: 18, y: 18 }, radius: 0.3 },
    { position: { x: 17, y: 18 }, radius: 0.3 },
    { position: { x: 16, y: 18 }, radius: 0.3 },
    { position: { x: 15, y: 18 }, radius: 0.3 },
    { position: { x: 14, y: 18 }, radius: 0.3 },
    { position: { x: 18, y: 17 }, radius: 0.3 },
    { position: { x: 17, y: 17 }, radius: 0.3 },
    { position: { x: 16, y: 17 }, radius: 0.3 },
    { position: { x: 15, y: 17 }, radius: 0.3 },
    { position: { x: 14, y: 17 }, radius: 0.3 },

    { position: { x: -18, y: 18 }, radius: 0.6 },
    { position: { x: -18, y: 16 }, radius: 0.6 },
    { position: { x: -18, y: 14 }, radius: 0.6 },
    { position: { x: -18, y: 12 }, radius: 0.6 },
    { position: { x: -18, y: 10 }, radius: 0.6 },
    { position: { x: -18, y: 8 }, radius: 0.6 },
    { position: { x: -15, y: 18 }, radius: 0.6 },
    { position: { x: -15, y: 16 }, radius: 0.6 },
    { position: { x: -15, y: 14 }, radius: 0.6 },
    { position: { x: -15, y: 12 }, radius: 0.6 },
    { position: { x: -15, y: 10 }, radius: 0.6 },
    { position: { x: -15, y: 8 }, radius: 0.6 },
  ]
);
