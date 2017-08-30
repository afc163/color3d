import Color3d from '../index';

const cubeItems = 18;
const colorStep = 255 / (cubeItems - 1);
const r = colorStep * 256 * 256;
const g = colorStep * 256;
const b = colorStep;
const colors = [];

for (let x = 0; x < cubeItems; x++) {
  for (let y = 0; y < cubeItems; y++) {
    for (let z = 0; z < cubeItems; z++) {
      const rgbInt = x * r + y * g + b * z;
      const color = numberToHex(rgbInt);
      colors.push(color);
    }
  }
}

function numberToHex(i) {
  const pad = "000000";
  const s = i.toString(16);
  return '#' + pad.substring(0, pad.length - s.length) + s;
}

const colors2 = [
  "#FFF1F0",
  "#FFCCC7",
  "#FFA39E",
  "#FF7875",
  "#FF4D4F",
  "#F5222D",
  "#CF1322",
  "#A8071A",
  "#820014",
  "#5C0011",
  "#FFF2E8",
  "#FFD8BF",
  "#FFBB96",
  "#FF9C6E",
  "#FF7A45",
  "#FA541C",
  "#D4380D",
  "#AD2102",
  "#871400",
  "#610B00",
  "#FFF7E6",
  "#FFE7BA",
  "#FFD591",
  "#FFC069",
  "#FFA940",
  "#FA8C16",
  "#D46B08",
  "#AD4E00",
  "#873800",
  "#612500",
  "#FFFBE6",
  "#FFF1B8",
  "#FFE58F",
  "#FFD666",
  "#FFC53D",
  "#FAAD14",
  "#D48806",
  "#AD6800",
  "#874D00",
  "#613400",
  "#FEFFE6",
  "#FFFFB8",
  "#FFFB8F",
  "#FFF566",
  "#FFEC3D",
  "#FADB14",
  "#D4B106",
  "#AD8B00",
  "#876800",
  "#614700",
  "#FCFFE6",
  "#F4FFB8",
  "#EAFF8F",
  "#D3F261",
  "#BAE637",
  "#A0D911",
  "#7CB305",
  "#5B8C00",
  "#3F6600",
  "#254000",
  "#F6FFED",
  "#D9F7BE",
  "#B7EB8F",
  "#95DE64",
  "#73D13D",
  "#52C41A",
  "#389E0D",
  "#237804",
  "#135200",
  "#092B00",
  "#E6FFFB",
  "#B5F5EC",
  "#87E8DE",
  "#5CDBD3",
  "#36CFC9",
  "#13C2C2",
  "#08979C",
  "#006D75",
  "#00474F",
  "#002329",
  "#E6F6FF",
  "#BDE6FF",
  "#94D2FF",
  "#6BBCFF",
  "#42A4FF",
  "#1984F7",
  "#0A64D1",
  "#0047AB",
  "#003385",
  "#00215E",
  "#F0F5FF",
  "#D6E4FF",
  "#ADC6FF",
  "#82A2FA",
  "#5579ED",
  "#2D51E0",
  "#1C36BA",
  "#0F2194",
  "#05106E",
  "#030747",
  "#F9F0FF",
  "#F4E6FF",
  "#D8B7F7",
  "#B888EB",
  "#975DDE",
  "#7736D1",
  "#5824AB",
  "#3C1585",
  "#250A5E",
  "#140638",
  "#FFF0F6",
  "#FFD6E7",
  "#FFADD2",
  "#FF85C0",
  "#F759AB",
  "#EB2F96",
  "#C41D7F",
  "#9E1068",
  "#780650",
  "#520339"
];

const color3d = new Color3d(colors, {
  background: '#000000'
});

color3d.render(document.getElementById('container'));

document.querySelectorAll('button').forEach((button) => {
  button.onclick = () => {
    color3d.changeSpaceMode(button.id);
  };
});

document.getElementById('changeData').onclick = () => {
  color3d.updateData(colors2);
};

document.getElementById('changeDataBack').onclick = () => {
  color3d.updateData(colors);
};

document.getElementById('unmount').onclick = () => {
  color3d.unmount();
};
