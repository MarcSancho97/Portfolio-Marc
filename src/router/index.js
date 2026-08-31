import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/HomeView.vue'
import Projects from '../views/Projects.vue'
import Contact from '../views/Contact.vue'
import ToDo from '../views/ToDo.vue'
import IAChat from '../components/IAChat.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/projects', name: 'projects', component: Projects },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/todo', name: 'todo', component: ToDo },
  { path: '/iachat', name: 'iachat', component: IAChat },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

export default router
