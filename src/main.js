import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { darkModeKey } from '@/config.js'

import './css/main.css'


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/* Fetch sample data */
store.dispatch('fetch', 'clients')
store.dispatch('fetch', 'history')

/* Dark mode */
const localStorageDarkModeValue = localStorage.getItem(darkModeKey)


const firebaseConfig = {
	apiKey: "AIzaSyDAd41KlD6tOvGuN9hXH0YhzgBKrNnC0NY",
	authDomain: "stoktakip-60df2.firebaseapp.com",
	projectId: "stoktakip-60df2",
	storageBucket: "stoktakip-60df2.appspot.com",
	messagingSenderId: "777782371484",
	appId: "1:777782371484:web:8ffc8503a5cbb7f583f959",
	measurementId: "G-X388E16C2V"
   };
   // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

if ((localStorageDarkModeValue === null && window.matchMedia('(prefers-color-scheme: dark)').matches) || localStorageDarkModeValue === '1') {
  store.dispatch('darkMode')
}

/* Default title tag */
const defaultDocumentTitle = 'Stok Takip'

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)
})

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

createApp(App).use(store).use(router).mount('#app')
