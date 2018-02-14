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
import { mapState } from 'vuex';

export default {
  name: 'Name',
  props: ['name'],
  computed: {
    ...mapState([
      'info',
    ]),
    changedToAt() {
      return moment(this.name.changedToAt).format(this.info.timeFormat ? this.info.timeFormat.compact : '');
    },
  },
};
</script>
