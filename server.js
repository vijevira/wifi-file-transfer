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

app.use('/uploads', (req, res, next) => {
  const filePath = path.join(uploadDir, req.path);
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[${new Date().toISOString()}] 📥 File download started: ${req.path} by ${clientIp}`);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      console.log(`[${new Date().toISOString()}] 📥 File downloaded: ${req.path} by ${clientIp}`);
    } else {
      console.error(`[${new Date().toISOString()}] 📥 File download failed: ${req.path} by ${clientIp}`);
    }
    next();
  });
}, express.static(uploadDir));

// File upload setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.warn(`[${new Date().toISOString()}] ❌ Upload failed — No file received`);
    return res.status(400).send('No file uploaded.');
  }
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[${new Date().toISOString()}] ✅ File uploaded: ${req.file.originalname} from ${clientIp}`);
  res.send({ filePath: `/uploads/${req.file.filename}`, fileName: req.file.originalname });
});

// Endpoint to list uploaded files
app.get('/list-files', (req, res) => {
  const subPath = req.query.path || '';
  const targetDir = path.join(uploadDir, subPath);

  fs.readdir(targetDir, (err, entries) => {
    if (err) return res.status(500).json({ error: 'Failed to read directory' });

    const fileList = entries
      .filter(name => !name.startsWith('.')) // Exclude hidden files and folders
      .map(name => {
        const fullPath = path.join(targetDir, name);
        const isFile = fs.statSync(fullPath).isFile();
        return {
          name,
          type: isFile ? 'file' : 'directory',
          relativePath: path.join(subPath, name).replace(/\\/g, '/') // Fix for Windows paths
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
