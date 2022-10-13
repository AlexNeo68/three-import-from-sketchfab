import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loadingManager = new THREE.LoadingManager();
const progressbarContainer = document.getElementById("progressbar-container");
const progressbar = document.getElementById("progressbar");
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Начата загрузка файлов: " +
      url +
      ".\nЗагружено " +
      itemsLoaded +
      " из " +
      itemsTotal +
      " файлов."
  );
};

loadingManager.onLoad = function () {
  console.log("Загрузка завершена!");
  progressbarContainer.style.display = "none";
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  const percent = (itemsLoaded / itemsTotal) * 100;
  progressbar.value = percent;
  console.log(
    "Загрузка файлов: " +
      url +
      ".\nЗагружено " +
      itemsLoaded +
      " из " +
      itemsTotal +
      " файлов."
  );
};

loadingManager.onError = function (url) {
  console.log("Произошла ошибка при загрузке " + url);
};

// Sets the color of the background
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

const gltfLoader = new GLTFLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);
let car = null;
rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  gltfLoader.load("./assets/free_1975_porsche_911_930_turbo.glb", (model) => {
    car = model.scene;
    scene.environment = texture;
    scene.add(car);
  });
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
