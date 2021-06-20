# vue3-SSR-starter
a out-of-the-box vue3-SSR starter
## Features
- vue3
- SSR
- vue-router
- no vuex
- vite2
- tailwind.css

## Project setup and usage
```bash
npm i
```
```bash
npm run dev
// localhost:3001
```

## Server prefetch and sync to client
we provide an `syncState` to sync the prefetch data to client, 
if server fetch is fail, it will be downgrade to client fetch,
you can use it like this:
```javascript
// see src/pages/index.vue
import { reactive } from 'vue'
import { useSyncState, useRequest } from '../hooks/app'
async function setup () {
    const request = useRequest()
    const syncState = useSyncState()
    // sync data to client, if server fetch is fail, will be fetch in client, see index.html and server.js
    if (!syncState.homeData) {
      syncState.homeData = await request('/api/home')
    }

    const homeData = reactive(syncState.homeData)

    return {
      homeData
    }
  }
```
## app hook and business hook
you maybe write a business in many clients, e.g. `PC web`, `mobile web`, `mini program`
the business is same, but dom, style and project code is different, such as `request`, in web we 
can use axios, but in `mini program` we can only use `wx.request`, for business code unification, 
we need a `request` function to smoothing platform differences.

so we provide app hooks, you need to write your app hook in every client, but your business 
hook can be a npm package

### app hooks
see in `src/hooks/app`
#### interact
interact components is different in every client, so we need to provide a unification API:
```javascript
import { onMounted } from 'vue'
import { useInteract } from '../hooks/app'
export default {
  setup () {
    const { loading, toast, modal, confirm } = useInteract()
    onMounted(() => {
      loading.open('loading...')
      setTimeout(loading.close, 1000)
      // API: loading.open(text = ''),  loading.close()

      toast('123')
      // API: toast(content = '', type = 'info', duration = 2500)

      modal('this is a modal', 'modal content', 'error')
      // API: modal(title = '', content = '', type = 'info')
  
      confirm({
        title: 'please confirm your action',
        content: 'delete this data?'
      }).then(action => {
        console.log(action)
      })
      /* API: confirm ({
        type = 'info',
        title = '',
        content = '',
        showCancelButton = true,
        cancelButtonText = '取消',
        confirmButtonText = '确定'
      }) */
    })
  }
}
```
#### session
provide user info or client info, you also can update the session, yes, you don't need `vuex` anymore:
```javascript
import { onMounted } from 'vue'
import { useSession } from '../hooks/app'
export default {
  setup () {
    const { token, UUID, platform, userInfo, host, isLogin, setToken, setUserInfo } = useSession()
    onMounted(() => {
      console.log(token, UUID, platform, userInfo, host, isLogin)
    })
    function onLogin (token) {
      setToken(token)
    }
    function updateCartCount () {
      setUserInfo({ cartCount: 3 })
    }
  
    return {
      onLogin,
      updateCartCount
    }
  }
}
```
#### request
provide a axios instance to fetch data:
```javascript
import { useRequest } from '../hooks/app'
async function setup () {
    const request = useRequest()
    
    // API: request(url = '', params = {}, method = 'get', contentType = 'form', headers = {}, responseType = 'json')
    const res = await request('/api/home')
    console.log(res)
  }
```

### business hook
You can refer to `src/hooks/business/useCart.js` and `src/pages/cart.vue`

## api proxy and port
in `config/ssr.config.is`

