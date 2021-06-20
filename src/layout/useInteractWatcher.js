import { watch, reactive, onMounted } from 'vue'
import { INTERACT_MSG_TYPE, useInteract } from '../hooks/app'
import { message, Modal } from 'ant-design-vue'

function showToast (content, type, duration) {
  switch (type) {
    case INTERACT_MSG_TYPE.INFO:
      message.info(content, duration / 1000)
      break
    case INTERACT_MSG_TYPE.SUCCESS:
      message.success(content, duration / 1000)
      break
    case INTERACT_MSG_TYPE.WARNING:
      message.warning(content, duration / 1000)
      break
    case INTERACT_MSG_TYPE.ERROR:
      message.error(content, duration / 1000)
      break
  }
}

function showModal (title, content, type) {
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
}

export default function useInteractWatcher (progressBarRef) {
  const { interactState } = useInteract()

  const loading = reactive({
    show: false,
    text: ''
  })

  onMounted(() => {
    watch(() => interactState.progressing, (val) => {
      if (val) {
        progressBarRef.value.start()
      } else {
        progressBarRef.value.end()
      }
    })

    watch(() => interactState.loadingOption, ({ show, text }) => {
      loading.show = show
      loading.text = text
    })

    watch(() => interactState.toastOption, ({ content, type, duration }) => {
      showToast(content, type, duration)
    })

    watch(() => interactState.modalOption, ({ title, content, type }) => {
      showModal(title, content, type)
    })

    watch(() => interactState.confirmOption, ({ type, title, content, showCancelButton, cancelButtonText, confirmButtonText, resolveConfirm, resolveCancel }) => {
      // todo 根据type来渲染icon
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
    })
  })

  return {
    loading
  }
}
