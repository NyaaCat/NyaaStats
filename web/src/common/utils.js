import {format as dfFormat, parse as dfParse} from 'date-fns'

/**
 * Parse date string from stats data
 *
 * @param {String} dateStr
 * @return {Date}
 */
export function parseDate (dateStr) {
  return dfParse(dateStr, 'yyyy-MM-dd HH:mm:ss xx', new Date())
}

/**
 * Normalize date format
 *
 * @param {Date | String | Number} date
 * @param {"long" | "short"} [format="long"]
 * @return {String}
 */
export function normalizeDate (date, format = 'long') {
  if (typeof date === 'string') {
    date = parseDate(date)
  }
  format = {
    long: 'yyyy-MM-dd HH:mm:ss',
    short: 'yyyy-MM-dd',
  }[format]
  return dfFormat(date, format)
}

/**
 * Get user agent scrollbar's width (in pixel)
 *
 * @return {Number}
 */
export function getScrollbarWidth () {
  const content = document.createElement('div')
  content.setAttribute('style', 'height: 10px;')
  const wrapper = document.createElement('div')
  wrapper.setAttribute('style', 'width: 100%; height: 0; position: fixed; left: 0; bottom: 0; visibility: hidden; overflow: scroll;')
  wrapper.append(content)
  document.body.append(wrapper)
  const scrollbarWidth = wrapper.offsetWidth - content.offsetWidth
  document.body.removeChild(wrapper)
  return scrollbarWidth
}

/**
 * Create retina-friendly image (as DataURL)
 *
 * @param pixelMap {Array<Array<Number>>}
 * @param colorMap {Object<*, [Number, Number, Number, ?Number]>}
 * @param scale    {Number=1}
 * @return {String}
 */
export function createImage (pixelMap, colorMap, scale = 1) {
  const width = pixelMap[0].length
  const height = pixelMap.length

  const canvas = document.createElement('canvas')
  Object.assign(canvas, {width, height})

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(width, height)

  pixelMap.flat().forEach((ci, idx) => {
    if (!ci) return

    const i = idx * 4
    const color = colorMap[ci]
    if (color) {
      imageData.data[i    ] = color[0]
      imageData.data[i + 1] = color[1]
      imageData.data[i + 2] = color[2]
      imageData.data[i + 3] = color[3] ?? 255
    }
  })
  ctx.putImageData(imageData, 0, 0)

  return (devicePixelRatio * scale > 1 ? scaleImage(canvas, devicePixelRatio * scale) : canvas).toDataURL()
}

/**
 * Scale an image without smoothing
 *
 * @param source {HTMLCanvasElement}
 * @param scale  {Number}
 * @return {HTMLCanvasElement}
 */
function scaleImage (source, scale) {
  const canvas = document.createElement('canvas')
  canvas.width = source.width * scale
  canvas.height = source.height * scale

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, canvas.width, canvas.height)

  return canvas
}
