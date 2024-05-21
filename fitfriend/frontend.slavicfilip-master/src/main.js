import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Uvoz Vuex store-a
import axios from 'axios';

// Konfiguracija globalnih svojstava za Axios
const app = createApp(App);
app.config.globalProperties.$axios = axios;

// Povezivanje Vue aplikacije s Vuex store-om i Vue Router-om
app.use(store); // Upotreba Vuex store-a
app.use(router); // Upotreba Vue Router-a

// Montiranje Vue aplikacije na #app elementu u DOM-u
app.mount('#app');

