<template>
  <div class="bg-white md:rounded-md shadow overflow-hidden">
    <header class="border-b border-gray-300 bg-gray-100 md:rounded-t-md flex flex-col">
      <div class="px-page xl:px-5 flex items-center">
        <h2 class="py-3 xl:py-4 text-cool-gray-700 text-lg xl:text-xl font-medium uppercase tracking-wide">{{ t('nyaa.player_statistics.section_title') }}</h2>
        <button class="ml-auto p-1 -mr-1 flex" @click="showConfig = !showConfig">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="['w-6 h-6', showConfig ? 'fill-black' : 'fill-gray-500']">
            <path d="M8 7a5 5 0 1 0 0 10h8a5 5 0 0 0 0-10H8zm0-2h8a7 7 0 0 1 0 14H8A7 7 0 0 1 8 5zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
        </button>
      </div>
      <SlidingTransition :duration="150">
        <div v-show="showConfig" style="height: 0;">
          <label class="px-page xl:px-5 py-3 border-t border-gray-300 cursor-pointer flex items-center">
            <span>{{ t('nyaa.config.show_long_statistics') }}</span>
            <FormSwitch v-model="config.showLongStatistics" class="ml-auto" />
          </label>
        </div>
      </SlidingTransition>
    </header>
    <div class="-mb-px lg:-ml-px lg:flex lg:flex-wrap">
      <div
        v-for="[key, value, unit] of entries"
        :key="key"
        class="lg:flex-grow-0 lg:flex-shrink lg:w-1/2 xl:w-1/3 px-4 md:px-5 py-3 xl:py-4 border-b lg:border-l border-gray-300"
      >
        <div class="text-sm flex items-center">
          <span class="mr-1">{{ t(statKey2LangKey(key)) }}{{ t.lang !== 'zh_cn' ? ' ' : null }}{{ t('nyaa.symbol.parentheses.left') }}{{ t(unit) }}{{ t('nyaa.symbol.parentheses.right') }}</span>
          <span class="ml-auto text-blue-700">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import langData from '@/assets/lang.json'
  import SlidingTransition from '@/components/SlidingTransition.vue'
  import FormSwitch from '@/components/FormSwitch.vue'
  import useLang from '@/composables/lang'
  import useLocalConfig from '@/composables/local-config'

  const ENTRIES = [
    {
      key: 'minecraft:custom/minecraft:walk_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:crouch_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:sprint_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:swim_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:fall_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:climb_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:minecart_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:boat_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:horse_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:aviate_one_cm',
      transform: val => humanizeNumber(val / 100),
      unit: 'nyaa.unit.distance_meter.plural',
    },
    {
      key: 'minecraft:custom/minecraft:jump',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:deaths',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:damage_dealt',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.health_point.plural',
    },
    {
      key: 'minecraft:custom/minecraft:damage_taken',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.health_point.plural',
    },
    {
      key: 'minecraft:custom/minecraft:mob_kills',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:player_kills',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:fish_caught',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:traded_with_villager',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
    {
      key: 'minecraft:custom/minecraft:leave_game',
      transform: val => humanizeNumber(val),
      unit: 'nyaa.unit.action_time.plural',
    },
  ]

  const config = useLocalConfig()

  /**
   * Fix statistics value overflow issue
   *
   * @param {Number} val
   */
  function fixOverflow (val) {
    const INT_32_MAX = Math.pow(2, 31)
    return val >= 0 ? val : val + INT_32_MAX * 2
  }

  /**
   * @param {Number} val
   * @return {String}
   */
  function humanizeNumber (val) {
    if (config.showLongStatistics) return String(val)

    const {lang} = useLang()
    // TODO: Use i18n API (possibly?)
    const SCALE_SIZE = lang === 'zh_cn' ? 10000 : 1000
    const SCALES = lang === 'zh_cn' ? ['', ' 万', ' 亿', ' 兆'] : ['', 'K', 'M', 'G', 'T']

    const scaleIdx = Math.max(SCALES.findIndex((s, idx) => SCALE_SIZE ** idx >= val) - 1, 0)
    const number = Math.floor(val / SCALE_SIZE ** scaleIdx)
    return number + SCALES[scaleIdx]
  }

  /**
   * @param {String} statKey
   */
  function statKey2LangKey (statKey) {
    const [, , , name] = statKey.split(/[:/]/)
    return 'stat.minecraft.' + name
  }

  export default {
    name: 'PlayerStatistics',

    components: {
      SlidingTransition,
      FormSwitch,
    },

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        showConfig: false,

        langData,
        config,
      }
    },

    computed: {
      entries () {
        config.showLongStatistics // Notify the watcher
        return ENTRIES.map(({key, transform, unit}) => {
          const raw = fixOverflow(this.player.stats[key] ?? 0)
          return [key, transform?.(raw) ?? raw, unit]
        })
      },
    },

    methods: {
      statKey2LangKey,
    },
  }
</script>
