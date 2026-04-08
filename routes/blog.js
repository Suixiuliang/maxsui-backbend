const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileHelper');
const { authenticate } = require('../middleware/auth');

const FILE_NAME = 'blog.json';

// 公开获取所有博客
router.get('/', (req, res) => {
  const posts = readJSON(FILE_NAME) || [];
  res.json(posts);
});

// 公开获取单篇博客
router.get('/:id', (req, res) => {
  const posts = readJSON(FILE_NAME) || [];
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: '文章不存在' });
  res.json(post);
});

// 管理员创建文章
router.post('/', authenticate, (req, res) => {
  const { title, summary, content, date, readTime, icon } = req.body;
  const posts = readJSON(FILE_NAME) || [];
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const newPost = {
    id: newId,
    title,
    summary: summary || '',
    content: content || '',
    date: date || new Date().toISOString().split('T')[0],
    readTime: readTime || '5 min',
    icon: icon || 'fa-pen'
  };
  posts.push(newPost);
  writeJSON(FILE_NAME, posts);
  res.status(201).json(newPost);
});

// 管理员更新文章
router.put('/:id', authenticate, (req, res) => {
  const posts = readJSON(FILE_NAME) || [];
  const index = posts.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: '文章不存在' });
  posts[index] = { ...posts[index], ...req.body, id: posts[index].id };
  writeJSON(FILE_NAME, posts);
  res.json(posts[index]);
});

// 管理员删除文章
router.delete('/:id', authenticate, (req, res) => {
  let posts = readJSON(FILE_NAME) || [];
  const newPosts = posts.filter(p => p.id != req.params.id);
  if (newPosts.length === posts.length) return res.status(404).json({ error: '文章不存在' });
  writeJSON(FILE_NAME, newPosts);
  res.json({ success: true });
});

module.exports = router;