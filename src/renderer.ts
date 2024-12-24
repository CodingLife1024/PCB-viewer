import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
import { createPCBWithHoles } from './createPCBPlane';

/**
 * Initializes and renders a Three.js scene with multiple models, axes, and a plane.
 * @param container The HTML element where the scene will be rendered.
 * @param models An array of objects containing model paths, file types, and positions.
 * @param holes An array of objects containing hole positions and radii.
 */
export function renderer(
  container: HTMLElement,
  models: { path: string; position: { x: number; y: number }, rotation: { x: number; y: number; z: number } }[],
  holes: { position: { x: number; y: number }, radius: number }[]
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

  // Fix ambient light intensity
  const ambientLight = new THREE.AmbientLight(0x404040, 50);
  scene.add(ambientLight);

  // Fixed point light configurations
  const pointLights: { position: [number, number, number]; intensity: number }[] = [
    { position: [10, 10, 10], intensity: 100 }, // Increase intensity for testing
    { position: [-10, 10, 10], intensity: 100 },
    { position: [10, -10, 10], intensity: 100 },
    { position: [10, 10, -10], intensity: 100 },
    { position: [10, -10, -10], intensity: 100 },
    { position: [-10, 10, -10], intensity: 100 },
    { position: [-10, -10, 10], intensity: 100 },
    { position: [-10, -10, -10], intensity: 100 },
    { position: [0, 0, 0], intensity: 100 },
];


  pointLights.forEach((lightConfig) => {
    const pointLight = new THREE.PointLight(0xffffff, lightConfig.intensity);
    pointLight.position.set(...lightConfig.position);

    // Add helper to visualize the light position
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLight);
    // scene.add(pointLightHelper);
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

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateCameraAndControls();
  }

  animate();
}
