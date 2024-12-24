// createPCBPlane.ts
import * as THREE from 'three';

/**
 * Creates a PCB with specified dimensions and holes.
 * @param width - The width of the PCB.
 * @param height - The height of the PCB.
 * @param depth - The depth (thickness) of the PCB.
 * @param holes - An array of objects specifying hole positions and radii.
 * @returns A THREE.Mesh representing the PCB with holes, rotated along the X-axis.
 */
export function createPCBWithHoles(width: number, height: number, depth: number, holes: { position: { x: number; y: number }, radius: number }[]): THREE.Mesh {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.lineTo(-width / 2, -height / 2);

    // Add holes to the shape
    holes.forEach(({ position, radius }) => {
        const holeShape = new THREE.Path();
        holeShape.absarc(position.y, position.x, radius, 0, Math.PI * 2, false);
        shape.holes.push(holeShape);
    });

    // Extrude settings
    const extrudeSettings = {
        depth: depth,
        bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: 0x40573e });

    const pcbMesh = new THREE.Mesh(geometry, material);

    // Rotate the mesh along the X-axis by -Math.PI / 2
    pcbMesh.rotation.x = -Math.PI / 2;
    pcbMesh.rotation.z = -Math.PI / 2;

    return pcbMesh;
}
