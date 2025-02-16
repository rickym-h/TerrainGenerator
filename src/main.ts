import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import {TerrainGenerator} from "./MapGeneration.ts";

let camera: THREE.PerspectiveCamera, controls: MapControls, scene: THREE.Scene, renderer: THREE.WebGLRenderer;

init();

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

    // controls
    controls = new MapControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // world
    const width = 100;
    const height = 100;
    const xVertices = 500;
    const yVertices = 500;

    // Texture and canvas
    const canvas = document.createElement( 'canvas' );
    canvas.width = xVertices;
    canvas.height = yVertices;
    let context = canvas.getContext( '2d' );
    // @ts-ignore
    context.fillStyle = '#fff';
    // @ts-ignore
    //let image = context.getImageData(0, 0, canvas.width, canvas.height);

    // @ts-ignore
    context.fillRect( 0, 0, canvas.width, canvas.height );

    // Terrain heightmap
    const terrainGeometry = new THREE.PlaneGeometry( width, height, xVertices-1, yVertices-1 );
    terrainGeometry.rotateX( - Math.PI / 2 ); // Rotate to be flat rather than vertical
    const vertices = terrainGeometry.attributes.position.array;

    let terrainGenerator: TerrainGenerator = new TerrainGenerator(3);
    for (let x = 0; x < xVertices; x++) {
        for (let y = 0; y < yVertices; y++) {
            let heightmapIndex = 3*x + (y * xVertices * 3); // Multiplied by 3 because the data is in XYZ format.
            let height = terrainGenerator.getHeightAtLocation(vertices[heightmapIndex], vertices[heightmapIndex+2]);
            vertices[heightmapIndex + 1] = height;


            // let textureIndex = 4*x + (y * xVertices * 4); // Multiplied by 4 because the data is in RGBA format.
            if (height > 0) {
                // @ts-ignore
                context.fillStyle = "red";
                // @ts-ignore
                context.fillRect(x, y, 1, 1);
            } else {
            }
        }
    }

    terrainGeometry.computeVertexNormals();

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