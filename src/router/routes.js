import layout from '../layout/index.vue'

// fixme 暂时不能用load函数：https://github.com/vitejs/vite/issues/3087
// function load (component) {
//   return () => import(`../pages/${component}.vue`)
// }

export default [
  {
    path: '/',
    component: layout,
    meta: {},
    children: [
      {
        path: '',
        component: () => import('../pages/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'cart',
        component: () => import('../pages/cart.vue'),
        meta: { title: '购物车' }
      },
      {
        path: 'test',
        component: () => import('../pages/test/test.vue'),
        meta: { title: '测试' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../pages/404.vue'),
    meta: { title: '页面丢失了' }
  }
]
