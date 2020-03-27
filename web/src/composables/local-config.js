import Vue from 'vue'

const StorageKey = {
  Lang: 'config_lang',
  ShowAllAdvancements: 'config_show_all_advancements',
  ShowLongStatistics: 'config_show_long_statistics',
}

function handleBooleanStorage (key, val) {
  if (val) localStorage.setItem(key, '1')
  else localStorage.removeItem(key)
}

const vm = new Vue({
  data: {
    lang: localStorage.getItem(StorageKey.Lang) ?? 'zh_cn',
    showAllAdvancements: Boolean(+localStorage.getItem(StorageKey.ShowAllAdvancements)),
    showLongStatistics: Boolean(+localStorage.getItem(StorageKey.ShowLongStatistics)),
  },

  watch: {
    lang (val) {
      localStorage.setItem(StorageKey.Lang, val)
    },
    showAllAdvancements: val => handleBooleanStorage(StorageKey.ShowAllAdvancements, val),
    showLongStatistics: val => handleBooleanStorage(StorageKey.ShowLongStatistics, val),
  },
})

export default function useLocalConfig () {
  return {
    get lang () {return vm.lang},
    set lang (val) {vm.lang = val},

    get showAllAdvancements () {return vm.showAllAdvancements},
    set showAllAdvancements (val) {vm.showAllAdvancements = val},

    get showLongStatistics () {return vm.showLongStatistics},
    set showLongStatistics (val) {vm.showLongStatistics = val},
  }
}
