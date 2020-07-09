<template>
  <PlayerAsidePanel :title="t('nyaa.player_name_history.section_title')">
    <ul class="bg-white overflow-hidden">
      <li
        v-for="({name, changedToAt}, idx) of names"
        :key="changedToAt || 'init'"
        :class="[
          'p-3 border-t first:border-t-0 border-gray-300 flex items-center',
          {'bg-gray-50 text-gray-500': idx < lastInServer || (firstInServer === -1 ? Infinity : firstInServer) < idx},
        ]"
      >
        <strong class="font-normal mr-3">{{ name }}</strong>
        <span class="ml-auto text-gray-500 font-tnum">{{ formatDate(changedToAt) || t('nyaa.player_name_history.first_name') }}</span>
      </li>
    </ul>
  </PlayerAsidePanel>
</template>

<script>
  import PlayerAsidePanel from '@/components/player-aside-panel.vue'
  import {normalizeDate} from '@/common/utils'

  export default {
    name: 'PlayerNameHistory',

    components: {
      PlayerAsidePanel,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        names: this.player.data.names,
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

    methods: {
      formatDate (val) {
        return val && normalizeDate(val, 'short')
      },
    },
  }
</script>
