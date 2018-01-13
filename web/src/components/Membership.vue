<template>
  <div class="col-md-6">
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">
          <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;
          Membership
        </h3>
      </div>
      <div class="panel-body">
        <div class="list-group">
          <li v-if="player.data.time_start" class="list-group-item">
            <h4 class="list-group-item-heading">
              {{timeStart}}
            </h4>
            <p class="list-group-item-text text-muted">First Login</p>
          </li>
          <li v-if="player.data.time_last" class="list-group-item">
            <h4 class="list-group-item-heading">
              {{timeLast}}
            </h4>
            <p class="list-group-item-text text-muted">Last Active</p>
          </li>
          <li v-if="player.data.time_lived" class="list-group-item">
            <h4 class="list-group-item-heading">
              {{timeLived}} Hours
            </h4>
            <p class="list-group-item-text text-muted">Total Online</p>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'Membership',
  props: ['player'],
  computed: {
    ...mapState([
      'info',
    ]),
    timeStart() {
      return moment(this.player.data.time_start).format(this.info.timeFormat ? this.info.timeFormat.full : '');
    },
    timeLast() {
      return moment(this.player.data.time_last).format(this.info.timeFormat ? this.info.timeFormat.full : '');
    },
    timeLived() {
      return moment.duration(this.player.data.time_lived, 'seconds').asHours().toFixed(1);
    },
  },
};
</script>
