<template>
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
</template>

<script>
  import { ref } from 'vue'
  import ProgressBar from '../components/ProgressBar'
  import interactImplement from './interactImplement'
  import sxoImplement from './sxoImplement'

  export default {
    name: 'Layout',
    components: {
      ProgressBar
    },
    setup () {
      const progressBarRef = ref(null)
      interactImplement(progressBarRef)
      sxoImplement()

      return { progressBarRef }
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
