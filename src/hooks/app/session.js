import { computed, reactive, toRefs, inject } from 'vue'

const key = Symbol('session')

export function useSession () {
  return inject(key)
}

const defaultContext = {
  host: '',
  token: '',
  UUID: '',
  ua: '',
  resetToken: token => {}
}
export function createSession (app, context = defaultContext) {
  const platform = /mobile/.test(context.ua.toLowerCase()) ? 'M' : 'PC'
  const session = reactive({
    token: context.token || '',
    UUID: context.UUID || '',
    host: context.host,
    platform,
    userInfo: {}
  })

  const isLogin = computed(() => !!session.token)

  function setToken (token = '') {
    session.token = token
    context.resetToken(token)
    setUserInfo()
  }

  async function setUserInfo (newData, request) {
    if (newData) {
      session.userInfo = Object.assign(session.userInfo, newData)
      return
    }
    const res = await request('/api/users/userInfo')

    if (res) {
      session.userInfo = res
      // 如果没有userId，认为这个token就是无效的，要清除
      if (!res.userId) {
        setToken('')
      }
    }
  }

  const sessionState = {
    isLogin,
    ...toRefs(session),
    setToken,
    setUserInfo
  }

  app.provide(key, sessionState)
  return sessionState
}
