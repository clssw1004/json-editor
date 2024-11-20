import { createApp } from 'vue'
import App from './App.vue'
import i18n from './plugins/i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/common.scss'
const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')
