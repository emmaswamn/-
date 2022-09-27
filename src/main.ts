import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-input.css'
import { useDirective } from './directive/index'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_KEY);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

useDirective(app)
// app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')