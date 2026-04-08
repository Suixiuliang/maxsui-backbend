const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readJSON = (filename) => {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      if (filename === 'profile.json') return { name: '', bio: '', interests: [], avatar: '', grade: '', age: '' };
      if (filename === 'blog.json') return [];
      if (filename === 'works.json') return [];
      if (filename === 'contact.json') return { email: '', wechat: '', qq: '' };
      return {};
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`读取 ${filename} 失败:`, err);
    return null;
  }
};

const writeJSON = (filename, data) => {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`写入 ${filename} 失败:`, err);
    return false;
  }
};

module.exports = { readJSON, writeJSON };