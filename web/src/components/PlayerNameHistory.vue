<template>
  <ul class="bg-white overflow-hidden">
    <li
      v-for="({name, changedToAt}, idx) of names"
      :key="changedToAt || 'init'"
      :class="['p-3 border-t first:border-t-0 border-gray-300 flex items-center', {'bg-gray-50 text-gray-500': idx < lastInServer || firstInServer < idx}]"
    >
      <strong class="font-normal mr-3">{{ name }}</strong>
      <span class="ml-auto text-gray-500 font-tnum">{{ formatDate(changedToAt) || t('nyaa.player_name_history.first_name') }}</span>
    </li>
    <li v-if="isLoadingNameHistory" class="p-3 border-t first:border-t-0 border-gray-300 bg-gray-100 text-gray-500 flex items-center">{{ t('nyaa.general.loading_hint') }}</li>
  </ul>
</template>

<script>
  import axios from 'axios'

  import {normalizeDate} from '@/common/utils'

  export default {
    name: 'PlayerNameHistory',

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        names: this.player.data.names,
        isLoadingNameHistory: true,
      }
    },

    computed: {
      // Index of the last name used in server
      lastInServer () {
        return this.names.findIndex(({changedToAt}) => (changedToAt ?? -Infinity) < this.player.data.time_last)
      },

      // Index of the first name used in server
      firstInServer () {
        return this.names.findIndex(({changedToAt}) => (changedToAt ?? -Infinity) < this.player.data.time_start)
      },
    },

    created () {
      this.loadNameHistory()
    },

    methods: {
      async loadNameHistory () {
        if (this.names.slice(-1)[0].changedToAt) {
          const {data} = await axios(
            process.env.NODE_ENV === 'development'
              ? `/mojang-api/user/profiles/${this.player.data.uuid_short}/names`
              : `https://mojang-api.silent.land/${location.host}/user/profiles/${this.player.data.uuid_short}/names`
          )
          this.names = data.reverse()
        }

        this.isLoadingNameHistory = false
      },

      formatDate (val) {
        return val && normalizeDate(val, 'short')
      },
    },
  }
</script>
