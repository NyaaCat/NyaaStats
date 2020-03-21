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
