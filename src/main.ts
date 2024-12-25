import './style.css';
import { renderer } from './renderer'

const container = document.body;

renderer(
  container,
  [
    { path: '/models/led.wrl', position: { x: 0, z: 6 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/diode.wrl', position: { x: 17, z: 10 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/laird.wrl', position: { x: -5, z: -5 }, rotation: { x: -0.5, y: 0, z: 0 } },
    { path: '/models/inductor2.wrl', position: { x: 17, z: 4 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
    { path: '/models/inductor2.wrl', position: { x: 17, z: -4 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
    { path: '/models/inductor2.wrl', position: { x: 17, z: 0 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
    { path: '/models/microcontroller.wrl', position: { x: 8, z: -14 }, rotation: { x: -0.5, y: 0, z: 0.5 } },
  ],
  [
    { position: { x: 18, z: 18 }, radius: 0.3 },
    { position: { x: 17, z: 18 }, radius: 0.3 },
    { position: { x: 16, z: 18 }, radius: 0.3 },
    { position: { x: 15, z: 18 }, radius: 0.3 },
    { position: { x: 14, z: 18 }, radius: 0.3 },
    { position: { x: 18, z: 17 }, radius: 0.3 },
    { position: { x: 17, z: 17 }, radius: 0.3 },
    { position: { x: 16, z: 17 }, radius: 0.3 },
    { position: { x: 15, z: 17 }, radius: 0.3 },
    { position: { x: 14, z: 17 }, radius: 0.3 },

    { position: { x: -18, z: 18 }, radius: 0.6 },
    { position: { x: -18, z: 16 }, radius: 0.6 },
    { position: { x: -18, z: 14 }, radius: 0.6 },
    { position: { x: -18, z: 12 }, radius: 0.6 },
    { position: { x: -18, z: 10 }, radius: 0.6 },
    { position: { x: -18, z: 8 }, radius: 0.6 },
    { position: { x: -15, z: 18 }, radius: 0.6 },
    { position: { x: -15, z: 16 }, radius: 0.6 },
    { position: { x: -15, z: 14 }, radius: 0.6 },
    { position: { x: -15, z: 12 }, radius: 0.6 },
    { position: { x: -15, z: 10 }, radius: 0.6 },
    { position: { x: -15, z: 8 }, radius: 0.6 },
  ],
  [
    { text: "Riddhidipta Pal", position: { x: -15, z: -15 }, angle: 0, size: 1 },
    { text: "https://pcb-viewer.netlify.app/", position: { x: -18, z: 0 }, angle: 0.5 , size: 1 },
  ],
  [
    {
      points: [
        { x: 15, z: 15 },
        { x: 10, z: 15 },
        { x: 5, z: 10 },
        { x: 5, z: 5 },
        { x: 0, z: 0 }
      ],
      thickness: 0.12
    },
    {
      points: [
        { x: 15, z: 16 },
        { x: 9, z: 16 },
        { x: 4, z: 11 },
        { x: 4, z: 5 },
        { x: -1, z: 0 }
      ],
      thickness: 0.18
    },
    {
      points: [
        { x: 15, z: 17 },
        { x: 8, z: 17 },
        { x: 3, z: 12 },
        { x: 3, z: 5 },
        { x: -2, z: 0 }
      ],
      thickness: 0.18
    },
    {
      points: [
        { x: -15, z: 18 },
        { x: -8, z: 18 },
        { x: -5, z: 15 },
        { x: 0, z: 15 },
        { x: 0, z: 6 },
      ],
      thickness: 0.18
    },
  ]
);
