require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于访问上传的头像）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保 data 和 uploads 目录存在
['data', 'uploads'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 引入路由
app.use('/api/profile', require('./routes/profile'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/works', require('./routes/works'));
app.use('/api/contact', require('./routes/contact'));

// 登录接口（管理员获取token）
const { generateToken } = require('./middleware/auth');
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

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'MaxSui 个人主页 API 运行中' });
});

app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});