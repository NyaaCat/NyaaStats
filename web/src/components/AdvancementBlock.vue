<template>
  <div class="advancement-block col-sm-12 col-md-6 col-lg-4">
    <AdvancementTitle :advancement-id="adv.advId" />
  </div>
</template>

<script>
import AdvancementTitle from './AdvancementTitle'

export default {
  name: 'AdvancementBlock',

  components: {
    AdvancementTitle,
  },

  props: ['adv'],
}
</script>

<style>
.advancement-block {
  margin-bottom: 28px;
}
</style>
