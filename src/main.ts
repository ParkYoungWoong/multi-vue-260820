import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routes from './routes'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(routes)
app.use(createPinia())
app.mount('#app')
