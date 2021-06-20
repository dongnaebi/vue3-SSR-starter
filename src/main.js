import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import ClientOnly from './components/ClientOnly'
import './index.css'
import { createInteract, createRequest, createSession, createSyncState } from './hooks/app'

export function createApp (context, syncState = {}) {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)

  const interact = createInteract(app)
  const session = createSession(app, context)
  const request = createRequest(app, session, interact, router)
  createSyncState(app, syncState)

  app.component(ClientOnly.name, ClientOnly)

  return { app, router, interact, session, request }
}
