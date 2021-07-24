<template>
  <div class="my-8">
    <h1>Home</h1>
    <h2>{{ homeData.host }}</h2>
    <p>{{ homeData.abc }}</p>
    <a-button type="primary" @click="$router.push('/cart')">
      cart CURD demo
    </a-button>
  </div>
</template>

<script>
  import { reactive, onMounted } from 'vue'
  import { useInteract, useSession, useSyncState, useRequest, useSXO } from '../hooks/app'
  import { Button } from 'ant-design-vue'

  async function setup () {
    const { loading, toast } = useInteract()
    const { host } = useSession()
    const syncState = useSyncState()
    /* eslint-disable-next-line */
    const request = useRequest()
    const { setSEO, setSMO } = useSXO()

    // sync data to client, if server fetch is fail, will be fetch in client, see index.html and server.js
    if (!syncState.homeData) {
      // syncState.homeData = await request('/api/home')
      syncState.homeData = await Promise.resolve({ host: host.value, abc: 123 }) // mock
    }

    const homeData = reactive(syncState.homeData)

    setSEO({
      title: 'Home page',
      description: 'description after server fetch'
    })
    setSMO({ title: 'Home page title after server fetch' })

    onMounted(() => {
      loading.open('loading...')
      setTimeout(loading.close, 1000)
      toast('123')
    })

    return {
      homeData
    }
  }

  export default {
    components: {
      [Button.name]: Button
    },
    setup
  }
</script>

<style scoped>
  h1,
  a {
    color: green;
  }
</style>
