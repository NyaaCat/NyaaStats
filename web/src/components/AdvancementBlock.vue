<template>
  <div class="advancement-block">
    <AdvancementTitle :advancement-id="adv.advId" />
    <div v-if="requirements.length > 1" class="advancement-requirements relative">
      <AdvancementDescription class="advancement-requirements__inner absolute w-full">
        <p v-for="req of requirements" :key="req" :class="achieved.includes(req) && 'done'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path :d="achieved.includes(req) | svgPath" />
          </svg>
          {{ lang(advData.requirement_names[req]) }}
        </p>
      </AdvancementDescription>
    </div>
  </div>
</template>

<script>
  import advancementData from '@/assets/advancement-data'
  import AdvancementTitle from './AdvancementTitle'
  import AdvancementDescription from './AdvancementDescription'

  export default {
    name: 'AdvancementBlock',

    components: {
      AdvancementTitle,
      AdvancementDescription,
    },

    filters: {
      svgPath: val =>
        val
          ? 'M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z'
          : 'M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z',
    },

    props: {
      adv: {
        type: Object,
        required: true,
      },
    },

    computed: {
      advData() {
        return advancementData[this.adv.advId]
      },

      requirements() {
        return this.advData.requirements || []
      },

      achieved() {
        const uuid = this.$route.params.uuid
        const player = this.$store.state.players[uuid].advancements[
          this.adv.advId
        ]
        return Object.keys(player.criteria)
      },
    },
  }
</script>

<style>
.advancement-block {
  margin-bottom: 28px;
}

.advancement-requirements {
  top: -14px;
  z-index: 1;
}

.advancement-requirements__inner {
  display: none;
  color: #fff;
  line-height: 1;
}

.advancement-requirements__inner p {
  margin: 2px 0;
  color: #aaa;
  font-size: 17px;
  display: flex;
  align-items: center;
}

.advancement-requirements__inner p svg {
  width: 1em;
  height: 1em;
}

.advancement-requirements__inner p.done {
  color: #fff;
}

.advancement-requirements__inner p.done svg {
  fill: #0a0;
}

.advancement-requirements__inner p:not(.done) svg {
  fill: #f55;
}

.advancement-block:hover .advancement-title {
  z-index: 2;
}

.advancement-block:hover .advancement-requirements__inner {
  display: block;
}
</style>
