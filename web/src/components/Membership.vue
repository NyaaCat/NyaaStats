<template>
  <div class="col-md-6">
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title"><span class="glyphicon glyphicon-info-sign" aria-hidden="true" />&nbsp; Membership</h3>
      </div>
      <div class="panel-body">
        <div class="list-group">
          <li v-if="player.data.time_start" class="list-group-item">
            <h4 class="list-group-item-heading">
              {{ timeStart }}
            </h4>
            <p class="list-group-item-text text-muted">First Login</p>
          </li>
          <li v-if="player.data.time_last" class="list-group-item">
            <h4 class="list-group-item-heading">
              {{ timeLast }}
            </h4>
            <p class="list-group-item-text text-muted">Last Active</p>
          </li>
          <li v-if="player.data.time_lived" class="list-group-item">
            <h4 class="list-group-item-heading">{{ timeLived }}</h4>
            <p class="list-group-item-text text-muted">Total Online</p>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {add, format, formatDistanceStrict} from 'date-fns'

  export default {
    name: 'Membership',

    props: {
      player: {
        type: Object,
        required: true,
      },
    },

    computed: {
      ...mapState(['info']),

      timeStart () {
        return format(new Date(this.player.data.time_start), 'yyyy-MM-dd HH:mm:ss xx')
      },
      timeLast () {
        return format(new Date(this.player.data.time_last), 'yyyy-MM-dd HH:mm:ss xx')
      },
      timeLived () {
        const date = new Date()
        const baseDate = add(date, {seconds: -this.player.data.time_lived})
        return formatDistanceStrict(date, baseDate, {unit: 'hour'})
      },
    },
  }
</script>
