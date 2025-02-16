import * as THREE from 'three';
import {MapControls} from 'three/addons/controls/MapControls.js';
import {TerrainGenerator} from "./MapGeneration.ts";

let camera: THREE.PerspectiveCamera, controls: MapControls, scene: THREE.Scene, renderer: THREE.WebGLRenderer;

init();

function getTerrainColour(pixelHeight: number) {
    // Water
    // Sand
    // Grass
    // Rock
    // Snow
    let valueMap = {
        water: -0.4,
        sand: -0.3,
        grass: 0.8,
        rock: 1.3,
    }

    if (pixelHeight <= valueMap.water) {
        return "blue";
    } else if (pixelHeight <= valueMap.sand) {
        return "yellow";
    } else if (pixelHeight <= valueMap.grass) {
        return "green";
    } else if (pixelHeight <= valueMap.rock) {
        return "gray";
    } else {
        return "white";
    }
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( tick );
    // @ts-ignore
    document.getElementById("app").appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 0, 50, -70 );

    // Controls
    controls = new MapControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Terrain Data
    const width = 100;
    const height = 100;
    const xVertices = 500;
    const yVertices = 500;

    // Terrain heightmap
    let terrainGenerator: TerrainGenerator = new TerrainGenerator(3);
    const heightMap: number[][] = terrainGenerator.getHeightMap(xVertices, yVertices);

    // Set terrain height per vertex
    const terrainGeometry = new THREE.PlaneGeometry( width, height, xVertices-1, yVertices-1 );
    terrainGeometry.rotateX( - Math.PI / 2 ); // Rotate to be flat rather than vertical
    const vertices = terrainGeometry.attributes.position.array;
    for (let x = 0; x < xVertices; x++) {
        for (let y = 0; y < yVertices; y++) {
            let heightmapIndex = 3*x + (y * xVertices * 3); // Multiplied by 3 because the data is in XYZ format.
            vertices[heightmapIndex + 1] = heightMap[x][y];
        }
    }
    terrainGeometry.computeVertexNormals();

    // Texture and canvas
    const canvas = document.createElement( 'canvas' );
    canvas.width = xVertices;
    canvas.height = yVertices;
    let context = canvas.getContext( '2d' );
    // Set pixel colour per vertex
    for (let x = 0; x < xVertices; x++) {
        for (let y = 0; y < yVertices; y++) {
            // let textureIndex = 4*x + (y * xVertices * 4); // Multiplied by 4 because the data is in RGBA format.
            let pixelHeight = heightMap[x][y];

            // @ts-ignore
            context.fillStyle = getTerrainColour(pixelHeight);
            // @ts-ignore
            context.fillRect(x, y, 1, 1);
        }
    }
    let texture = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh( terrainGeometry, new THREE.MeshBasicMaterial( { map: texture }  ));
    scene.add(plane);

    // lights
    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0x002288, 3 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add( ambientLight );

    //
    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function tick() {
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();
}

function render() {
    renderer.render( scene, camera );
}