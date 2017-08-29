import THREE from 'three';
import 'three/js/controls/OrbitControls';
import d3 from 'd3';
import 'd3-hsv';

const cubeItems = 17 + 1;
const cubeSpace = 8;
const cubeRatio = 4;
const cubeSize = cubeSpace / cubeRatio;
const margin = -cubeSpace * (cubeItems - 1) / 2;
const colorStep = 255 / (cubeItems - 1);
const r = colorStep * 256 * 256;
const g = colorStep * 256;
const b = colorStep;

const maxSpeed = 3;
const maxSpeedSq = Math.pow(maxSpeed, 2);
const meshes = null;

const container;

const camera, controls, scene, renderer;

const axisX = new THREE.Vector3(1, 0, 0);
const axisY = new THREE.Vector3(0, 1, 0);
const axisZ = new THREE.Vector3(0, 0, 1);
const angleX = -Math.PI / 4;
const angleY = -Math.PI / 4;
const angleZ = Math.atan(Math.sqrt(2) / 2);

function move(p, t) {
  const distance = p.distanceToSquared(t);
  const isTooFar = distance > maxSpeedSq;

  if (isTooFar) {
    const step = new THREE.Vector3()
    .subVectors(t, p)
    .setLength(maxSpeed);
    p.add(step);
    return false;
  } else {
    p.copy(t);
    return true;
  }
}

function animate() {
  render();
  meshes.forEach(function (mesh) {
    const data = mesh.userData;
    if (data.targetReached) {
      return;
    }
    const p = mesh.position;
    const t = data.target;

    data.targetReached = move(p, t);
    mesh.updateMatrix();

  });
  controls.update();
  requestAnimationFrame(animate);
}

function calcLabTarget(rgb) {
  const lab = d3.lab(rgb);
  return new THREE.Vector3(
    (lab.b),
    -100 + 2 * lab.l,
    (lab.a)
  );
}

function setLabTarget(mesh) {
  mesh.userData.targetReached = false;
  mesh.userData.target = calcLabTarget(mesh.userData.color);
}

function calcHslTarget(rgb) {
  const hsl = d3.hsl(rgb);
  if (isNaN(hsl.s)) hsl.s = 0;
  if (isNaN(hsl.h)) hsl.h = 0;
  hsl.h -= 45;
  const rad = Math.PI * hsl.h / 180;
  return new THREE.Vector3(
    hsl.s * 100,
    -100 + 200 * hsl.l,
    0
  )
  .applyAxisAngle(axisY, rad);
}

function setHslTarget(mesh) {
  mesh.userData.targetReached = false;
  mesh.userData.target = calcHslTarget(mesh.userData.color);
}

function calcHsvTarget(rgb) {
  const hsv = d3.hsv(rgb);
  if (isNaN(hsv.s)) hsv.s = 0;
  if (isNaN(hsv.h)) hsv.h = 0;
  hsv.h -= 45;
  const rad = Math.PI * hsv.h / 180;
  return new THREE.Vector3(
    hsv.s * 100,
    -100 + 200 * hsv.v,
    0
  )
  .applyAxisAngle(axisY, rad);
}

function setHsvTarget(mesh) {
  mesh.userData.targetReached = false;
  mesh.userData.target = calcHsvTarget(mesh.userData.color);
}

function rgbTransform(x) {
  return margin + cubeSpace * x / colorStep;
}

function calcRgbTarget(rgb) {
  rgb = d3.rgb(rgb);
  return new THREE.Vector3(
    rgbTransform(rgb.r),
    rgbTransform(rgb.g),
    rgbTransform(rgb.b)
  )
  .applyAxisAngle(axisX, angleX)
  .applyAxisAngle(axisZ, angleZ)
  .applyAxisAngle(axisY, angleY)
}

function setRgbTarget(mesh) {
  mesh.userData.targetReached = false;
  mesh.userData.target = calcRgbTarget(mesh.userData.color);
}

function setPosition(vector, values) {
  Object.keys(values).forEach(function (k) {
    vector[k] = values[k];
  });
}

function init(colors, container, options) {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 500;
  controls = new THREE.OrbitControls(camera);

  scene = new THREE.Scene();

  // world
  const cube = new THREE.SphereGeometry(cubeSize);
  const material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading});

  for (let i= 0; i < colors.length; i++) {
    const m = material.clone();
    m.color = new THREE.Color(colors[i]);
    const mesh = new THREE.Mesh(cube, m);

    mesh.userData = { color: colors[i] };
    setHsvTarget(mesh);

    scene.add(mesh);

    mesh.matrixAutoUpdate = false;
    setPosition(mesh.position, mesh.userData.target);
    mesh.updateMatrix();
  }

  meshes = scene.children.filter(function (o) {
    return o instanceof THREE.Mesh;
  });

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(options.background || 0xcccccc);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}

export function changeMode(mode) {
  switch(mode) {
    case 'hsl': meshes.forEach(setHslTarget);
    case 'rgb': meshes.forEach(setRgbTarget);
    case 'lab': meshes.forEach(setLabTarget);
    case 'hsv': meshes.forEach(setHsvTarget);
    default: meshes.forEach(setHsvTarget);
  }
}

export default init;
