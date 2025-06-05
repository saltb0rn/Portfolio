import * as THREE from 'three'

export const createWaterCube = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5, 100, 100, 100)
    const materialTop = new THREE.MeshStandardMaterial({
        color: 0x5A75A0,
        metalness: 1,
        roughness: 0.27,
        normalMap: new THREE.TextureLoader().load('/textures/water_normal.png', texture => { texture.flipY = false }),
        normalMapType: THREE.ObjectSpaceNormalMap,
        side: THREE.DoubleSide
    })
    materialTop.normalMap!.wrapS = THREE.RepeatWrapping
    materialTop.normalMap!.wrapT = THREE.RepeatWrapping
    materialTop.normalMap!.repeat.set(10, 10)

    // https://stackoverflow.com/questions/8820591/how-to-use-multiple-materials-in-a-three-js-cube

    // https://github.com/Nugget8/Three.js-Ocean-Scene/tree/main

    const materialRest = new THREE.MeshStandardMaterial({
        color: 0x5A75A0,
        metalness: 0,
        roughness: 0.27,
        transparent: true,
        side: THREE.DoubleSide
    })

    const materials = [
        materialRest.clone(), materialRest.clone(), materialTop,
        materialRest.clone(), materialRest.clone(), materialRest.clone()
    ]

    return new THREE.Mesh(geometry, materials)

}
