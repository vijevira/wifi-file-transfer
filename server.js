const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(uploadDir));

// File upload setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ filePath: `/uploads/${req.file.filename}`, fileName: req.file.originalname });
});

// Endpoint to list uploaded files
app.get('/list-files', (req, res) => {
    const subPath = req.query.path || '';
    const targetDir = path.join(uploadDir, subPath);
  
    fs.readdir(targetDir, (err, entries) => {
      if (err) return res.status(500).json({ error: 'Failed to read directory' });
  
      const fileList = entries.map(name => {
        const fullPath = path.join(targetDir, name);
        const isFile = fs.statSync(fullPath).isFile();
        return {
          name,
          type: isFile ? 'file' : 'directory',
          relativePath: path.join(subPath, name).replace(/\\/g, '/') // for Windows fix
        };
      });
  
      res.json(fileList);
    });
  });
// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let info of iface) {
      if (info.family === 'IPv4' && !info.internal) return info.address;
    }
  }
  return 'localhost';
}

app.listen(port, () => {
  console.log(`Server running at http://${getLocalIP()}:${port}`);
});
