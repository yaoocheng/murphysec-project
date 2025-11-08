<template>
  <div class="upload-area">
    <h2>上传项目 ZIP 包</h2>
    <input
      type="file"
      accept=".zip"
      @change="handleZipUpload"
    />
    <div v-if="isAnalyzing" class="loading-indicator">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { analyzeFile } from './compasable'

const projectName = ref('')
const isAnalyzing = ref(false) // 添加解析中的loading状态

// 处理 ZIP 文件上传
const handleZipUpload = async (event) => {
  // 设置解析状态为true
  isAnalyzing.value = true

  const zipFile = event.target.files[0];

  if (!zipFile) return

  projectName.value = zipFile.name.replace(/\.zip$/, '')
   
  // 调用分析逻辑（生成 AST + 指纹）
  const { fingerprintList, fileEntries } = await analyzeFile(zipFile);

  // 分析完成，设置状态为false
  isAnalyzing.value = false
  
  console.log('✅ 分析项目:', projectName.value, '✅ 项目内容:', fileEntries, '✅ 分析结果:', fingerprintList)

  // 生成上传数据结构
  const payload = buildUploadPayload(projectName.value, fileEntries, fingerprintList)

  // 上传 zip + 分析结果
  await uploadToServer(zipFile, payload);
}

 // 构建上传数据结构
const buildUploadPayload = (projectName, fileList, fingerprintList) => {
  return {
    projectName,
    files: fileList.map((file, i) => ({
      path: file.path,
      name: file.name,
      fingerprints: fingerprintList[i] || [] // 你生成指纹的位置
    }))
  }
}

// 上传到服务器
const uploadToServer = async (zipFile, payload) => {
  const formData = new FormData()
  formData.append('zip', zipFile)
  formData.append('metadata', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData
  })

  const result = await res.json()
  console.log('📤 上传结果:', result)
}
</script>

<style scoped>
.upload-area {
  padding: 20px;
}
/* HTML: <div class="loader"></div> */
.loader {
    margin-top: 16px;
  width: fit-content;
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  background: radial-gradient(circle closest-side,#000 94%,#0000) right/calc(200% - 1em) 100%;
  animation: l24 1s infinite alternate linear;
}
.loader::before {
  content: "Parsing project...";
  line-height: 1em;
  color: #0000;
  background: inherit;
  background-image: radial-gradient(circle closest-side,#fff 94%,#000);
  -webkit-background-clip:text;
          background-clip:text;
}

@keyframes l24{
  100%{background-position: left}
}
</style>
