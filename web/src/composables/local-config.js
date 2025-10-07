import {reactive, watch} from 'vue'

const StorageKey = {
  Lang: 'config_lang',
  ShowAllAdvancements: 'config_show_all_advancements',
  ShowLongStatistics: 'config_show_long_statistics',
}

function handleBooleanStorage (key, val) {
  if (val) localStorage.setItem(key, '1')
  else localStorage.removeItem(key)
}

const data = reactive({
  lang: localStorage.getItem(StorageKey.Lang) ?? 'zh_cn',
  showAllAdvancements: Boolean(+localStorage.getItem(StorageKey.ShowAllAdvancements)),
  showLongStatistics: Boolean(+localStorage.getItem(StorageKey.ShowLongStatistics)),
})

function setLangAttr () {
  document.documentElement.setAttribute('lang', {'zh_cn': 'cmn', 'en_us': 'en'}[data.lang])
}

watch(() => data.lang, value => {
  localStorage.setItem(StorageKey.Lang, value)
  setLangAttr()
})

watch(() => data.showAllAdvancements, value => handleBooleanStorage(StorageKey.ShowAllAdvancements, value))

watch(() => data.showLongStatistics, value => handleBooleanStorage(StorageKey.ShowLongStatistics, value))

setLangAttr()

export default function useLocalConfig () {
  return data
}
