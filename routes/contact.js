const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate } = require('../middleware/auth');

const FILE_NAME = 'contact.json';

// 公开获取联系方式（需口令验证）
router.get('/', (req, res) => {
  const { password } = req.query;
  const CORRECT_PASSWORD = process.env.CONTACT_PASSWORD || '1234';
  if (password !== CORRECT_PASSWORD) {
    return res.status(403).json({ error: '口令错误' });
  }
  const contact = readJSON(FILE_NAME) || { email: '', wechat: '', qq: '' };
  res.json(contact);
});

// 管理员更新联系方式
router.put('/', authenticate, (req, res) => {
  const { email, wechat, qq } = req.body;
  const current = readJSON(FILE_NAME) || {};
  const newContact = {
    email: email ?? current.email,
    wechat: wechat ?? current.wechat,
    qq: qq ?? current.qq
  };
  if (writeJSON(FILE_NAME, newContact)) {
    res.json({ success: true, data: newContact });
  } else {
    res.status(500).json({ error: '保存失败' });
  }
});

module.exports = router;