import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
import { createPCBWithHoles } from './createPCBPlane';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Correct import for FontLoader
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; // Correct import for TextGeometry

/**
 * Initializes and renders a Three.js scene with multiple models, axes, and a plane.
 * @param container The HTML element where the scene will be rendered.
 * @param models An array of objects containing model paths, file types, and positions.
 * @param holes An array of objects containing hole positions and radii.
 * @param text An array of objects containing text strings and positions.
 */
export function renderer(
  container: HTMLElement,
  models: { path: string; position: { x: number; y: number }, rotation: { x: number; y: number; z: number, } }[],
  holes: { position: { x: number; y: number }, radius: number }[],
  text: { text: string; position: { x: number; y: number, }; angle: number; size: number }[],
  wiringPaths: { points: { x: number; y: number }[]; thickness: number }[],
): void {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create PCB with holes
  const pcbWidth = 40;
  const pcbHeight = 40;
  const pcbDepth = 0.6; // Use your defined planeDepth or any other value

  const pcbMesh = createPCBWithHoles(pcbWidth, pcbHeight, pcbDepth, holes);
  scene.add(pcbMesh);

  // Ambient light and its intensity
  const ambientLight = new THREE.AmbientLight(0x404040, 20);
  scene.add(ambientLight);

  // Fixed point light configurations
  const pointLights: { position: [number, number, number]; intensity: number }[] = [
    { position: [10, 10, 10], intensity: 200 }, // Increase intensity for testing
    { position: [-10, 10, 10], intensity: 200 },
    { position: [10, -10, 10], intensity: 200 },
    { position: [10, 10, -10], intensity: 200 },
    { position: [10, -10, -10], intensity: 200 },
    { position: [-10, 10, -10], intensity: 200 },
    { position: [-10, -10, 10], intensity: 200 },
    { position: [-10, -10, -10], intensity: 200 },
    { position: [0, 0, 0], intensity: 200 },
    { position: [0, 20, 0], intensity: 200 },
    { position: [25, 0, 0], intensity: 200 },
    { position: [0, 0, 25], intensity: 200 },
    { position: [-25, 0, 0], intensity: 200 },
    { position: [0, 0, -25], intensity: 200 },
];


  pointLights.forEach((lightConfig) => {
    const pointLight = new THREE.PointLight(0xffffff, lightConfig.intensity);
    pointLight.position.set(...lightConfig.position);

    // Add helper to visualize the light position
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);
    scene.add(pointLight);
  });

  // Load models
  models.forEach(({ path, position, rotation }) => {
    const fileExtension = path.split('.').pop() || '';

    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.rotation.x = Math.PI * rotation.x;
          model.rotation.y = Math.PI * rotation.y;
          model.rotation.z = Math.PI * rotation.z;
          const bbox = new THREE.Box3().setFromObject(model);
          const minZ = bbox.min.z;
          const zLength = bbox.max.z - bbox.min.z;
          model.position.set(position.x, -zLength / 2 - minZ + pcbDepth, position.y);
          model.scale.set(1, 1, 1);
          scene.add(model);
        },
        undefined,
        (error) => console.error('Error loading GLTF/GLB model:', error)
      );
    } else if (fileExtension === 'stl') {
      const stlLoader = new STLLoader();
      stlLoader.load(
        path,
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotateX(Math.PI * rotation.x);
          mesh.rotateY(Math.PI * rotation.y);
          mesh.rotateZ(Math.PI * rotation.z);
          const stlBBox = new THREE.Box3().setFromObject(mesh);
          const stlMinZ = stlBBox.min.z;
          mesh.position.set(position.x, -stlMinZ + pcbDepth, position.y);
          mesh.scale.set(1, 1, 1);
          scene.add(mesh);
        },
        undefined,
        (error) => console.error('Error loading STL model:', error)
      );
    } else if (fileExtension === 'obj') {
      const objLoader = new OBJLoader();
      objLoader.load(
        path,
        (object) => {
          const objBBox = new THREE.Box3().setFromObject(object);
          object.rotation.x = Math.PI * rotation.x;
          object.rotation.y = Math.PI * rotation.y;
          object.rotation.z = Math.PI * rotation.z;
          const objMinZ = objBBox.min.z;
          object.position.set(position.x, -objMinZ + pcbDepth, position.y);
          object.scale.set(1, 1, 1);
          scene.add(object);
        },
        undefined,
        (error) => console.error('Error loading OBJ model:', error)
      );
    } else if (fileExtension === 'wrl') {
      const vrmlLoader = new VRMLLoader();
      vrmlLoader.load(
        path,
        (object) => {
          const wrlBBox = new THREE.Box3().setFromObject(object);
          object.rotation.x = Math.PI * rotation.x;
          object.rotation.y = Math.PI * rotation.y;
          object.rotation.z = Math.PI * rotation.z;
          const wrlMinZ = wrlBBox.min.z;
          object.position.set(position.x, -wrlMinZ + pcbDepth, position.y);
          object.scale.set(1, 1, 1);
          scene.add(object);
        },
        undefined,
        (error) => console.error('Error loading WRL model:', error)
      );
    } else {
      console.error('Unsupported file format:', fileExtension);
    }
  });

  // Add axes
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // OrbitControls for camera movement
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.autoRotate = false;
  controls.target.set(0, 0, 0);

  // Update camera and controls
  function updateCameraAndControls() {
    controls.update();
    renderer.render(scene, camera);
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Load font and create text
  const fontLoader = new FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    text.forEach(({ text: message, position, angle, size }) => {
      const textGeometry = new TextGeometry(message, {
        font: font,
        size: size, // Font size
        height: 0.01,  // Depth of the text
        curveSegments: 12, // Smoothness of the curve
      });

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Rotate the text by -Math.PI / 2 on the X-axis
      textMesh.rotateX(-Math.PI / 2);
      textMesh.rotateZ(Math.PI * angle);
      // textMesh.rotateZ(Math.PI * rotation.y);

      // Position the text
      textMesh.position.set(position.x, pcbDepth, position.y); // Fixed z-coordinate 10
      scene.add(textMesh);
    });
  });

  wiringPaths.forEach((wiringPath) => {
    const { points, thickness } = wiringPath;

    // Create a geometry for the wire
    const wireGeometry = new THREE.BufferGeometry();

    // Convert points to THREE.Vector3 and align with PCB height
    const vertices = points.flatMap(({ x, y }) => [x, pcbDepth + thickness, y]);

    // Set vertices for geometry
    wireGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create a mesh with a cylinder to represent thickness
    for (let i = 0; i < points.length - 1; i++) {
      const start = new THREE.Vector3(points[i].x, pcbDepth + thickness, points[i].y);
      const end = new THREE.Vector3(points[i + 1].x, pcbDepth + thickness, points[i + 1].y);

      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      direction.normalize();

      // Create a cylinder for the wire segment
      const cylinderGeometry = new THREE.CylinderGeometry(
          thickness, // radiusTop
          thickness, // radiusBottom
          length,    // height
          8          // radialSegments
      );
      const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 }); // Gold color
      const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

      // Orient the cylinder along the line
      const axis = new THREE.Vector3(0, 1, 0); // Y-axis
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());
      cylinderMesh.quaternion.copy(quaternion);

      // Position the cylinder at the midpoint of the segment
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      cylinderMesh.position.copy(midpoint);

      // Add the segment to the scene
      scene.add(cylinderMesh);
    }
  });


  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateCameraAndControls();
  }

  animate();
}
