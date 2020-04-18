<template>
  <div
    :class="[
      'block px-page transition duration-200 easing-linear',
      isFocused ? 'cursor-default' : 'cursor-pointer',
      keyword ? 'text-black' : 'text-gray-600',
      {'bg-white': isFocused, 'bg-gray-50': !isFocused && keyword},
    ]"
    @click="isFocused = true"
  >
    <div class="xl:w-page xl:mx-auto flex">
      <button ref="button" class="flex-none flex items-center" @click="() => {keyword && setKeyword(''); $refs.input.focus()}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 fill-current">
          <path v-if="!keyword" d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
          <path v-else d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
        </svg>
      </button>
      <input
        ref="input"
        :value="keyword"
        type="text"
        :placeholder="t('nyaa.general.search_placeholder')"
        class="flex-1 pl-2 pr-5 py-3 bg-transparent placeholder-gray-600 cursor-pointer focus:cursor-text"
        @focus="$event.target.select()"
        @blur="$event.relatedTarget !== $refs.button && (isFocused = false)"
        @input="setKeyword($event.target.value)"
      >
      <button class="flex-none ml-auto text-blue-600" @click.stop="goRandom">{{ t('nyaa.general.go_random_player') }}</button>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'

  import useRandomPlayer from '@/composables/random-player'

  export default {
    name: 'SearchBox',

    data () {
      const {goRandom} = useRandomPlayer()

      return {
        isFocused: false,

        goRandom,
      }
    },

    computed: {
      ...mapState(['keyword']),
    },

    watch: {
      isFocused (val) {
        if (val) {
          this.$refs.input.focus()
          this.$emit('focus')
          document.addEventListener('keyup', this.onPressEsc, true)
        } else {
          this.$refs.input.blur()
          this.$emit('blur')
          document.removeEventListener('keyup', this.onPressEsc, true)
        }
      },
    },

    methods: {
      ...mapMutations(['setKeyword']),

      /**
       * @param ev {KeyboardEvent}
       */
      onPressEsc (ev) {
        if (ev.key === 'Escape') {
          if (this.keyword) {
            this.setKeyword('')
          } else {
            this.$refs.input.blur()
          }
        }
      },
    },
  }
</script>
