# .env 文件修复说明

## 问题原因

你的 `.env` 文件有两个问题：

### 1. ❌ API key 前面有空格
```bash
# 错误
VITE_EVENTLABS_API_KEY= sk_xxxx...

# 正确（等号后面不能有空格）
VITE_EVENTLABS_API_KEY=sk_xxxx...
```

### 2. ❌ endpoint 多了 /v1
```bash
# 错误
VITE_EVENTLABS_ENDPOINT=https://api.elevenlabs.io/v1

# 正确
VITE_EVENTLABS_ENDPOINT=https://api.elevenlabs.io
```

## 已修复

我已经帮你修复了这两个问题。现在的 `.env` 文件内容：

```bash
VITE_EVENTLABS_API_KEY=sk_94c7810d7bcb4334d6180edd1e09eabfe966c2355f730984
VITE_EVENTLABS_ENDPOINT=https://api.elevenlabs.io
```

## 下一步操作

**重要：必须重启开发服务器！**

```bash
# 1. 停止服务器（在终端按 Ctrl+C）
# 2. 重新启动
npm run dev

# 3. 打开浏览器，按 F12 查看控制台
# 4. 应该看到：
#    🔧 EventLabs Service initialized
#    🔧 API Key exists: true
#    🔧 Endpoint: https://api.elevenlabs.io
```

## API Key 传递流程

```
.env 文件
   ↓
Vite 读取环境变量 (import.meta.env.VITE_EVENTLABS_API_KEY)
   ↓
eventlabs.ts 存储到 this.config.apiKey
   ↓
HTTP 请求 header: { 'xi-api-key': this.config.apiKey }
   ↓
发送到 ElevenLabs API
```

## 如果还是显示 localhost

1. 确认 `.env` 文件在项目根目录（和 `package.json` 同级）
2. 确认文件内容没有多余空格
3. 重启开发服务器（环境变量只在启动时加载）
4. 清除浏览器缓存后刷新页面
