import langData from '@/assets/lang.json'
import useLocalConfig from './local-config'

const config = useLocalConfig()

function t (key) {
  return langData[config.lang][key] ?? key
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
