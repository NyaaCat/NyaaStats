<template>
  <li class="list-group-item">
    <h5>
      {{name.name}}
      <small v-if="name.changedToAt">Changed at {{changedToAt}}</small>
      <small v-if="!name.changedToAt">Initial</small>
    </h5>
  </li>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Name',
  props: ['name', 'info'],
  computed: {
    changedToAt() {
      return moment(name.changedToAt).format(this.info.timeFormat ? this.info.timeFormat.compact : '');
    },
  },
};
</script>
