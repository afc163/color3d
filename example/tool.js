import Color3d from '../index';
import uniq from 'lodash/uniq';

let colors = [
  '#ffffff', '#eeeeee',
  '#dddddd', '#cccccc', '#bbbbbb', '#aaaaaa', '#999999', '#888888', '#777777',
  '#666666', '#555555', '#444444', '#333333', '#222222', '#111111', '#000000'
];
const color3d = new Color3d(colors, {
  background: '#000000'
});

color3d.render(document.getElementById('container'));

const picker = document.querySelectorAll('input[type="color"]')[0];
const colorsInput = document.getElementById('colors');
colorsInput.value = colors.join(',');

document.querySelectorAll('button')[0].onclick = (e) => {
  colors = uniq(colorsInput.value.trim().split(','));
  colors.push(picker.value);
  colors = uniq(colors);
  colorsInput.value = colors.join(',');
  color3d.updateData(colors);
};

colorsInput.onchange = (e) => {
  color3d.updateData(uniq(e.target.value.trim().split(',')));
};
