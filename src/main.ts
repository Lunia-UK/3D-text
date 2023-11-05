import GUI from "lil-gui";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/Addons.js";
import {
  defaultColor,
  defaultTextValue,
  defaultTextProps,
  defaultFontFamily,
  sizes,
  defaultFont,
  fonts,
} from "./defaultValue";

const gui = new GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;

// MESH
const textMaterial = new THREE.MeshBasicMaterial({ color: defaultColor });
const textObj = new THREE.Mesh();

const fontLoader = new FontLoader();
const createText = (text: string, fontFamily: string) => {
  fontLoader.load(`/fonts/${fontFamily}_regular.typeface.json`, (font) => {
    const textGeometry = new TextGeometry(text, {
      ...defaultTextProps,
      font,
    });

    textObj.geometry = textGeometry;
    textObj.material = textMaterial;
    textGeometry.computeBoundingBox();
    textGeometry.center();
    scene.add(textObj);
  });
};

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const canvas = renderer.domElement;
const webGLContainer = document.getElementById("webgl-container");

if (webGLContainer) {
  webGLContainer.appendChild(renderer.domElement);
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// INIT
let currentFont = defaultFont;

const refreshText = (text: string, fontFamily: string) => {
  scene.remove(textObj);
  createText(text, fontFamily);
};

refreshText(defaultTextValue.text, defaultFontFamily);

// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// GUI
const textFolder = gui.addFolder("Text");
textFolder
  .addColor({ color: defaultColor }, "color")
  .name("Color")
  .onChange((value: number) => {
    textMaterial.color.setHex(value);
  });
textFolder
  .add(defaultFont, "fontFamily", fonts)
  .name("Font family")
  .onChange((fontFamily: string) => {
    currentFont.fontFamily = fontFamily;
    refreshText(currentFont.value, fontFamily);
  });

textFolder
  .add(defaultFont, "value")
  .name("Text")
  .onChange((text: string) => {
    currentFont.value = text;
    refreshText(currentFont.value, currentFont.fontFamily);
  });

const positionFolder = gui.addFolder("Position");
positionFolder
  .add(textObj.position, "y")
  .name("Position y")
  .min(-3)
  .max(3)
  .step(0.01);
positionFolder
  .add(textObj.position, "x")
  .name("Position x")
  .min(-3)
  .max(3)
  .step(0.01);
positionFolder
  .add(textObj.position, "z")
  .name("Position z")
  .min(-3)
  .max(3)
  .step(0.01);

const rotationFolder = gui.addFolder("Rotation");
rotationFolder
  .add(textObj.rotation, "y")
  .name("Rotation y")
  .min(-3)
  .max(3)
  .step(0.01);
rotationFolder
  .add(textObj.rotation, "x")
  .name("Rotation x")
  .min(-3)
  .max(3)
  .step(0.01);
rotationFolder
  .add(textObj.rotation, "z")
  .name("Rotation z")
  .min(-3)
  .max(3)
  .step(0.01);

const rotationAutomatic = {
  boolean: false,
};
rotationFolder.add(rotationAutomatic, "boolean").name("Automatic rotation");

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  if (rotationAutomatic.boolean) {
    textObj.rotation.x = elapsedTime;
    textObj.rotation.y = elapsedTime;
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();
