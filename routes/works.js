const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate } = require('../middleware/auth');

const FILE_NAME = 'works.json';

// 公开获取作品
router.get('/', (req, res) => {
  const works = readJSON(FILE_NAME) || [];
  res.json(works);
});

// 管理员添加作品
router.post('/', authenticate, (req, res) => {
  const { name, description, icon, link } = req.body;
  const works = readJSON(FILE_NAME) || [];
  const newWork = {
    id: works.length > 0 ? Math.max(...works.map(w => w.id)) + 1 : 1,
    name,
    description,
    icon: icon || 'fa-code',
    link
  };
  works.push(newWork);
  writeJSON(FILE_NAME, works);
  res.status(201).json(newWork);
});

// 管理员更新作品
router.put('/:id', authenticate, (req, res) => {
  const works = readJSON(FILE_NAME) || [];
  const index = works.findIndex(w => w.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: '作品不存在' });
  works[index] = { ...works[index], ...req.body, id: works[index].id };
  writeJSON(FILE_NAME, works);
  res.json(works[index]);
});

// 管理员删除作品
router.delete('/:id', authenticate, (req, res) => {
  let works = readJSON(FILE_NAME) || [];
  const newWorks = works.filter(w => w.id != req.params.id);
  if (newWorks.length === works.length) return res.status(404).json({ error: '作品不存在' });
  writeJSON(FILE_NAME, newWorks);
  res.json({ success: true });
});

module.exports = router;