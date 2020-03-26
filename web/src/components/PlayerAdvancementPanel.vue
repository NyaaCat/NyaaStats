<template>
  <div class="mb-5 bg-white md:rounded-md shadow">
    <header class="border-b border-gray-300 bg-gray-100 md:rounded-t-md flex flex-col">
      <div class="px-page xl:px-5 flex items-center">
        <h2 class="py-3 xl:py-4 text-cool-gray-700 text-lg xl:text-xl font-medium uppercase tracking-wide">进度</h2>
        <button class="ml-auto p-1 -mr-1 focus:outline-none flex" @click="showConfig = !showConfig">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="['w-6 h-6', showConfig ? 'fill-black' : 'fill-gray-500']">
            <path d="M8 7a5 5 0 1 0 0 10h8a5 5 0 0 0 0-10H8zm0-2h8a7 7 0 0 1 0 14H8A7 7 0 0 1 8 5zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
        </button>
      </div>
      <SlidingTransition :duration="150">
        <div v-show="showConfig" style="height: 0;">
          <label class="px-page xl:px-5 py-3 border-t border-gray-300 cursor-pointer flex items-center">
            <span>显示未解锁进度</span>
            <span class="ml-auto">
              <input v-model="config.showAllAdvancements" type="checkbox" class="hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" class="h-6">
                <path d="M50 100A50 50 0 0150 0h80a50 50 0 010 100H50z" :class="config.showAllAdvancements ? 'fill-blue-500' : 'fill-gray-400'" />
                <!-- eslint-disable vue/max-attributes-per-line -->
                <circle :cx="config.showAllAdvancements ? 130 : 50" cy="50" r="40" class="fill-white" />
              </svg>
            </span>
          </label>
        </div>
      </SlidingTransition>
    </header>
    <section
      v-for="([group, {title, data}], idx) of Object.entries(advancementGroups)"
      :key="group"
      :class="[{'border-t border-gray-300': idx}]"
    >
      <h3 class="px-page xl:px-5 py-3 xl:py-4 border-b border-gray-300 flex items-center">
        <span class="text-cool-gray-700 uppercase tracking-wide">{{ title }}</span>
        <span class="ml-auto text-cool-gray-500">{{ data.filter(adv => adv.done).length }}/{{ getGroupTotal(group) }} 已完成</span>
      </h3>
      <div class="px-page xl:px-4 py-2 lg:flex lg:flex-wrap lg:-ml-5">
        <div
          v-for="(adv, idx) of data"
          :key="adv.id"
          :class="['lg:flex-grow-0 lg:flex-shrink lg:w-1/2 xl:w-1/3 lg:pl-5 py-1 md:overflow-visible transition-opacity duration-100 ease-linear', {'opacity-50': openedAdv && openedAdv !== adv.id, 'second': idx % 2 === 1, 'third': idx % 3 === 2}]"
        >
          <AdvancementTitle
            v-show="openedAdv !== adv.id"
            :advancement-id="adv.id"
            :player="player"
            :color-map="mouseHoverAdv === adv.id ? hoverColorMap : 'none'"
            :data-prevent-clickaway="Boolean(openedAdv)"
            :class="['cursor-pointer', {'opacity-50 hover:opacity-100': !adv.criteria}]"
            @mouseenter.native="mouseHoverAdv = adv.id"
            @mouseleave.native="mouseHoverAdv = mouseHoverAdv === adv.id ? null : mouseHoverAdv"
            @click.native="player && (openedAdv = adv.id)"
          >
            <template #default="{title, progress, total}">
              <span :title="title" class="truncate">{{ title }}</span>
              <span v-if="total > 1" class="text-gray-500" style="padding-left: 6px;">({{ progress }}/{{ total }})</span>
            </template>
          </AdvancementTitle>
          <AdvancementInfoPanel
            v-if="openedAdv === adv.id"
            ref="openedPanel"
            :advancement-id="adv.id"
            :player="player"
            expandable="auto"
            data-prevent-clickaway="true"
            class="lg:w-info-panel-lg x-float-right md:relative md:z-10"
            @after-collapse="openedAdv === adv.id && (openedAdv = null)"
          >
            <template v-if="!player.advancements[adv.id]" #default>
              <p>未解锁</p>
            </template>
          </AdvancementInfoPanel>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import advancementDB from '@/assets/advancement-data.json'
  import AdvancementTitle from '@/components/AdvancementTitle.vue'
  import AdvancementInfoPanel from '@/components/AdvancementInfoPanel.vue'
  import SlidingTransition from '@/components/SlidingTransition.vue'
  import useLocalConfig from '@/composables/local-config'
  import {parseDate} from '@/common/utils'

  export default {
    name: 'PlayerAdvancementPanel',

    components: {
      AdvancementInfoPanel,
      AdvancementTitle,
      SlidingTransition,
    },

    props: {
      /**
       * Complete player stats data (stats.json)
       */
      player: {
        type: Object,
        required: true,
      },
    },

    data () {
      return {
        showConfig: false,
        config: useLocalConfig(),

        mouseHoverAdv: null,
        openedAdvsRefresh: 1,
        openedAdvs: new Set,
        openedAdv: null,
      }
    },

    computed: {
      advancementGroups () {
        const groups = {
          story: {
            title: this.t('advancements.story.root.title'),
            data: [],
          },
          nether: {
            title: this.t('advancements.nether.root.title'),
            data: [],
          },
          end: {
            title: this.t('advancements.end.root.title'),
            data: [],
          },
          adventure: {
            title: this.t('advancements.adventure.root.title'),
            data: [],
          },
          husbandry: {
            title: this.t('advancements.husbandry.root.title'),
            data: [],
          },
        }

        for (const id of Object.keys(advancementDB)) {
          const [, group] = id.split(/[:/]/)

          if (this.config.showAllAdvancements || this.player?.advancements?.[id]) {
            groups[group].data.push({
              id,
              ...this.player.advancements[id] ? {...this.player?.advancements[id]} : {},
            })
          }
        }

        for (const {data} of Object.values(groups)) {
          data.sort((a, b) => Math.max(...[...Object.values(b.criteria ?? {})].map(s => parseDate(s).getTime())) - Math.max(...[...Object.values(a.criteria ?? {})].map(s => parseDate(s).getTime())))
        }

        return groups
      },

      hoverColorMap: () => ({
        1: [210, 214, 220],
        2: [244, 245, 247],
        3: [244, 245, 247],
        4: [244, 245, 247],
      }),
    },

    watch: {
      openedAdv (val, oldVal) {
        if (val && !oldVal) {
          document.body.addEventListener('click', this.onClickAway, true)
        } else if (!val) {
          this.offClickAway()
        }
      },
    },

    methods: {
      getGroupTotal (group) {
        return Object.keys(advancementDB).filter(k => k.startsWith('minecraft:' + group)).length
      },

      onClickAway ({target}) {
        let el = target
        do {
          if (el.dataset.preventClickaway) return
        } while ((el = el.parentElement))
        this.$refs.openedPanel[0].toggle()
        this.offClickAway()
      },

      offClickAway () {
        document.body.removeEventListener('click', this.onClickAway, true)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .transition-height {
    transition-property: height;
  }

  @responsive {
    .w-info-panel-lg {
      width: 400px;
    }
  }

  @screen lg {
    .second .x-float-right {
      @apply float-right;
    }
  }

  @screen xl {
    .second .x-float-right {
      @apply float-none;
    }

    .third .x-float-right {
      @apply float-right;
    }
  }
</style>
