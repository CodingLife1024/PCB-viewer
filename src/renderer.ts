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

  // Create axis labels
  const axisLabels = [
    { text: 'X', position: new THREE.Vector3(52, 0, 0), color: 0xff0000 }, // Red for X
    { text: 'Y', position: new THREE.Vector3(0, 52, 0), color: 0x00ff00 }, // Green for Y
    { text: 'Z', position: new THREE.Vector3(0, 0, 52), color: 0x0000ff }  // Blue for Z
  ];

  const labelMaterial = axisLabels.map(label =>
    new THREE.MeshBasicMaterial({ color: label.color })
  );

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

      axisLabels.forEach((label, index) => {
        const textGeometry = new TextGeometry(label.text, {
          font: font,
          size: 3,
          height: 0.2,
          curveSegments: 12,
        });

        const textMesh = new THREE.Mesh(textGeometry, labelMaterial[index]);
        textMesh.position.copy(label.position);

        // Make text always face the camera
        textMesh.userData.type = 'axisLabel';
        scene.add(textMesh);
      });

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

    // Process each segment between consecutive points
    for (let i = 0; i < points.length - 1; i++) {
        const start = new THREE.Vector2(points[i].x, points[i].y);
        const end = new THREE.Vector2(points[i + 1].x, points[i + 1].y);

        // Calculate direction and perpendicular vector for rectangle width
        const direction = new THREE.Vector2().subVectors(end, start);
        const length = direction.length();
        direction.normalize();

        // Calculate perpendicular vector for thickness
        const perpendicular = new THREE.Vector2(-direction.y, direction.x).multiplyScalar(thickness / 2);

        // Calculate the four corners of the rectangle
        const corners = [
            new THREE.Vector3(start.x + perpendicular.x, pcbDepth + 0.01, start.y + perpendicular.y),
            new THREE.Vector3(start.x - perpendicular.x, pcbDepth + 0.01, start.y - perpendicular.y),
            new THREE.Vector3(end.x - perpendicular.x, pcbDepth + 0.01, end.y - perpendicular.y),
            new THREE.Vector3(end.x + perpendicular.x, pcbDepth + 0.01, end.y + perpendicular.y)
        ];

        // Create geometry for the rectangle
        const geometry = new THREE.BufferGeometry();

        // Define vertices for two triangles forming the rectangle
        const vertices = new Float32Array([
            // First triangle
            corners[0].x, corners[0].y, corners[0].z,
            corners[1].x, corners[1].y, corners[1].z,
            corners[2].x, corners[2].y, corners[2].z,
            // Second triangle
            corners[0].x, corners[0].y, corners[0].z,
            corners[2].x, corners[2].y, corners[2].z,
            corners[3].x, corners[3].y, corners[3].z,
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // Calculate face normals
        geometry.computeVertexNormals();

        // Create material and mesh
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700, // Gold color
            side: THREE.DoubleSide // Make the rectangle visible from both sides
        });

        const rectangleMesh = new THREE.Mesh(geometry, material);
        scene.add(rectangleMesh);
    }
});


  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    scene.traverse((object) => {
      if (object.userData.type === 'axisLabel') {
        object.quaternion.copy(camera.quaternion);
      }
    });
    updateCameraAndControls();
  }

  animate();
}
