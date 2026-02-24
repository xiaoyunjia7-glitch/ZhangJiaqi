# 色彩敏锐度挑战 (Color Sensitivity Challenge)

这是一个面向艺术生的色彩感知测试游戏。

## 部署到 Vercel 指南

要将此项目部署到 Vercel 并同步到 GitHub，请按照以下步骤操作：

### 1. 初始化 GitHub 仓库

1. 在 [GitHub](https://github.com/new) 上创建一个新的空仓库。
2. 在本地项目根目录下运行以下命令（假设你已经安装了 Git）：

```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Color Sensitivity Challenge"

# 关联远程仓库 (替换为你的仓库地址)
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 GitHub
git push -u origin main
```

### 2. 部署到 Vercel

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)。
2. 点击 **"Add New..."** -> **"Project"**。
3. 导入你刚刚创建的 GitHub 仓库。
4. Vercel 会自动识别这是一个 Vite 项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**。

### 3. 环境变量 (可选)

如果你的应用需要使用 Gemini API（虽然当前游戏逻辑是纯本地的），请在 Vercel 项目设置的 **Environment Variables** 中添加：
- `GEMINI_API_KEY`: 你的 API 密钥

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 技术栈

- **React 19**
- **Vite**
- **Tailwind CSS** (用于样式)
- **Framer Motion** (用于动画)
- **Lucide React** (用于图标)
