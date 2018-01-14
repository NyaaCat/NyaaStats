import drawSkin3D from './namemc-skins';

function findGetParameter(parameterName) {
  let result = null;
  let tmp = [];
  const items = window.location.search.substr(1).split('&');
  for (let index = 0; index < items.length; index += 1) {
    tmp = items[index].split('=');
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

const canvas = document.getElementById('skin');
const uuid = findGetParameter('uuid');

if (uuid && uuid.length === 32) {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.width = w;
  canvas.height = h;
  drawSkin3D(canvas, uuid, true);
}
