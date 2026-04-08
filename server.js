require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- 中间件 ----------
// 允许跨域（请根据需要调整 origin，生产环境建议指定具体域名）
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://suixiuliang.github.io',
    'https://maxsui.org',
    'https://www.maxsui.org'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于访问上传的头像）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保 data 和 uploads 目录存在
['data', 'uploads'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// ---------- 引入中间件和工具 ----------
const { generateToken } = require('./middleware/auth');

// ---------- 挂载路由 ----------
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/works', require('./routes/works'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// ---------- 管理员登录（单独路由，也可放在 admin 中，这里保留兼容） ----------
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === ADMIN_PASSWORD) {
    const token = generateToken({ role: 'admin' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: '管理员密码错误' });
  }
});

// ---------- 根路径 ----------
app.get('/', (req, res) => {
  res.json({
    message: 'MaxSui 个人主页 API 运行中',
    endpoints: {
      profile: '/api/profile',
      blog: '/api/blog',
      works: '/api/works',
      contact: '/api/contact?password=xxx',
      admin: '/api/admin (需认证)'
    }
  });
});

// ---------- 启动服务 ----------
app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
