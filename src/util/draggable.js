/**
 * Created by ebi on 2017/10/31.
 */
let isDragging = false
const supportTouch = typeof window === 'object' && 'ontouchstart' in window
const supportMouse = typeof window === 'object' && 'onmousedown' in window
let currentEventType = 'mouse'

export default function (element, options) {
  const moveFn = function (event) {
    if (options.drag) {
      options.drag(currentEventType === 'touch' ? event.changedTouches[0] || event.touches[0] : event)
    }
  }

  const endFn = function (event) {
    supportMouse && options.resetListener && element.removeEventListener('mousedown', startFn)
    supportTouch && options.resetListener && element.removeEventListener('touchstart', startFn)
    if (currentEventType === 'mouse') {
      document.removeEventListener('mousemove', moveFn)
      document.removeEventListener('mouseup', endFn)
    }
    if (currentEventType === 'touch') {
      element.removeEventListener('touchmove', moveFn)
      element.removeEventListener('touchend', endFn)
      element.removeEventListener('touchcancel', endFn)
    }
    document.onselectstart = null
    document.ondragstart = null

    isDragging = false

    if (options.end) {
      options.end(currentEventType === 'touch' ? event.changedTouches[0] || event.touches[0] : event)
    }
  }

  const startFn = function (event) {
    currentEventType = (event.type === 'mousedown' ? 'mouse' : 'touch')
    if (isDragging) return
    event.preventDefault()
    document.onselectstart = function () { return false }
    document.ondragstart = function () { return false }

    if (currentEventType === 'mouse') {
      document.addEventListener('mousemove', moveFn)
      document.addEventListener('mouseup', endFn)
    }
    if (currentEventType === 'touch') {
      element.addEventListener('touchmove', moveFn)
      element.addEventListener('touchend', endFn)
      element.addEventListener('touchcancel', endFn)
    }
    isDragging = true

    if (options.start) {
      options.start(currentEventType === 'touch' ? event.changedTouches[0] || event.touches[0] : event)
    }
  }
  supportTouch && element.addEventListener('touchstart', startFn)
  supportMouse && element.addEventListener('mousedown', startFn)
}
