const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileHelper');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

const FILE_NAME = 'profile.json';

// 公开获取个人资料
router.get('/', (req, res) => {
  const data = readJSON(FILE_NAME) || {};
  res.json(data);
});

// 管理员更新个人资料
router.put('/', authenticate, (req, res) => {
  const { name, bio, interests, grade, age, avatar } = req.body;
  const current = readJSON(FILE_NAME) || {};
  const newData = {
    ...current,
    name: name ?? current.name,
    bio: bio ?? current.bio,
    interests: interests ?? current.interests,
    grade: grade ?? current.grade,
    age: age ?? current.age,
    avatar: avatar ?? current.avatar
  };
  if (writeJSON(FILE_NAME, newData)) {
    res.json({ success: true, data: newData });
  } else {
    res.status(500).json({ error: '保存失败' });
  }
});

// 上传头像（需认证）
router.post('/upload-avatar', authenticate, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '未上传文件' });
  }
  const avatarUrl = `/uploads/${req.file.filename}`;
  const profile = readJSON(FILE_NAME) || {};
  profile.avatar = avatarUrl;
  writeJSON(FILE_NAME, profile);
  res.json({ success: true, avatarUrl });
});

module.exports = router;