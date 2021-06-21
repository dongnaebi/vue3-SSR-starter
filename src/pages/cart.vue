<template>
  <div class="my-8">
    <div v-for="li in list" :key="li.id" class="flex">
      <input type="checkbox" :checked="li.checked" @change="doChecked(li.id)">
      <div class="flex">
        <img :src="li.img" alt="" style="width:90px;height:90px;">
        <div>
          <h4>{{ li.title }}</h4>
          <div class="flex align-middle">
            <button @click="changeCartCount(li.id, li.count - 1)">
              -
            </button>
            <input v-model="li.count" type="text" class="text-center">
            <button @click="changeCartCount(li.id, li.count + 1)">
              +
            </button>
          </div>
          <button @click="deleteCart">
            删除
          </button>
        </div>
      </div>
    </div>
    <div>
      <label>
        <input type="checkbox" :checked="isCheckedAll" @change="toggleCheckAll">
        <span>全选</span>
      </label>
      <button>去结算</button>
    </div>
  </div>
</template>

<script>
  import { onMounted } from 'vue'
  import { useCart } from '../hooks/business'

  function setup () {
    const {
      list,
      isCheckedAll,
      getCartList,
      changeCartCount,
      deleteCart,
      doChecked,
      toggleCheckAll
    } = useCart()

    onMounted(getCartList)

    return {
      list,
      isCheckedAll,
      getCartList,
      changeCartCount,
      deleteCart,
      doChecked,
      toggleCheckAll
    }
  }

  export default {
    setup
  }
</script>
