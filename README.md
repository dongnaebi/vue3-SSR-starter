# vue3-SSR-starter
Prefetch and sync state to client with one line of code, out-of-the-box
## Features
- vue3
- SSR
- vue-router
- we don't need vuex anymore
- one line of code to sync state
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

## Server prefetch and sync to client with one line of code
It provide `syncState` object to sync the prefetch data to client, 
you only need one line of code:
```javascript
async function setup () {
  // ...

  // request home data in server, and sync to client
  syncState.homeData = syncState.homeData || await request('/api/home')

  // ...
}
```
Because of the `setup` hook run in both of server and client,
so even server fetch is fail, it will be downgrade to client fetch,
complete code:
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
## App hook and business hook
You maybe write a business in many clients, e.g. `PC web`, `mobile web`, `mini program`
the business is same, but dom, style and project code is different, such as `request`, in web we 
can use axios, but in `mini program` we can only use `wx.request`, for business code unification, 
we need a `request` function to smoothing platform differences.

So we provide app hooks, you need to write your app hook in every client, but your business 
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
You can reimplement it everywhere, see `src/hooks/app/interact.js`
#### session
Provide user info or client info, you can also update the session data, and yes, we don't need `vuex` anymore:
```javascript
import { onMounted } from 'vue'
import { useSession } from '../hooks/app'
export default {
  setup () {
    const { token, UUID, platform, userProfile, host, isLogin, setToken, setUserProfile } = useSession()
    onMounted(() => {
      console.log(token, UUID, platform, userProfile, host, isLogin)
    })
    function onLogin (token) {
      setToken(token)
    }
    function updateCartCount () {
      setUserProfile({ cartCount: 3 })
    }
  
    return {
      onLogin,
      updateCartCount
    }
  }
}
```
#### request
Provide an axios instance to fetch data in server and client:
```javascript
import { useRequest } from '../hooks/app'
async function setup () {
    const request = useRequest()
    
    // API: request(url = '', params = {}, method = 'get', contentType = 'form', headers = {}, responseType = 'json')
    const res = await request('/api/home')
    console.log(res)
  }
export default { setup }
```
#### SEO/SMO
Set html head tags for SEO or SMO: e.g. title, description, keywords, ogp.
```javascript
import { useSXO } from '../hooks/app'
function setup () {
    const { setSEO, setSMO } = useSXO()
    
    setSEO({
      title: 'SEO title',
      description: 'SEO description'
    })
    setSMO({ title: 'SMO title' })
  }
export default { setup }
```
It will be set default value on router change if you have not set in pages,
you can set the default value in `src/router/index.js`

### business hook
You can refer to `src/hooks/business/useCart.js` and `src/pages/cart.vue`, please make it universal

## Api proxy and serve port
See `config/ssr.config.is`

