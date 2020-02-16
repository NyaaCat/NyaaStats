<template>
  <li class="list-group-item">
    <h5>
      {{ name.name }}
      <small v-if="name.changedToAt">Changed at {{ changedToAt }}</small>
      <small v-if="!name.changedToAt" />
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
