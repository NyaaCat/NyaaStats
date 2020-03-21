import Vue from 'vue'

const StorageKey = {
  Lang: 'config_lang',
  ShowAllAdvancements: 'config_show_all_advancements',
}

const vm = new Vue({
  data: {
    lang: localStorage.getItem(StorageKey.Lang) ?? 'zh_cn',
    showAllAdvancements: Boolean(+localStorage.getItem(StorageKey.ShowAllAdvancements)),
  },

  watch: {
    lang (val) {
      localStorage.setItem(StorageKey.Lang, val)
    },
    showAllAdvancements (val) {
      if (val) localStorage.setItem(StorageKey.ShowAllAdvancements, '1')
      else localStorage.removeItem(StorageKey.ShowAllAdvancements)
    },
  },
})

export default function useLocalConfig () {
  return {
    get lang () {return vm.lang},
    set lang (val) {vm.lang = val},

    get showAllAdvancements () {return vm.showAllAdvancements},
    set showAllAdvancements (val) {vm.showAllAdvancements = val},
  }
}
