<template>
  <li class="list-group-item">
    <h5 class="text-sm font-medium">
      {{ name.name }}
      <small v-if="name.changedToAt" class="font-normal text-gray-600">Changed at {{ changedToAt }}</small>
    </h5>
  </li>
</template>

<script>
  import {mapState} from 'vuex'
  import {format} from 'date-fns'

  export default {
    name: 'Name',

    props: {
      name: {
        type: Object,
        required: true,
      },
    },

    computed: {
      ...mapState(['info']),

      changedToAt () {
        return format(new Date(this.name.changedToAt), 'yyyy-MM-dd HH:mm:ss xx')
      },
    },
  }
</script>
