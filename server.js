import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for React app
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is a video
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Store uploaded clips metadata
let uploadedClips = [];

// Upload endpoint
app.post('/api/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const clipData = {
      id: Date.now().toString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      title: req.body.title || 'Untitled Clip',
      description: req.body.description || '',
      game: req.body.game || 'Unknown',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      isPrivate: req.body.isPrivate === 'true',
      uploadedAt: new Date().toISOString(),
      views: 0,
      likes: 0
    };

    uploadedClips.push(clipData);

    res.json({
      success: true,
      message: 'Video uploaded successfully!',
      clip: clipData
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all clips endpoint
app.get('/api/clips', (req, res) => {
  res.json(uploadedClips);
});

// Get specific clip endpoint
app.get('/api/clips/:id', (req, res) => {
  const clip = uploadedClips.find(c => c.id === req.params.id);
  if (clip) {
    res.json(clip);
  } else {
    res.status(404).json({ error: 'Clip not found' });
  }
});

// Delete clip endpoint
app.delete('/api/clips/:id', (req, res) => {
  try {
    const clipIndex = uploadedClips.findIndex(c => c.id === req.params.id);
    
    if (clipIndex === -1) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const clip = uploadedClips[clipIndex];
    
    // Delete the file from disk
    const filePath = path.join(uploadsDir, clip.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from metadata array
    uploadedClips.splice(clipIndex, 1);

    res.json({
      success: true,
      message: 'Video deleted successfully!',
      deletedClip: clip
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Upload server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads stored in: ${uploadsDir}`);
}); 