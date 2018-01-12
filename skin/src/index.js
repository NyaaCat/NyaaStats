import drawSkin3D from './namemc-skins';

const canvas = document.getElementById('skin');
const url = new URL(window.location.href);
const uuid = url.searchParams.get('uuid');

if (uuid && uuid.length === 32) {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.width = w;
  canvas.height = h;
  drawSkin3D(canvas, uuid, true);
}
