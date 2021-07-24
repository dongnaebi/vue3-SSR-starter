import { useSXO } from '../hooks/app'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'

export default function sxoImplement () {
  const { SEO, SMO } = useSXO()
  useHead({
    title: computed(() => `${SEO.value.title} - vue3-SSR-starter`),
    meta: [
      { name: 'description', content: computed(() => SEO.value.description) },
      { name: 'keywords', content: computed(() => SEO.value.keywords) },
      // OGP
      { property: 'og:site_name', content: 'vue3-SSR-starter' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: computed(() => SMO.value.title) },
      { property: 'og:description', content: computed(() => SMO.value.description) },
      { property: 'og:image', content: computed(() => SMO.value.image) },
      { property: 'og:url', content: computed(() => SMO.value.url) },
      // QQ
      { itemprop: 'name', content: computed(() => SMO.value.title) },
      { itemprop: 'description', content: computed(() => SMO.value.description) },
      { itemprop: 'image', content: computed(() => SMO.value.image) }
    ],
    script: [
      // for wechat
      {
        children: computed(() => `var WECHAT_SHARE_INFO = {
          title: '${SMO.value.title}',
          desc: '${SMO.value.description}',
          link: '${SMO.value.url}',
          imgUrl: '${SMO.value.image}',
        }`)
      }
    ]
  })
}
