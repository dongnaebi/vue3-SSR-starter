<template>
  <a-spin :spinning="loading.show" :tip="loading.text">
    <ProgressBar ref="progressBarRef" />
    <header class="header flex items-center">
      <img src="../assets/logo.png" alt="logo" style="height:50px">
      <span>header</span>
    </header>
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
    <footer class="footer flex items-center">
      footer
    </footer>
  </a-spin>
</template>

<script>
  import { ref } from 'vue'
  import useInteractWatcher from './useInteractWatcher'
  import ProgressBar from '../components/ProgressBar'
  import { Spin } from 'ant-design-vue'

  export default {
    name: 'Layout',
    components: {
      ProgressBar,
      [Spin.name]: Spin
    },
    setup () {
      const progressBarRef = ref(null)
      const { loading } = useInteractWatcher(progressBarRef)

      return { progressBarRef, loading }
    }
  }
</script>
<style scoped lang="less">
  .header{
    height: 60px;
    border-bottom: 1px solid #dfdfdf;
  }
  .footer{
    height: 160px;
    background: #f0f0f0;
  }
</style>
