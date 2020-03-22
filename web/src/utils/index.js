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
 * @param {Date | String} date
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
