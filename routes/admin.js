const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate, generateToken } = require('../middleware/auth');

// 管理员登录（用于管理后台验证）
router.post('/login', (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === ADMIN_PASSWORD) {
    const token = generateToken({ role: 'admin' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: '密码错误' });
  }
});

// 获取所有可编辑数据（需认证）
router.get('/settings', authenticate, (req, res) => {
  const profile = readJSON('profile.json') || {};
  const blog = readJSON('blog.json') || [];
  const works = readJSON('works.json') || [];
  const contact = readJSON('contact.json') || {};
  res.json({ profile, blog, works, contact });
});

// 批量更新数据（需认证）
router.post('/settings', authenticate, (req, res) => {
  const { profile, blog, works, contact } = req.body;
  let success = true;
  if (profile !== undefined) success = success && writeJSON('profile.json', profile);
  if (blog !== undefined) success = success && writeJSON('blog.json', blog);
  if (works !== undefined) success = success && writeJSON('works.json', works);
  if (contact !== undefined) success = success && writeJSON('contact.json', contact);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: '部分数据保存失败' });
  }
});

// 上传头像（复用 profile 路由中的逻辑，但这里也可以独立）
// 建议直接使用 /api/profile/upload-avatar 接口，管理后台调用即可

module.exports = router;
