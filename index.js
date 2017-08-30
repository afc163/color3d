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

var maxSpeed = 3;
var maxSpeedSq = Math.pow(maxSpeed, 2);

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

function calcLabTarget(rgb) {
  var lab = d3.lab(rgb);
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

export default function Color3d(colors, options) {
  this.options = options || {};
  this.scene = new THREE.Scene();
  this.spaceMode = this.options.spaceMode || 'hsv';

  // world
  var cube = new THREE.SphereGeometry(cubeSize);
  var material = new THREE.MeshBasicMaterial({ flatShading: THREE.FlatShading });

  for (var i= 0; i < colors.length; i++) {
    var m = material.clone();
    m.color = new THREE.Color(colors[i]);
    var mesh = new THREE.Mesh(cube, m);

    mesh.userData = { color: colors[i] };
    this.applySpaceMode(mesh);

    this.scene.add(mesh);

    mesh.matrixAutoUpdate = false;
    setPosition(mesh.position, mesh.userData.target);
    mesh.updateMatrix();
  }

  this.meshes = this.scene.children.filter(function (o) {
    return o instanceof THREE.Mesh;
  });
}

Color3d.prototype.render = function(container) {
  this.camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 1, 10000);
  this.camera.position.z = (this.options.position && this.options.position.z) || 350;
  this.controls = new THREE.OrbitControls(this.camera, container);
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setClearColor(this.options.background || 0xeeeeee);
  this.renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(this.renderer.domElement);
  this.onWindowResize = function onWindowResize() {
    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  };
  window.addEventListener('resize', this.onWindowResize, false);
  this.rafHandler = this.startAnimate();
  this.container = container;
};

Color3d.prototype.updateData = function(colors) {
  var i = 0;
  this.scene.children = [];
  var cube = new THREE.SphereGeometry(cubeSize);
  var material = new THREE.MeshBasicMaterial({ flatShading: THREE.FlatShading });
  for (i = 0; i < colors.length; i++) {
    var m = material.clone();
    m.color = new THREE.Color(colors[i]);
    var mesh = new THREE.Mesh(cube, m);
    mesh.userData = { color: colors[i] };
    this.applySpaceMode(mesh);
    this.scene.add(mesh);
    mesh.matrixAutoUpdate = false;
    setPosition(mesh.position, mesh.userData.target);
    mesh.updateMatrix();
  }
  this.meshes = this.scene.children.filter(function (o) {
    return o instanceof THREE.Mesh;
  });
  this.repaint();
};

Color3d.prototype.changeSpaceMode = function(mode) {
  this.spaceMode = mode;
  this.repaint();
};

Color3d.prototype.unmount = function() {
  window.removeEventListener('resize', this.onWindowResize, false);
  this.container.removeChild(this.renderer.domElement);
  if (this.rafHandler && this.rafHandler.cancel) {
    this.rafHandler.cancel();
  }
}

Color3d.prototype.repaint = function() {
  switch(this.spaceMode) {
    case 'hsl': this.meshes.forEach(setHslTarget); break;
    case 'rgb': this.meshes.forEach(setRgbTarget); break;
    case 'lab': this.meshes.forEach(setLabTarget); break;
    case 'hsv': this.meshes.forEach(setHsvTarget); break;
    default: this.meshes.forEach(setHsvTarget);
  }
}

Color3d.prototype.applySpaceMode = function(mesh) {
  switch(this.spaceMode) {
    case 'hsl': setHslTarget(mesh); break;
    case 'rgb': setRgbTarget(mesh); break;
    case 'lab': setLabTarget(mesh); break;
    case 'hsv': setHsvTarget(mesh); break;
  }
}

Color3d.prototype.renderScene = function() {
  this.renderer.render(this.scene, this.camera);
}

Color3d.prototype.startAnimate = function() {
  this.renderScene();
  this.meshes.forEach(function (mesh) {
    var data = mesh.userData;
    if (data.targetReached) {
      return;
    }
    var p = mesh.position;
    var t = data.target;
    data.targetReached = move(p, t);
    mesh.updateMatrix();
  });
  this.controls.update();
  return requestAnimationFrame(this.startAnimate.bind(this));
}
