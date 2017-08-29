var THREE = require('three');
var d3 = require('d3');
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls');
d3.hsv = require('d3-hsv').hsv;

var cubeItems = 17 + 1;
var cubeSpace = 8;
var cubeRatio = 4;
var cubeSize = cubeSpace / cubeRatio;
var margin = -cubeSpace * (cubeItems - 1) / 2;
var colorStep = 255 / (cubeItems - 1);
var r = colorStep * 256 * 256;
var g = colorStep * 256;
var b = colorStep;

var maxSpeed = 3;
var maxSpeedSq = Math.pow(maxSpeed, 2);
var meshes = null;

var container;

var camera, controls, scene, renderer;

var axisX = new THREE.Vector3(1, 0, 0);
var axisY = new THREE.Vector3(0, 1, 0);
var axisZ = new THREE.Vector3(0, 0, 1);
var angleX = -Math.PI / 4;
var angleY = -Math.PI / 4;
var angleZ = Math.atan(Math.sqrt(2) / 2);

function move(p, t) {
  var distance = p.distanceToSquared(t);
  var isTooFar = distance > maxSpeedSq;

  if (isTooFar) {
    var step = new THREE.Vector3()
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
    var data = mesh.userData;
    if (data.targetReached) {
      return;
    }
    var p = mesh.position;
    var t = data.target;

    data.targetReached = move(p, t);
    mesh.updateMatrix();

  });
  controls.update();
  requestAnimationFrame(animate);
}

function calcLabTarget(rgb) {
  var lab = d3.lab(rgb);
  return new THREE.Vector3(
    (lab.b),
    -100 + 2 * lab.l,
    (lab.a)
  );
}

function setLabTarget(mesh) {
  console.log('lab', mesh)
  mesh.userData.targetReached = false;
  mesh.userData.target = calcLabTarget(mesh.userData.color);
}

function calcHslTarget(rgb) {
  var hsl = d3.hsl(rgb);
  if (isNaN(hsl.s)) hsl.s = 0;
  if (isNaN(hsl.h)) hsl.h = 0;
  hsl.h -= 45;
  var rad = Math.PI * hsl.h / 180;
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
  var hsv = d3.hsv(rgb);
  if (isNaN(hsv.s)) hsv.s = 0;
  if (isNaN(hsv.h)) hsv.h = 0;
  hsv.h -= 45;
  var rad = Math.PI * hsv.h / 180;
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

export function init(colors, container, options) {
  options = options || {};
  camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 1, 10000);
  camera.position.z = (options.position && options.position.z) || 350;
  controls = new THREE.OrbitControls(camera, container);

  scene = new THREE.Scene();

  // world
  var cube = new THREE.SphereGeometry(cubeSize);
  var material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading});

  for (var i= 0; i < colors.length; i++) {
    var m = material.clone();
    m.color = new THREE.Color(colors[i]);
    var mesh = new THREE.Mesh(cube, m);

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
  renderer.setClearColor(options.background || 0xeeeeee);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  animate();

  function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }
}

function render() {
  renderer.render(scene, camera);
}

export function changeMode(mode) {
  switch(mode) {
    case 'hsl': meshes.forEach(setHslTarget); break;
    case 'rgb': meshes.forEach(setRgbTarget); break;
    case 'lab': meshes.forEach(setLabTarget); break;
    case 'hsv': meshes.forEach(setHsvTarget); break;
    default: meshes.forEach(setHsvTarget);
  }
}
