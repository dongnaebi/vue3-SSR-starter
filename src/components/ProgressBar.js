import { ref, h } from 'vue'

export default {
  name: 'ProgressBar',
  setup () {
    const show = ref(true)
    const percent = ref(0)
    let aniTimer = null

    function start () {
      percent.value = 0
      show.value = true
      function go () {
        aniTimer = setTimeout(() => {
          percent.value += 5
          if (percent.value < 90) {
            go()
          } else {
            clearTimeout(aniTimer)
          }
        }, 50 * (percent.value < 70 ? percent.value / 12 : percent.value / 5))
      }
      go()
    }

    function end () {
      percent.value = 100
      show.value = false
      clearTimeout(aniTimer)
      setTimeout(() => {
        percent.value = 0
      }, 400)
      setTimeout(() => {
        show.value = true
      }, 500)
    }

    return {
      show,
      percent,
      start,
      end
    }
  },
  render () {
    return h('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        transition: 'width 0.2s ease-in-out, opacity 0.4s ease-in-out',
        width: `${this.percent}%`,
        height: '2px',
        opacity: this.show ? 1 : 0,
        backgroundColor: '#41B883'
      }
    })
  }
}
