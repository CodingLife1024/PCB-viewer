# PCB Viewer

A sophisticated 3D PCB visualization application leveraging Three.js for rendering printed circuit boards with components, traces, and annotations in real-time.

## Technical Overview

### Core Architecture
- **Rendering Engine**: Three.js WebGL renderer with custom geometry processing
- **Component System**: Modular architecture for PCB elements (board, components, traces)
- **Asset Pipeline**: Multi-format 3D model support with automated positioning system
- **Scene Management**: Dynamic scene graph with optimized batch rendering

### Key Features
- **PCB Generation Engine**
  - Parametric PCB mesh generation with configurable dimensions
  - Dynamic hole placement using Three.js Path and Shape systems
  - Extrusion-based geometry with customizable depth and bevel settings
  - Material system with PBR (Physically Based Rendering) support

- **3D Model Integration**
  - Multi-format loader system supporting:
    - GLB (GL Transmission Format)
    - STL (Stereolithography)
    - OBJ (Wavefront)
    - VRML/WRL (Virtual Reality Modeling Language)
  - Automated model positioning with bounding box calculations
  - Dynamic scale and rotation management
  - Collision detection and prevention system

- **Trace Visualization**
  - Vector-based path generation with thickness control
  - Dynamic tessellation for curved paths
  - Optimized geometry batching for performance
  - Start/end pad generation with circular geometry

- **Scene Optimization**
  - Optimized lighting with multiple point lights
  - Efficient camera controls with damping

## Technical Implementation

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Core Components

#### PCB Generation
```typescript
createPCBWithHoles(
  width: number,
  height: number,
  depth: number,
  holes: Array<{
    position: { x: number; z: number },
    radius: number
  }>
): THREE.Mesh
```

#### Scene Configuration

```typescript
interface ModelConfig {
  path: string;
  position: { x: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface HoleConfig {
  position: { x: number; z: number };
  radius: number;
}

interface TextConfig {
  text: string;
  position: { x: number; z: number };
  angle: number;
  size: number;
}

interface WiringConfig {
  points: Array<{ x: number; z: number }>;
  thickness: number;
}
```

### Example Implementation

```typescript
renderer(
  container: HTMLElement,
  models: ModelConfig[],
  holes: HoleConfig[],
  text: TextConfig[],
  wiringPaths: WiringConfig[]
): void {
  // Scene initialization
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  
  // PCB generation
  const pcbMesh = createPCBWithHoles(40, 40, 0.6, holes);
  
  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040, 20);
  const pointLights = generatePointLights();
  
  // Model loading and positioning
  initializeModels(models);
  
  // Trace generation
  generateWiringPaths(wiringPaths);
  
  // Text annotation system
  initializeTextSystem(text);
  
  // Animation loop
  animate();
}
```

### Project Structure

```
pcb-viewer/
├── src/
│   ├── createPCBPlane.ts    # PCB geometry generation
│   ├── renderer.ts          # Main rendering pipeline
│   └── main.ts             # Application entry point
└── public/
    └── models/             # 3D model assets
```

### Performance Considerations

- Geometry instancing for repeated components
- Optimized lighting calculations with limited point lights and ambient lighting.
- Batched geometry updates

### Dependencies

```json
{
  "dependencies": {
    "three": "^0.x.x",
    "@types/three": "^0.x.x"
  }
}
```

### Browser Support

- WebGL 2.0 compatible browsers
- Hardware acceleration recommended
- Minimum recommended resolution: 1024x768

## Live Demo & Development

- **Live Demo**: [PCB Viewer](https://pcb-viewer.netlify.app/)
- **Development Server**: http://localhost:5173 (default Vite configuration)

## License

MIT License - See `LICENSE` for details.

---

### Made with ❤️ by [Riddhidipta Pal](https://github.com/CodingLife1024)

For bug reports and feature requests, please open an issue on the GitHub repository.