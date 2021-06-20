import { ref, onMounted } from 'vue'

export default {
  name: 'ClientOnly',
  setup (_, { slots }) {
    const show = ref(false)
    onMounted(() => {
      show.value = true
    })

    return () => (show.value && slots.default ? slots.default() : null)
  }
}
