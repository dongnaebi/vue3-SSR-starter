import { ref, computed } from 'vue'
import { useInteract, useSession, useRequest } from '../app'

export const CART_API = {
  GET_CART: '/api/cart/getCartList/v1',
  CHANGE_COUNT: '/api/cart/changeCartCount/v1',
  DELETE: '/api/cart/deleteCart/v1'
}

export function useCart () {
  const { loading, confirm } = useInteract()
  const request = useRequest()
  const { setUserProfile } = useSession()

  const list = ref([])

  const isCheckedAll = computed(() => list.value.every(li => li.checked))

  async function getCartList () {
    loading.open()
    // const res = await request(CART_API.GET_CART)
    // mock data
    const res = await Promise.resolve([
      {
        id: 1,
        img: 'https://img10.360buyimg.com/seckillcms/s250x250_jfs/t1/180999/34/9394/194601/60c9631dEdc43358e/0b6950b6779b4b5e.jpg',
        title: 'intercrew棉质短袖T恤',
        count: 1
      },
      {
        id: 2,
        img: 'https://img10.360buyimg.com/seckillcms/s250x250_jfs/t1/193898/14/7070/139495/60bf2e06E45440e05/4b199a0d0c8f0226.jpg',
        title: '多力 葵花籽油4.5L',
        count: 3
      }
    ])
    loading.close()

    list.value = res.map(r => ({
      ...r,
      checked: false
    }))
  }

  async function changeCartCount (id = 0, count = 1) {
    loading.open()
    const res = await request(CART_API.CHANGE_COUNT, { id, count }, 'post', 'json')
    loading.close()

    if (res) {
      setUserProfile({ cartCount: count })
      getCartList()
    }
  }

  async function deleteCart (id = 0) {
    const isConfirm = await confirm({
      type: 'warning',
      title: '请确认您的操作',
      content: '确定要删除这个商品吗？'
    })

    if (!isConfirm) return

    loading.open()
    const res = await request(CART_API.DELETE, { id }, 'post')
    loading.close()

    if (!res) return

    const index = list.value.findIndex(li => li.id === id)
    list.value.splice(index, 1)
    setUserProfile({ cartCount: list.value.length })
  }

  function doChecked (id = 0) {
    const target = list.value.find(li => li.id === id)
    target.checked = !target.checked
  }

  function toggleCheckAll () {
    const check = !isCheckedAll.value
    list.value.forEach(li => {
      li.checked = check
    })
  }

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
