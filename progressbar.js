const Gauge = require('gauge')

module.exports = class ProgressBar {
  constructor (total) {
    this.gauge = new Gauge()
    this.total = total
    this.completed = 0
    this.startTime = 0
    this.pulse = ''
  }

  tick (text) {
    this.completed += 1
    this.gauge.show(text, this.completed / this.total)
    const now = (new Date()).valueOf()
    const avgTime = (now - this.startTime) / this.completed
    const time = Math.floor((this.total - this.completed) * avgTime / 1000)
    this.pulse = `${this.completed}/${this.total} ${time}s left`
  }

  start () {
    this.gauge.show()
    this.timer = setInterval(() => {
      this.gauge.pulse(this.pulse)
    }, 100)
    this.startTime = (new Date()).valueOf()
  }

  stop () {
    clearInterval(this.timer)
    this.gauge.hide()
  }
}
