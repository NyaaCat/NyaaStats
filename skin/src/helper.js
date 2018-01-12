export const TAU = 2 * Math.PI;

export function toCanvas(image, x, y, w, h) {
  x = (typeof x === 'undefined' ? 0 : x);
  y = (typeof y === 'undefined' ? 0 : y);
  w = (typeof w === 'undefined' ? image.width : w);
  h = (typeof h === 'undefined' ? image.height : h);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
  return canvas;
}

export function makeOpaque(image) {
  const canvas = toCanvas(image);
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = data.data;
  for (let p = 3; p < pixels.length; p += 4) {
    pixels[p] = 255;
  }
  ctx.putImageData(data, 0, 0);
  return canvas;
}

export function hasAlphaLayer(image) {
  const canvas = toCanvas(image);
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = data.data;
  for (let p = 3; p < pixels.length; p += 4) {
    if (pixels[p] !== 255) {
      return true;
    }
  }
  return false;
}

export function toRadians(d) {
  return d * (TAU / 360);
}
