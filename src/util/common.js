export function isMobile (num) { // 验证手机
  return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(num)
}

export function isEmail (email) { // 验证邮箱
  return /^([a-zA-Z0-9]+[_|_|-|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)
}

export function arrayUnique (arr) {
  const newArr = arr.filter(function (element, index, array) {
    return array.indexOf(element) === index
  })
  return newArr
}

export function jsonp (url, params, callback) {
  let randomNum = new Date().getTime()
  let callName = null
  const sendScriptRequest = function (url, id) {
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.id = id
    script.src = url
    script.charset = 'utf-8'
    head.appendChild(script)
  }
  const buildTempFunction = function (callback) {
    callName = 'jsonp' + randomNum++
    window[callName] = function (data) {
      callback(data)
      window[callName] = undefined
      try {
        delete window[callName]
        const jsNode = document.getElementById(callName)
        jsNode.parentElement.removeChild(jsNode) // 执行全局方法后，将script标签删除
      } catch (e) { }
    }
    return callName
  }

  params.callback = buildTempFunction(callback)
  url += (url.indexOf('?') > 0) ? '' : '?'
  for (const i in params) { url += '&' + i + '=' + params[i] }
  sendScriptRequest(url, callName)
}

export function findParentIntree (tree, value, findKey = 'id', recursionKey = 'children') {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    if (item[findKey] === value) {
      return [item]
    } else {
      if (item[recursionKey] && item[recursionKey].length > 0) {
        const parentNode = [item]
        let find = findParentIntree(item[recursionKey], value, findKey, recursionKey)
        if (find) {
          parentNode.push(...find)
          find = null
          return parentNode
        }
      }
    }
  }
}
