import drawSkin3D from './namemc-skins';

const canvas = document.getElementById('skin');
const url = new URL(window.location.href);
const uuid = url.searchParams.get('uuid');

if (uuid && uuid.length === 32) {
  drawSkin3D(canvas, uuid, true);
}
