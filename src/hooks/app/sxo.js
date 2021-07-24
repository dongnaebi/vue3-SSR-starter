import { inject, ref } from 'vue'

const key = Symbol('SEO/SMO')

export function useSXO () {
  return inject(key)
}

export function createSXO (app, syncState) {
  const SEO = ref({
    title: '',
    description: '',
    keywords: ''
  })
  // https://ogp.me/
  const SMO = ref({
    title: '',
    description: '',
    image: '',
    url: ''
  })
  function setSEO (options) {
    SEO.value = Object.assign(SEO.value, options)
  }
  function setSMO (options) {
    SMO.value = Object.assign(SMO.value, options)
  }

  const SXO = {
    SEO,
    SMO,
    setSEO,
    setSMO
  }
  app.provide(key, SXO)
  return SXO
}
