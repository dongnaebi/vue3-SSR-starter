import { inject } from 'vue'

const key = Symbol('syncState')

export function useSyncState () {
  return inject(key)
}

export function createSyncState (app, syncState) {
  app.provide(key, syncState)
}
