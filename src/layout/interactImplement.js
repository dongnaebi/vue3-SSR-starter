import { watch, onMounted } from 'vue'
import { INTERACT_MSG_TYPE, useInteract, useSession } from '../hooks/app'
import { message, Modal } from 'ant-design-vue'
import { Toast, Dialog } from 'vant'

function showToast (platform, content, type, duration) {
  switch (type) {
    case INTERACT_MSG_TYPE.INFO:
      platform === 'PC'
        ? message.info(content, duration / 1000)
        : Toast({ message: content, duration })
      break
    case INTERACT_MSG_TYPE.SUCCESS:
      platform === 'PC'
        ? message.success(content, duration / 1000)
        : Toast({ type: 'success', message: content, duration })
      break
    case INTERACT_MSG_TYPE.WARNING:
      platform === 'PC'
        ? message.warning(content, duration / 1000)
        : Toast({ type: 'fail', message: content, duration })
      break
    case INTERACT_MSG_TYPE.ERROR:
      platform === 'PC'
        ? message.error(content, duration / 1000)
        : Toast({ type: 'fail', message: content, duration })
      break
  }
}

function showModal (platform, title, content, type) {
  if (platform === 'PC') {
    switch (type) {
      case INTERACT_MSG_TYPE.INFO:
        Modal.info({ title, content, okText: '好的' })
        break
      case INTERACT_MSG_TYPE.SUCCESS:
        Modal.success({ title, content, okText: '好的' })
        break
      case INTERACT_MSG_TYPE.WARNING:
        Modal.warning({ title, content, okText: '好的' })
        break
      case INTERACT_MSG_TYPE.ERROR:
        Modal.error({ title, content, okText: '真遗憾' })
        break
    }
  } else {
    Dialog.alert({ title, message: content, theme: 'round-button', confirmButtonText: type === INTERACT_MSG_TYPE.ERROR ? '真遗憾' : '好的' })
  }
}

export default function interactImplement (progressBarRef) {
  const { interactState } = useInteract()
  const { platform } = useSession()

  Toast.allowMultiple()
  let loadingToast = null
  onMounted(() => {
    watch(() => interactState.progressing, (val) => {
      if (val) {
        progressBarRef.value.start()
      } else {
        progressBarRef.value.end()
      }
    })

    watch(() => interactState.loadingOption, ({ show, text }) => {
      if (show) {
        loadingToast = Toast.loading({
          duration: 0,
          forbidClick: true,
          message: text,
          position: platform.value === 'PC' ? 'top' : 'middle'
        })
      } else {
        loadingToast && loadingToast.clear()
      }
    })

    watch(() => interactState.toastOption, ({ content, type, duration }) => {
      showToast(platform.value, content, type, duration)
    })

    watch(() => interactState.modalOption, ({ title, content, type }) => {
      showModal(platform.value, title, content, type)
    })

    watch(() => interactState.confirmOption, ({ type, title, content, showCancelButton, cancelButtonText, confirmButtonText, resolveConfirm, resolveCancel }) => {
      // todo 根据type来渲染icon
      if (platform.value === 'PC') {
        Modal.confirm({
          title: title,
          content: content,
          cancelText: showCancelButton ? cancelButtonText : '',
          okText: confirmButtonText,
          onOk () {
            resolveConfirm && resolveConfirm()
          },
          onCancel () {
            resolveCancel && resolveCancel()
          }
        })
      } else {
        Dialog.confirm({
          title: title,
          message: content,
          showCancelButton: showCancelButton,
          confirmButtonText,
          cancelButtonText,
          theme: 'round'
        }).then(() => {
          resolveConfirm && resolveConfirm()
        }).catch(() => {
          resolveCancel && resolveCancel()
        })
      }
    })
  })
}
