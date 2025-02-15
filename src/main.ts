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
    camera.position.set( 0, 200, - 400 );

    // controls
    controls = new MapControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // world
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial( { color: 0xeeeeee, flatShading: true } );

    const mesh = new THREE.Mesh( geometry, material );
    mesh.scale.x = 100;
    mesh.scale.y = 100;
    mesh.scale.z = 100;
    mesh.updateMatrix();
    //scene.add( mesh );

    const xVertices = 100;
    const yVertices = 100;

    const terrainGeometry = new THREE.PlaneGeometry( 1000, 1000, xVertices-1, yVertices-1 );
    terrainGeometry.rotateX( - Math.PI / 2 ); // Rotate to be flat rather than vertical

    const vertices = terrainGeometry.attributes.position.array;
    console.log(vertices)

    let terrainGenerator: TerrainGenerator = new TerrainGenerator(1);
    for (let x = 0; x < xVertices; x++) {
        for (let y = 0; y < yVertices; y++) {
            let index = 3*x + (y * xVertices * 3);
            vertices[index + 1] = terrainGenerator.getHeightAtLocation(x, y);
        }
    }
    console.log(vertices)
    const plane = new THREE.Mesh( terrainGeometry, material );
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