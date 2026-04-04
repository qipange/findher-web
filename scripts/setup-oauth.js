#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FindHer Google OAuth 设置向导');
console.log('====================================\n');

// 检查.env文件是否存在
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 创建.env文件...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ 已创建.env文件，请编辑其中的Google OAuth配置\n');
} else {
  console.log('✅ .env文件已存在\n');
}

// 生成随机密钥
function generateSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成会话密钥
const sessionSecret = generateSecret();
console.log('🔑 生成的会话密钥:', sessionSecret);

// 更新.env文件
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const updatedContent = envContent.replace(
    /SESSION_SECRET=.*/,
    `SESSION_SECRET=${sessionSecret}`
  );
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ 已更新.env文件中的会话密钥\n');
}

console.log('📋 Google Cloud Console 设置步骤:');
console.log('====================================');
console.log('1. 访问 https://console.cloud.google.com/');
console.log('2. 创建新项目或选择现有项目');
console.log('3. 在 "APIs & Services" > "Library" 中启用:');
console.log('   - Google+ API');
console.log('   - People API');
console.log('4. 在 "APIs & Services" > "Credentials" 中:');
console.log('   - 点击 "Create Credentials" > "OAuth client ID"');
console.log('   - 选择 "Web application" 类型');
console.log('   - 添加授权的重定向URI:');
console.log(`     - http://localhost:3000/api/auth/google/callback (开发环境)`);
console.log('   - 记录生成的 Client ID 和 Client Secret');
console.log('5. 将 Client ID 和 Client Secret 添加到 .env 文件中\n');

console.log('🚀 启动应用:');
console.log('====================================');
console.log('1. 安装依赖: npm install');
console.log('2. 启动开发服务器: npm run dev');
console.log('3. 访问 http://localhost:3000');
console.log('4. 点击登录按钮测试Google OAuth\n');

console.log('⚠️  重要提示:');
console.log('====================================');
console.log('- 请妥善保管您的 OAuth 凭据');
console.log('- 不要将 .env 文件提交到版本控制系统');
console.log('- 生产环境中请使用HTTPS和域名');
console.log('- 考虑添加数据库来持久化用户数据\n');

console.log('✨ 设置完成！');