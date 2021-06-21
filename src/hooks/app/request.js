import axios from 'axios'
import LRU from 'lru-cache'
import { inject } from 'vue'

const cache = new LRU({
  max: 1000,
  maxAge: 1000 * 60 * 10
})
const isServer = import.meta.env.SSR

const key = Symbol('request')

export function useRequest () {
  return inject(key)
}

export function createRequest (app, { host = '', token = '', UUID = '', platform = '' }, { toast, modal, confirm }, router) {
  function errorHandle (err, reject) {
    if (isServer) {
      const error = new Error(`${err.title} | ${err.msg}`)
      reject(error)
    } else {
      if (err.msg.length > 30) {
        modal(err.title, err.msg, 'error')
      } else {
        toast(err.msg, 'error')
      }
    }
  }

  function requestHandle ([err, res], reject) {
    if (err) {
      errorHandle(err, reject)
      return null
    }
    if (res.code === 200) {
      return res.data || {}
    } else if (res.code === 401) {
      router.push('/login')
    } else {
      errorHandle({ title: '出错啦！', msg: res.msg || res }, reject)
    }
    return null
  }

  function request (url = '', params = {}, method = 'get', contentType = 'form', headers = {}, responseType = 'json') {
    contentType === 'form' && (contentType = 'application/x-www-form-urlencoded')
    contentType === 'json' && (contentType = 'application/json')
    contentType === 'file' && (contentType = 'multipart/form-data')
    const query = []
    for (const k in params) {
      query.push(k + '=' + params[k])
    }
    let qs = query.join('&')

    if ((method.toLowerCase() === 'get' || method.toLowerCase() === 'cache') && query.length > 0) {
      url += (url.indexOf('?') < 0 ? '?' : '&') + qs
    }
    if (contentType !== 'application/x-www-form-urlencoded' && method !== 'get') {
      qs = params
    }

    const cacheKey = host.value + url
    return new Promise((resolve, reject) => {
      if (cache.get(cacheKey) && method.toLowerCase() === 'cache') {
        resolve(cache.get(cacheKey))
        return
      }
      axios({
        baseURL: host.value,
        timeout: 15000,
        method: method.toLowerCase() === 'cache' ? 'get' : method,
        url: url,
        data: qs,
        headers: {
          Authorization: token.value,
          UUID: UUID.value,
          Platform: platform.value,
          'Content-Type': contentType,
          ...headers
        }
      }).then(response => {
        if (response.status >= 200 && response.status < 400) {
          if (method.toLowerCase() === 'cache' && response.data.code === 200) {
            cache.set(cacheKey, response.data)
          }
          const res = requestHandle([null, response.data], reject)
          resolve(res)
        } else {
          const res = requestHandle([{ title: `请求出错了：${response.status}`, msg: `${url} === ${response}` }, null], reject)
          resolve(res)
        }
      }, err => {
        let title = '请求失败'
        let msg = `${url} === 服务器遇到了一点问题，请稍后重试`
        if ((err + '').indexOf('timeout') > -1) {
          title = '请求超时'
          msg = `${url} === 可能是当前网络较慢，或者服务器响应慢，请稍后重试`
        }
        const res = requestHandle([{ title, msg }, null], reject)
        resolve(res)
      })
    })
  }

  app.provide(key, request)
  return request
}
