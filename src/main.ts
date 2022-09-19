import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

// app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')