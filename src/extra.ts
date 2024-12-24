models.forEach(({ path, position, rotation }) => {
    const fileExtension = path.split('.').pop() || '';

    function adjustModelToTouchPlane(model: THREE.Object3D) {
      // Apply rotation
      model.rotation.set(
        Math.PI * rotation.x,
        Math.PI * rotation.y,
        Math.PI * rotation.z
      );

      // Compute bounding box AFTER rotation
      const bbox = new THREE.Box3().setFromObject(model);

      if (!bbox.isEmpty()) {
        const minZ = bbox.min.z; // Get the lowest point of the model in the local coordinate space
        model.position.set(position.x, -minZ, position.y);
      }

      // Scale uniformly if needed (example, adjust to your needs)
      model.scale.set(1, 1, 1);

      // Add to scene
      scene.add(model);
    }

    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          adjustModelToTouchPlane(model);
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
          adjustModelToTouchPlane(mesh);
        },
        undefined,
        (error) => console.error('Error loading STL model:', error)
      );
    } else if (fileExtension === 'obj') {
      const objLoader = new OBJLoader();
      objLoader.load(
        path,
        (object) => {
          adjustModelToTouchPlane(object);
        },
        undefined,
        (error) => console.error('Error loading OBJ model:', error)
      );
    } else if (fileExtension === 'wrl') {
      const vrmlLoader = new VRMLLoader();
      vrmlLoader.load(
        path,
        (object) => {
          adjustModelToTouchPlane(object);
        },
        undefined,
        (error) => console.error('Error loading WRL model:', error)
      );
    } else {
      console.error('Unsupported file format:', fileExtension);
    }
  });
