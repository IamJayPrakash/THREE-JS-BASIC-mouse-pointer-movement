import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

// Set up container and initial scene
const container = document.createElement("div");
document.body.appendChild(container);

const width = window.innerWidth;
const height = window.innerHeight;

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Set up camera
const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.position.set(0, 0, 10);

// Add light to the scene
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0, 0, 1);
scene.add(light);

// Create a cube geometry
const geometry1 = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0ddd });
const cube = new THREE.Mesh(geometry1, material1);
scene.add(cube);

// Create a line shape
const material2 = new THREE.LineBasicMaterial({ color: 0x0ffddd });
const points = [];
points.push(new THREE.Vector3(0, 0, 0));
points.push(new THREE.Vector3(5, 0, 0));
points.push(new THREE.Vector3(5, 5, 0));
points.push(new THREE.Vector3(-5, 5, 0));
points.push(new THREE.Vector3(-5, 0, 0));
points.push(new THREE.Vector3(0, 0, 0));

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry2, material2);
scene.add(line);

// Load a font and create the text
const loader = new FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textGeometry = new TextGeometry("Hello, I am Jay!", {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-8, -3, 0); // Position the text within the scene
    scene.add(textMesh);
  }
);

// Set up shadow
const canvas = document.createElement("canvas");
canvas.width = 128;
canvas.height = 128;
const context = canvas.getContext("2d");
const gradient = context.createRadialGradient(
  canvas.width / 2,
  canvas.height / 2,
  0,
  canvas.width / 2,
  canvas.height / 2,
  canvas.width / 2
);
gradient.addColorStop(0.1, "rgba(210,210,210,1)");
gradient.addColorStop(1, "rgba(255,255,255,1)");
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);

const shadowTexture = new THREE.CanvasTexture(canvas);
const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture });
const shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

const shadowMesh1 = new THREE.Mesh(shadowGeo, shadowMaterial);
shadowMesh1.position.y = -250;
shadowMesh1.rotation.x = -Math.PI / 2;
scene.add(shadowMesh1);

// Add geometry shapes
const radius = 200;
const geometry3 = new THREE.IcosahedronGeometry(radius, 1);
const material3 = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
  vertexColors: true,
  shininess: 0,
});
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
  transparent: true,
});

const mesh = new THREE.Mesh(geometry3, material3);
const wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
mesh.add(wireframe);
mesh.position.set(400, 0, 0);
scene.add(mesh);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Stats for performance monitoring
const stats = new Stats();
container.appendChild(stats.dom);

// Handle window resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Mouse movement for camera interaction
let mouseX = 0,
  mouseY = 0;
window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;

  // Move camera with mouse interaction
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  stats.update();
}

// Start the animation
animate();
