import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createHead } from '@vueuse/head'
import ClientOnly from './components/ClientOnly'
import './index.css'
import { createInteract, createRequest, createSession, createSyncState, createSXO } from './hooks/app'

export function createApp (context, syncState = {}) {
  const app = createSSRApp(App)
  const head = createHead()

  const interact = createInteract(app)
  const session = createSession(app, context)
  const SXO = createSXO(app)
  const router = createRouter(SXO, interact, session)
  const request = createRequest(app, session, interact, router)
  createSyncState(app, syncState)

  app.use(router).use(head)
  app.component(ClientOnly.name, ClientOnly)

  return { app, router, head, session, request }
}
