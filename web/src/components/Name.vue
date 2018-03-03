<template>
  <li class="list-group-item">
    <h5>
      {{name.name}}
      <small v-if="name.changedToAt">{{$t('changed-at')}} {{changedToAt}}</small>
      <small v-if="!name.changedToAt"></small>
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

<i18n>
en:
  changed-at: Changed at
zh-cn:
  changed-at: 变更于
</i18n>
