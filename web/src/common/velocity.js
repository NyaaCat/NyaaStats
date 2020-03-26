import 'velocity-animate'

HTMLElement.prototype.velocity = function (...args) {
  /* eslint-disable no-undef */
  Velocity(this, ...args)
}
