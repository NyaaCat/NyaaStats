import Timeout = NodeJS.Timeout

import Gauge from 'gauge'

export default class ProgressBar {
  gauge: Gauge
  total: number
  completed: number
  startTime: number
  pulse: string
  timer?: Timeout

  constructor (total: number) {
    this.gauge = new Gauge()
    this.total = total
    this.completed = 0
    this.startTime = 0
    this.pulse = ''
  }

  tick (text: string): void {
    this.completed += 1
    this.gauge.show(text, this.completed / this.total)
    const now = (new Date()).valueOf()
    const avgTime = (now - this.startTime) / this.completed
    const time = Math.floor((this.total - this.completed) * avgTime / 1000)
    this.pulse = `${this.completed}/${this.total} ${time}s left`
  }

  start (): void {
    this.gauge.show()
    this.timer = setInterval(() => {
      this.gauge.pulse(this.pulse)
    }, 100)
    this.startTime = (new Date()).valueOf()
  }

  stop (): void {
    this.timer && clearInterval(this.timer)
    this.gauge.hide()
  }
}
