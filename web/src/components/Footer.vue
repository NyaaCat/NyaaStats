<template>
  <div>
    <footer class="xl:w-page mx-auto px-page py-5 xl:py-8 text-sm flex flex-col md:flex-row items-center">
      <p v-if="footerUpdateTime" class="mb-3 md:mb-0 text-gray-600">{{ `${t('nyaa.general.data_update_time')}${t('nyaa.symbol.colon_s')}${formatDate(footerUpdateTime)}` }}</p>
      <p class="md:ml-auto text-gray-500">&copy; {{ info.servername }}</p>
    </footer>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {normalizeDate} from '@/utils'

  export default {
    name: 'Footer',

    computed: {
      ...mapState(['info', 'footerUpdateTime']),
    },

    methods: {
      formatDate (val) {
        return normalizeDate(val)
      },
    },
  }
</script>
