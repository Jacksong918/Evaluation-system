import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const urlParams = new URLSearchParams(window.location.search);
const filepath = urlParams.get('filepath');
// 检查是否获取到 filepath
if (filepath) {
    console.log('File path from query parameter:', filepath);
} else {
    console.error('No file path found in query parameters');
}

const app = createApp(App);
app.config.globalProperties.$filepath = filepath; // 将 filepath 添加到全局属性
app.mount('#app');