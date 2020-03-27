import langData from '@/assets/lang.json'
import useLocalConfig from './local-config'

const config = useLocalConfig()

function t (key, ...args) {
  /** @type {String | undefined} */
  const tmpl = langData[config.lang][key]
  return tmpl
    ? /%(?!=%)/.test(tmpl)
      ? tmpl.split('%s').reduce((result, part, idx) => result + args[idx - 1] + part)
      : tmpl
    : key
}

Object.defineProperty(t, 'lang', {
  get () {
    return config.lang
  },
})

export default function useLang () {
  return {
    lang: config.lang,
    t,
  }
}
