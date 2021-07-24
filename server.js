const fs = require('fs')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { proxy, port } = require('./config/ssr.config')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const isStag = process.env.NODE_ENV === 'stag'
async function createServer (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production' || isStag
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? require('./dist/client/ssr-manifest.json')
    : {}

  const app = express()
  app.use(cookieParser())

  if (!isProd || (isProd && isStag)) {
    for (const p in proxy) {
      app.use(p, createProxyMiddleware(proxy[p]))
    }
  }

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true
      }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(require('compression')())
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', async (req, res) => {
    const context = {
      // for nginx, set config:
      // proxy_set_header X-Forwarded-Proto $scheme
      // proxy_set_header Host $host

      // host: `${req.headers['x-forwarded-proto']}://${req.headers.host}`,
      host: `${req.protocol}://${req.headers.host}`,
      ua: req.headers['user-agent']
    }
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }

      const [err, appHtml, preloadLinks, syncState, headTags, htmlAttrs, bodyAttrs] = await render(url, manifest, context)

      const html = template
        .replace('data-html-attrs', htmlAttrs)
        .replace('<!--head-tags-->', headTags)
        .replace('data-body-attrs', bodyAttrs)
        .replace('<!--preload-links-->', preloadLinks)
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('/*sync-state-outlet*/', `window.__syncState__ = ${JSON.stringify(syncState)}`) // 注入同步数据

      let statusCode = 200
      if (err) {
        console.log(err)
        statusCode = err.message.indexOf('404') === 0 ? 404 : 202 // 渲染错误用202不被缓存
      }
      res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(port, () => {
      console.log(`http://localhost:${port}`)
    })
  )
}

// for test use
exports.createServer = createServer
