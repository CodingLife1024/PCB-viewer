import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';

/**
 * Initializes and renders a Three.js scene with multiple models, axes, and a plane.
 * @param container The HTML element where the scene will be rendered.
 * @param models An array of objects containing model paths, file types, and positions.
 */
export function createSceneComplex(
  container: HTMLElement,
  models: { path: string; position: { x: number; y: number } }[]
): void {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Fix ambient light intensity
  const ambientLight = new THREE.AmbientLight(0x404040, 10); // Changed from 100 to 1
  scene.add(ambientLight);

  // Fixed point light configurations
  const pointLights: { position: [number, number, number]; intensity: number }[] = [
    { position: [10, 10, 10], intensity: 50 },
    { position: [-10, 10, 10], intensity: 50 },
    { position: [10, -10, 10], intensity: 50 },
    { position: [10, 10, -10], intensity: 50 },
    { position: [10, -10, -10], intensity: 50 },
    { position: [-10, 10, -10], intensity: 50 },
    { position: [-10, -10, 10], intensity: 50 },
    { position: [-10, -10, -10], intensity: 50 },
    { position: [0, 0, 0], intensity: 50 },
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

  // Add green plane along the x-y plane
  const planeGeometry = new THREE.PlaneGeometry(40, 40);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x40573e, side: THREE.DoubleSide }); // Updated color
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const planeWidth = 40;
  const planeHeight = 40;
  const planeDepth = 0.5; // Elevation to make it 3D (not a flat plane)
  const borderRadius = 100; // Round the corners
  const roundedSegments = 4; // Number of segments for rounded edges (more segments = smoother curve)


  const roundedPlaneGeometry = new RoundedBoxGeometry(planeWidth, planeDepth, planeHeight, roundedSegments, borderRadius);
  const roundedPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x40573e }); // Green color
  const roundedPlane = new THREE.Mesh(roundedPlaneGeometry, roundedPlaneMaterial);

  // Position and rotate the plane
  roundedPlane.position.y = -planeDepth / 2 - 0.01; // Adjust to lower slightly
  scene.add(roundedPlane);

  const roundedPlaneGeometryGrey = new RoundedBoxGeometry(planeWidth, planeDepth, planeHeight, roundedSegments, borderRadius);
  const roundedPlaneMaterialGrey = new THREE.MeshBasicMaterial({ color: 0xA9A9A9 }); // Grey color
  const roundedPlaneGrey = new THREE.Mesh(roundedPlaneGeometryGrey, roundedPlaneMaterialGrey);

  // Position and rotate the plane
  roundedPlaneGrey.position.y = -planeDepth; // Adjust to lower slightly
  scene.add(roundedPlaneGrey);

  // Load models
  models.forEach(({ path, position }) => {
    const fileExtension = path.split('.').pop() || '';

    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          const bbox = new THREE.Box3().setFromObject(model);
          const minZ = bbox.min.z;
          const zLength = bbox.max.z - bbox.min.z;
          model.position.set(position.x, -zLength / 2 - minZ, position.y);
          model.rotation.x = -Math.PI / 2;
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
          const stlBBox = new THREE.Box3().setFromObject(mesh);
          const stlMinZ = stlBBox.min.z;
          mesh.rotateX(-Math.PI / 2);
          mesh.position.set(position.x, -stlMinZ, position.y);
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
          const objMinZ = objBBox.min.z;
          object.position.set(position.x, -objMinZ, position.y);
          object.scale.set(1, 1, 1);
          object.rotation.x = -Math.PI / 2;
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
          const wrlMinZ = wrlBBox.min.z;
          object.position.set(position.x, -wrlMinZ, position.y);
          object.scale.set(1, 1, 1);
          object.rotation.x = -Math.PI / 2;
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