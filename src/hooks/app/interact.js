import { reactive, inject } from 'vue'

const key = Symbol('interact')

export const INTERACT_MSG_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

export function useInteract () {
  return inject(key)
}

export function createInteract (app) {
  const interactState = reactive({
    progressing: false,
    loadingOption: {
      show: true,
      text: ''
    },
    loadingImplement: null,
    toastOption: {
      content: '',
      type: INTERACT_MSG_TYPE.INFO,
      duration: 2500
    },
    toastImplement: null,
    modalOption: {
      title: '',
      content: '',
      type: INTERACT_MSG_TYPE.INFO
    },
    modalImplement: null,
    confirmOption: {
      type: INTERACT_MSG_TYPE.INFO,
      title: '',
      content: '',
      showCancelButton: true,
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      resolveConfirm: null,
      resolveCancel: null
    },
    confirmImplement: null
  })

  const progressBar = {
    start () {
      interactState.progressing = true
    },
    end () {
      interactState.progressing = false
    }
  }

  const loading = {
    open (text = '') {
      if (interactState.loadingImplement) {
        interactState.loadingImplement.open(...arguments)
      } else {
        interactState.loadingOption = { show: true, text }
      }
    },
    close () {
      if (interactState.loadingImplement) {
        interactState.loadingImplement.close()
      } else {
        interactState.loadingOption = { show: false, text: '' }
      }
    }
  }

  function toast (content = '', type = INTERACT_MSG_TYPE.INFO, duration = 2500) {
    if (interactState.toastImplement) {
      interactState.toastImplement(...arguments)
    } else {
      interactState.toastOption = { content, type, duration }
    }
  }

  function modal (title = '', content = '', type = INTERACT_MSG_TYPE.INFO) {
    if (interactState.modalImplement) {
      interactState.modalImplement(...arguments)
    } else {
      interactState.modalOption = { title, content, type }
    }
  }

  function confirm ({
    type = INTERACT_MSG_TYPE.INFO,
    title = '',
    content = '',
    showCancelButton = true,
    cancelButtonText = '取消',
    confirmButtonText = '确定'
  }) {
    if (interactState.confirmImplement) {
      return interactState.confirmImplement(...arguments)
    }
    interactState.confirmOption = { type, title, content, showCancelButton, cancelButtonText, confirmButtonText }
    return new Promise((resolve, reject) => {
      interactState.confirmOption.resolveConfirm = () => {
        resolve(true)
      }
      interactState.confirmOption.resolveCancel = () => {
        resolve(false)
      }
    })
  }

  const interact = {
    interactState,
    progressBar,
    loading,
    toast,
    modal,
    confirm
  }
  app.provide(key, interact)
  return interact
}
