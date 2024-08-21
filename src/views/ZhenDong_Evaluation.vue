<template>
  <div class="vibration-evaluation-panel">
    <div class="vibration-content">
      <label>一阶临界转速限定系数：</label>
      <input type="number" step="0.1" v-model="coefficient" class="input-box" @input="validateInput" />
      &nbsp;&nbsp;&nbsp;
      <span>{{ calculatedSpeed }}rpm</span>
    </div>
    <button class="evaluateButton" @click="evaluateVibration">振动评价</button>
    <!-- 评价结果展示 -->
    <div v-if="showResult" class="result-message">
      <p>{{ result }}</p>
    </div>
    <!-- 弹窗提示 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <p>输入最低倍率限定为1！</p>
        <button @click="closePopup">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue';
const { ipcRenderer } = require('electron'); // 确保在 Electron 环境中运行

// 定义props
const props = defineProps({
  filePath1: {
    type: String,
    required: true
  },
  filePath2: {
    type: String,
    required: true
  }
});

// 定义状态变量
const coefficient = ref(1.2); // 默认值为 1.2，最小值为 1
const ratedSpeed = ref(1800); // 设定的额定转速
const calculatedSpeed = ref((coefficient.value * ratedSpeed.value).toFixed(2));
const result = ref('');
const showResult = ref(false);
const showPopup = ref(false); // 控制弹窗显示
let criticalSpeed // 一阶临界转速

// 计算倍率*额定转速的结果
calculatedSpeed.value = (coefficient.value * ratedSpeed.value).toFixed(2);

// 动态监听 coefficient 的变化，更新 calculatedSpeed
watch(coefficient, (newVal) => {
  calculatedSpeed.value = (parseFloat(newVal) * ratedSpeed.value).toFixed(2);
});

// 动态监听 filePath1 的变化并读取文件内容
watch(() => props.filePath1, (newFilePath1) => {
  console.log('Received file path:', newFilePath1);
  readinputFile(newFilePath1);
});

// 动态监听 filePath2 的变化并读取文件内容
watch(() => props.filePath2, (newFilePath2) => {
  console.log('Received file path:', newFilePath2);
  readCampbellFile(newFilePath2);
});

// 监听输入框的变化
watch([() => coefficient.value], () => {
  result.value = null; // 清空结果
}, { immediate: false });

onMounted(() => {
  if (props.filePath1) {
    readinputFile(props.filePath1);
  }
  if (props.filePath2) {
    readCampbellFile(props.filePath2);
  }
});

// 读取filepath1文件输入转速
const readinputFile = async (filePath) => {
  try {
    const data = await ipcRenderer.invoke('read-file', filePath);
    const fileData = JSON.parse(data);
    console.log('output:', fileData); // 确保控制台输出解析后的 JSON 数据
    if (fileData.Input) {
      ratedSpeed.value = fileData.Input.nRot;
    }
  } catch (err) {
    console.error('Error reading file:', err);
  }
};

// 读取filepath2文件并更新一阶临界转速
const readCampbellFile = async (filePath) => {
  try {
    const response = await ipcRenderer.invoke('read-file', filePath);
    const lines = response.split('\n');
    for (let i = 1; i < lines.length; i++) { // 从第二行开始解析（跳过标题行）
      const columns = lines[i].split('\t'); // Assuming tabs are used as delimiters
      if (columns.length > 3) {
        const mode = columns[1] && columns[1].trim(); // Safely access and trim Whirl Direction
        const criticalSpeedInfo = columns[3] && columns[3].trim(); // Safely access and trim Critical Speed
        if (mode === 'FW' && criticalSpeedInfo !== 'NONE' && criticalSpeedInfo.includes('rpm')) {
          const speed = parseFloat(criticalSpeedInfo.split(' ')[0]);
          if (!isNaN(speed)) {
            criticalSpeed = speed; // Update the global variable
            console.log(`Found and set critical speed: ${criticalSpeed} rpm`);
            return; // Exit the function after finding and setting the speed
          }
        }
      }
    }
    console.log('No FW critical speed found in the file.');
  } catch (err) {
    console.error('Error reading or processing file:', err);
  }
};

// 验证输入值
function validateInput() {
  if (coefficient.value < 1) {
    coefficient.value = 1.2; // 恢复默认值
    showPopup.value = true; // 显示弹窗
  }
}

// 关闭弹窗
function closePopup() {
  showPopup.value = false;
}

// 进行振动评价
function evaluateVibration() {
  const calculatedSpeedValue = parseFloat(calculatedSpeed.value);
  // 比较一阶临界转速和计算的转速
  if (criticalSpeed >= calculatedSpeedValue) {
    result.value = '合格';
  } else {
    result.value = '不合格';
  }
  showResult.value = true;
}
</script>

<style>
.vibration-evaluation-panel {
  flex: 1;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vibration-content {
  display: flex;
  align-items: center;
}

.input-box {
  height: 25px;
  width: 60px;
  text-align: center;
}

.evaluateButton {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.evaluateButton:hover {
  background-color: #0056b3;
}

.result-message {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

/* 弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.popup-content p {
  margin-bottom: 20px;
}

.popup-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #0056b3;
}
</style>
