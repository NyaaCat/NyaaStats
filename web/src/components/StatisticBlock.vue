<template>
  <div class="p-4 border border-gray-300 rounded-md text-sm flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 mr-1">
      <path d="M3 12h4v9H3v-9zm14-4h4v13h-4V8zm-7-6h4v19h-4V2z" />
    </svg>
    <span class="text-blue-600 mr-1">{{ numAbbr(player.stats[prop]) }}</span>
    <span class="text-gray-600">{{ langData.stat[prop] }}</span>
  </div>
</template>

<script>
  import langData from '../assets/lang.json'

  export default {
    name: 'StatisticBlock',

    props: {
      player: {
        type: Object,
        required: true,
      },

      prop: {
        type: String,
        required: true,
      },
    },

    data() {
      return {
        langData,
      }
    },

    methods: {
      numAbbr(val) {
        const value = Math.round(val)
        let newValue = value
        if (value >= 1000) {
          const suffixes = ['', 'k', 'M', 'b']
          const suffixNum = Math.floor(`${value}`.length / 3)
          let shortValue = ''
          for (let precision = 2; precision >= 1; precision -= 1) {
            shortValue = parseFloat(
              (suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(
                precision,
              ),
            )
            const dotLessShortValue = `${shortValue}`.replace(
              /[^a-zA-Z 0-9]+/g,
              '',
            )
            if (dotLessShortValue.length <= 2) {
              break
            }
          }
          if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1)
          }
          newValue = shortValue + suffixes[suffixNum]
        }
        return newValue
      },
    },
  }
</script>
