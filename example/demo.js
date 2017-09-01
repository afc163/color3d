import Color3d from '../index';

function generateColors(cubeItems) {
  const colors = [];
  cubeItems = cubeItems || 16;
  const colorStep = parseInt(255 / (cubeItems - 1), 10);
  const r = colorStep * 256 * 256;
  const g = colorStep * 256;
  const b = colorStep;

  for (let x = 0; x < cubeItems; x++) {
    for (let y = 0; y < cubeItems; y++) {
      for (let z = 0; z < cubeItems; z++) {
        const rgbInt = x * r + y * g + b * z;
        const color = numberToHex(rgbInt);
        colors.push(color);
      }
    }
  }
  console.log(colors);
  return colors;
}

function numberToHex(i) {
  const pad = "000000";
  const s = i.toString(16);
  return '#' + pad.substring(0, pad.length - s.length) + s;
}

const color3d = new Color3d(generateColors(), {
  background: '#000000'
});

color3d.render(document.getElementById('container'));

document.querySelectorAll('button').forEach((button) => {
  button.onclick = () => {
    color3d.changeSpaceMode(button.id);
  };
});

document.getElementById('unmount').onclick = () => {
  color3d.unmount();
};

document.querySelector('input[type=range]').oninput = (e) => {
  const colors = generateColors(parseInt(e.target.value, 10));
  color3d.updateData(colors);
};
