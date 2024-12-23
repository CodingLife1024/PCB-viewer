import './style.css';
import { createSceneComplex } from './complexMoves';

const container = document.body;

// // Create a dropdown for scene selection
// const dropdown = document.createElement('select');
// dropdown.style.position = 'fixed';
// dropdown.style.top = '10px';
// dropdown.style.left = '10px';
// dropdown.style.zIndex = '1000';
// dropdown.style.padding = '5px';
// dropdown.style.backgroundColor = '#bbb';
// document.body.appendChild(dropdown);

// // Define scene options
// const scenes = [
//   {
//     label: 'Scene 1 (GLTF Model of Bedroom)',
//     callback: () => createSceneComplex(container, [
//       { path: '/models/fan.obj', position: { x: 0, y: 6 } },
//       { path: '/models/laird.stl', position: { x: 10, y: 10 } },
//       { path: '/models/laird.wrl', position: { x: -5, y: -5 } },
//       { path: '/models/bed.glb', position: { x: 9.8, y: -8 } },
//     ]),
//   },

// ];

// // Populate dropdown with options
// scenes.forEach((scene, index) => {
//   const option = document.createElement('option');
//   option.value = index.toString();
//   option.textContent = scene.label;
//   dropdown.appendChild(option);
// });

// // Function to clear the container, excluding the dropdown
// function clearContainer() {
//   Array.from(container.children)
//     .filter(child => child !== dropdown)
//     .forEach(child => container.removeChild(child));
// }

// // Handle dropdown change
// dropdown.addEventListener('change', () => {
//   const selectedIndex = parseInt(dropdown.value, 10);
//   clearContainer();
//   scenes[selectedIndex].callback();
// });

// // Set the default scene
// dropdown.value = '0'; // Default to the first scene
// scenes[0].callback();

createSceneComplex(container, [
  { path: '/models/led.wrl', position: { x: 0, y: 6 } },
  { path: '/models/inductor2.wrl', position: { x: 10, y: 10 } },
  { path: '/models/laird.wrl', position: { x: -5, y: -5 } },
  { path: '/models/oscillator2.wrl', position: { x: 9.8, y: -8 } },
])