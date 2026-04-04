const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS配置
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 会话配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'findher-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    httpOnly: true
  },
  name: process.env.SESSION_NAME || 'findher-session'
}));

// 初始化Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth配置
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com/api/auth/google/callback' 
      : 'http://localhost:3000/api/auth/google/callback',
    scope: ['profile', 'email'],
    prompt: 'select_account'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 这里可以添加数据库逻辑来存储用户信息
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        accessToken: accessToken
      };
      
      // 检查用户是否已存在，如果不存在则创建
      // 在实际应用中，这里应该查询数据库
      console.log('用户登录:', user.name, user.email);
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport序列化和反序列化
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// 限流配置
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15分钟
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 路由配置

// 认证路由
app.get('/api/auth/google', 
  passport.authenticate('google', { session: true })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    session: true,
    failureRedirect: '/auth/failure' 
  }),
  (req, res) => {
    // 认证成功，重定向到主页
    res.redirect('/');
  }
);

// 用户信息路由
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

// 登出路由
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: '会话销毁失败' });
      }
      res.clearCookie(process.env.SESSION_NAME || 'findher-session');
      res.json({ success: true, message: '已成功登出' });
    });
  });
});

// 检查认证状态
app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// 认证失败路由
app.get('/auth/failure', (req, res) => {
  res.status(401).send('认证失败，请重试');
});

// 404处理
app.use((req, res) => {
  res.status(404).send('页面未找到');
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器内部错误');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`Google OAuth 已配置`);
  console.log(`认证回调地址: ${process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api/auth/google/callback' 
    : 'http://localhost:3000/api/auth/google/callback'}`);
});

module.exports = app;