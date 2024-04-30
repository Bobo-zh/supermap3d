import Vue from 'vue'
import VueRouter from 'vue-router'
import MapView from '../views/MapView.vue'
import LayerList from '../views/ContainerWidget/LayerList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MapView',
    component: MapView,
    children:[
      {
        path:'layer',
        name:"layer",
        component: LayerList,
      }

    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
