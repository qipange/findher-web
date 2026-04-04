# FindHer Google OAuth 集成指南

## 🎯 项目概述

FindHer 现已集成 Google OAuth 认证功能，为用户提供安全的位置共享服务。用户可以通过 Google 账户登录，获得更好的使用体验。

## 📋 功能特性

- ✅ **Google OAuth 认证** - 安全的 Google 账户登录
- ✅ **用户状态管理** - 实时显示登录状态
- ✅ **会话管理** - 支持24小时自动过期
- ✅ **安全中间件** - Helmet、CORS、限流保护
- ✅ **响应式设计** - 完美适配移动端
- ✅ **错误处理** - 完善的错误提示和处理

## 🔧 安装配置

### 1. 安装依赖

```bash
cd findher2
npm install
```

### 2. 运行设置向导

```bash
npm run setup-oauth
```

### 3. 配置 Google OAuth

#### 3.1 访问 Google Cloud Console
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 登录您的 Google 账户
3. 创建新项目或选择现有项目

#### 3.2 启用必要的 API
1. 在左侧菜单中选择 "APIs & Services" > "Library"
2. 搜索 "Google+ API" 并启用
3. 搜索 "People API" 并启用

#### 3.3 创建 OAuth 凭据
1. 在左侧菜单中选择 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth client ID"
3. 选择 "Web application" 类型
4. 配置授权的重定向 URI：
   ```
   http://localhost:3000/api/auth/google/callback  # 开发环境
   https://your-domain.com/api/auth/google/callback  # 生产环境
   ```
5. 记录生成的 **Client ID** 和 **Client Secret**

#### 3.4 配置环境变量
编辑 `.env` 文件：
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Session Configuration
SESSION_SECRET=your-session-secret-here
SESSION_NAME=findher-session

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 5. 访问应用

打开浏览器访问：http://localhost:3000

## 🏗️ 项目结构

```
findher2/
├── server.js                 # Express 服务器，包含 OAuth 认证
├── index.html                # 主页，集成认证状态显示
├── auth.html                 # 认证页面，包含登录/登出功能
├── package.json              # 项目依赖配置
├── .env.example              # 环境变量模板
├── scripts/
│   └── setup-oauth.js       # OAuth 设置向导
├── css/
│   └── style.css            # 样式文件
├── js/
│   └── app-v2.js            # 主要应用逻辑
├── cert/                    # SSL 证书目录
└── README.md                # 项目说明
```

## 🔐 认证流程

### 1. 用户登录
1. 用户点击主页的"登录"按钮
2. 重定向到 `/auth.html` 认证页面
3. 点击"使用 Google 登录"按钮
4. 重定向到 Google OAuth 授权页面
5. 用户授权后重定向回应用
6. 服务器验证并创建会话

### 2. 用户登出
1. 用户点击用户头像或登出按钮
2. 发送 POST 请求到 `/api/auth/logout`
3. 服务器销毁会话和用户数据
4. 重定向到主页

### 3. 状态检查
- 实时显示用户认证状态
- 每30秒自动检查会话状态
- 未登录用户显示登录按钮

## 🌐 API 端点

### 认证相关
- `GET /api/auth/google` - 开始 Google OAuth 认证
- `GET /api/auth/google/callback` - Google OAuth 回调处理
- `GET /api/auth/check` - 检查认证状态
- `POST /api/auth/logout` - 用户登出
- `GET /api/user` - 获取用户信息

### 状态码
- `200` - 成功
- `401` - 未认证
- `404` - 页面未找到
- `500` - 服务器内部错误

## 🔒 安全配置

### 1. 会话安全
- 使用 HTTPS（生产环境）
- 会话密钥随机生成
- Cookie 设置 HttpOnly 和 Secure 标志
- 会话自动过期（24小时）

### 2. 请求限流
- 15分钟内最多100次请求
- 防止暴力破解和 DDoS 攻击

### 3. CORS 配置
- 限制允许的域名
- 支持跨域请求
- 启用凭据传递

### 4. 安全中间件
- Helmet - 设置安全相关的 HTTP 头
- Morgan - 请求日志记录
- CORS - 跨域资源共享

## 📱 前端功能

### 1. 认证状态显示
- 左上角显示登录状态
- 右上角显示用户菜单（已登录时）
- 实时更新认证状态

### 2. 用户界面
- 现代化的登录界面
- 用户头像和信息显示
- 响应式设计，适配移动端

### 3. 错误处理
- 友好的错误提示
- 自动重试机制
- 状态异常处理

## 🚀 部署指南

### 1. 开发环境
```bash
npm install
npm run dev
```

### 2. 生产环境
1. 配置域名和 SSL 证书
2. 设置环境变量
3. 安装依赖
4. 启动服务

```bash
npm install
NODE_ENV=production npm start
```

### 3. Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 故障排除

### 1. OAuth 认证失败
- 检查 Client ID 和 Client Secret 是否正确
- 确认重定向 URI 配置正确
- 检查 Google API 是否已启用

### 2. 会话问题
- 确认 SESSION_SECRET 已设置
- 检查浏览器是否接受 Cookie
- 验证域名配置

### 3. 网络问题
- 检查防火墙设置
- 确认端口未被占用
- 验证 DNS 配置

### 4. 常见错误
- `401 Unauthorized` - 未登录或会话过期
- `404 Not Found` - 页面不存在
- `500 Internal Server Error` - 服务器错误

## 📝 开发说明

### 1. 添加新的 OAuth 提供商
在 `server.js` 中添加新的认证策略：
```javascript
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "/api/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    // 处理 GitHub 用户信息
}));
```

### 2. 数据库集成
可以集成数据库来持久化用户数据：
```javascript
// 示例：使用 MongoDB
const mongoose = require('mongoose');
const User = require('./models/User');

// 在认证回调中保存用户
passport.use(new GoogleStrategy({...}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
```

### 3. 自定义中间件
可以添加自定义中间件来处理特定逻辑：
```javascript
// 认证中间件
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth.html');
}

// 使用中间件保护路由
app.get('/protected-route', ensureAuthenticated, (req, res) => {
    res.send('欢迎，已认证用户！');
});
```

## 🎉 完成！

恭喜！您的 FindHer 应用现已成功集成 Google OAuth 认证功能。用户现在可以：

1. 使用 Google 账户安全登录
2. 查看实时认证状态
3. 管理用户会话
4. 享受更好的用户体验

---

**注意**: 请妥善保管您的 OAuth 凭据和会话密钥，不要将其提交到版本控制系统。