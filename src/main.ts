import './style.css';
import { renderer } from './renderer'

const container = document.body;

renderer(container, [
  { path: '/models/led.wrl', position: { x: 0, y: 6 } },
  { path: '/models/inductor2.wrl', position: { x: 10, y: 10 } },
  { path: '/models/laird.wrl', position: { x: -5, y: -5 } },
  { path: '/models/oscillator2.wrl', position: { x: 9.8, y: -8 } },
])