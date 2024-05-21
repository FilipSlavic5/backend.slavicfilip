import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Register from '../views/Register.vue';
import MainLayout from '../views/MainLayout.vue';
import Chat from '../components/Chat.vue';
import Pretraga from '../components/Pretraga.vue';
import Planiranje from '../components/Planiranje.vue';
import Profile from '../components/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserRegistered) {
        next('/main');
      } else {
        next();
      }
    }
  },
  {
    path: '/main',
    component: MainLayout,
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: Chat
      },
      {
        path: 'pretraga',
        name: 'Pretraga',
        component: Pretraga
      },
      {
        path: 'planiranje',
        name: 'Planiranje',
        component: Planiranje
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
