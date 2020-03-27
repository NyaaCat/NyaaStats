<template>
  <div class="h-full relative" :data-prevent-clickaway="visible">
    <button class="h-full w-header -mr-offset relative z-10 focus:outline-none flex" @click="visible = !visible">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="m-auto w-6 h-6">
        <transition
          enter-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-class="translate-y-0"
          leave-to-class="translate-y-full"
          enter-active-class="transform origin-center transition-transform duration-200 easing-linear"
          leave-active-class="transform origin-center transition-transform duration-200 easing-linear"
        >
          <path v-show="!visible" d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
        </transition>
        <transition
          enter-class="-translate-y-full"
          enter-to-class="translate-y-0"
          leave-class="translate-y-0"
          leave-to-class="-translate-y-full"
          enter-active-class="transform origin-center transition-transform duration-200 easing-linear"
          leave-active-class="transform origin-center transition-transform duration-200 easing-linear"
        >
          <path v-show="visible" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
        </transition>
      </svg>
    </button>
    <SlidingTransition :duration="{enter: 300, leave: 200}">
      <div v-if="visible" class="fixed xl:absolute top-0 right-0 w-full md:w-menu xl:-mr-offset flex flex-col justify-end">
        <div class="h-screen md:h-auto max-h-screen bg-gray-700 md:rounded-bl-md xl:rounded-br-md md:shadow-lg text-white flex flex-col">
          <div class="flex-none h-header border-b border-gray-600" />
          <div class="flex-1 md:rounded-bl-md xl:rounded-br-md overflow-auto flex flex-col">
            <section class="py-4 border-b border-transparent">
              <h3 class="mb-4 px-4 text-sm text-cool-gray-400 uppercase tracking-wide">{{ t('nyaa.player_advancements.section_title') }}</h3>
              <label class="px-4 h-12 bg-cool-gray-600 cursor-pointer flex items-center">
                <span>{{ t('nyaa.config.show_all_advancements') }}</span>
                <FormSwitch v-model="config.showAllAdvancements" class="ml-auto" />
              </label>
            </section>
            <section class="py-4 border-b border-transparent">
              <h3 class="mb-4 px-4 text-sm text-cool-gray-400 uppercase tracking-wide">{{ t('nyaa.player_statistics.section_title') }}</h3>
              <label class="px-4 h-12 bg-cool-gray-600 cursor-pointer flex items-center">
                <span>{{ t('nyaa.config.show_long_statistics') }}</span>
                <FormSwitch v-model="config.showLongStatistics" class="ml-auto" />
              </label>
            </section>
            <section class="py-4 border-b border-transparent">
              <h3 class="mb-4 px-4 text-sm text-cool-gray-400 uppercase tracking-wide">{{ t('nyaa.app_menu.section_title.others') }}</h3>
              <div class="px-4 h-12 bg-cool-gray-600 flex items-center">
                <span>{{ t('nyaa.config.display_language') }}</span>
                <span class="ml-auto flex">
                  <label :class="['flex-1 px-4 h-7 rounded cursor-pointer flex items-center', config.lang === 'zh_cn' ? 'bg-blue-500' : null]">
                    <!-- eslint-disable vue/max-attributes-per-line -->
                    <input v-model="config.lang" value="zh_cn" type="radio" class="hidden">
                    <span>中文</span>
                  </label>
                  <label :class="['flex-1 px-4 h-7 rounded cursor-pointer flex items-center', config.lang === 'en_us' ? 'bg-blue-500' : null]">
                    <!-- eslint-disable vue/max-attributes-per-line -->
                    <input v-model="config.lang" value="en_us" type="radio" class="hidden">
                    <span>English</span>
                  </label>
                </span>
              </div>
            </section>
            <footer class="mt-auto flex-none pt-1 pb-5">
              <p class="text-xs text-cool-gray-400 text-center">Made by SilentDepth</p>
              <p class="md:hidden mt-3 text-sm text-cool-gray-400 text-center">&copy; {{ $store.state.info.servername }}</p>
            </footer>
          </div>
        </div>
      </div>
    </SlidingTransition>
  </div>
</template>

<script>
  import SlidingTransition from '@/components/SlidingTransition.vue'
  import FormSwitch from '@/components/FormSwitch.vue'
  import useLocalConfig from '@/composables/local-config'

  export default {
    name: 'AppMenu',

    components: {
      SlidingTransition,
      FormSwitch,
    },

    data () {
      const config = useLocalConfig()

      return {
        visible: false,

        config,
      }
    },

    watch: {
      visible (val, oldVal) {
        if (val && !oldVal) {
          document.body.addEventListener('click', this.onClickAway, true)
        } else if (!val) {
          this.offClickAway()
        }
      },
    },

    methods: {
      onClickAway ({target}) {
        let el = target
        do {
          if (el.dataset.preventClickaway) return
        } while ((el = el.parentElement))
        this.visible = false
        this.offClickAway()
      },

      offClickAway () {
        document.body.removeEventListener('click', this.onClickAway, true)
      },
    },
  }
</script>

<style scoped>
  @responsive {
    .-mr-offset {
      margin-right: calc(-1 * (theme('spacing.header') - theme('spacing.6')) / 2);
    }

    .w-menu {
      width: 400px;
    }
  }
</style>
