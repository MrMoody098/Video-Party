import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { supabase, clipsTable, initializeDatabase } from './config/database.js';
import { uploadVideoToR2, deleteVideoFromR2, r2Client } from './config/storage.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';

// Import R2 configuration from storage
const R2_BUCKET_NAME = 'video-party-storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database connection
initializeDatabase();

// Configure multer for memory storage (we'll upload directly to R2)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    console.log('🚀 Starting video upload...');
    console.log('📁 File info:', {
      originalname: req.file?.originalname,
      filename: req.file?.filename,
      mimetype: req.file?.mimetype,
      size: req.file?.size
    });

    if (!req.file) {
      console.error('❌ No video file provided');
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Generate a proper filename if none exists
    const filename = req.file.filename || `${Date.now()}-${req.file.originalname}`;
    console.log('📝 Generated filename:', filename);
    
    // Upload video to Cloudflare R2
    console.log('☁️ Uploading to Cloudflare R2...');
    const uploadResult = await uploadVideoToR2(
      req.file.buffer,
      filename,
      req.file.mimetype
    );
    console.log('✅ R2 upload result:', {
      success: uploadResult.success,
      url: uploadResult.url,
      key: uploadResult.key,
      etag: uploadResult.etag
    });

    // Save metadata to Supabase
    const clipData = {
      id: Date.now().toString(),
      filename: filename,
      original_name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      title: req.body.title || 'Untitled Clip',
      description: req.body.description || '',
      game: req.body.game || 'Unknown',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      is_private: req.body.isPrivate === 'true',
      uploaded_at: new Date().toISOString(),
      views: 0,
      likes: 0,
      video_url: uploadResult.url,
      storage_key: uploadResult.key,
      thumbnail_url: uploadResult.thumbnailUrl || null
    };
    console.log('💾 Saving to database:', clipData);

    const { data, error } = await supabase
      .from(clipsTable)
      .insert([clipData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      // If database insert fails, delete the uploaded video
      console.log('🗑️ Cleaning up R2 file due to DB error...');
      await deleteVideoFromR2(filename);
      return res.status(500).json({ error: 'Failed to save video metadata' });
    }

    console.log('✅ Video upload completed successfully!');
    console.log('📊 Final clip data:', data);

    res.json({
      success: true,
      message: 'Video uploaded successfully!',
      clip: data
    });

  } catch (error) {
    console.error('💥 Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

app.delete('/api/clips/:id', async (req, res) => {
  try {
    console.log('🗑️ Delete request for clip ID:', req.params.id);
    
    // Get clip data from database
    const { data: clip, error: fetchError } = await supabase
      .from(clipsTable)
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !clip) {
      console.error('❌ Clip not found:', req.params.id);
      return res.status(404).json({ error: 'Clip not found' });
    }

    console.log('📁 Found clip to delete:', {
      id: clip.id,
      filename: clip.filename,
      title: clip.title
    });

    // Delete video from R2
    console.log('☁️ Deleting from R2...');
    await deleteVideoFromR2(clip.filename);
    console.log('✅ R2 deletion successful');

    // Delete metadata from database
    console.log('🗄️ Deleting from database...');
    const { error: deleteError } = await supabase
      .from(clipsTable)
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError);
      return res.status(500).json({ error: 'Failed to delete video metadata' });
    }

    console.log('✅ Video deleted successfully!');
    res.json({
      success: true,
      message: 'Video deleted successfully!',
      deletedClip: clip
    });

  } catch (error) {
    console.error('💥 Delete error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

app.get('/api/clips', async (req, res) => {
  try {
    const { data: clips, error } = await supabase
      .from(clipsTable)
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch clips' });
    }

    res.json(clips || []);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch clips' });
  }
});

app.get('/api/clips/:id', async (req, res) => {
  try {
    const { data: clip, error } = await supabase
      .from(clipsTable)
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !clip) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    res.json(clip);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch clip' });
  }
});

// Serve video files directly from R2
app.get('/api/video/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('🎬 Video request for filename:', filename);
    
    // Get the video from R2
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${filename}`,
    });
    console.log('🔍 Looking for video at key:', `videos/${filename}`);
    
    const result = await r2Client.send(getCommand);
    console.log('✅ Video found in R2:', {
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      etag: result.ETag,
      hasBody: !!result.Body
    });
    
    // Set appropriate headers
    res.setHeader('Content-Type', result.ContentType || 'video/mp4');
    res.setHeader('Content-Length', result.ContentLength);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    
    console.log('📤 Streaming video with headers:', {
      'Content-Type': result.ContentType || 'video/mp4',
      'Content-Length': result.ContentLength,
      'Accept-Ranges': 'bytes'
    });
    
    // Stream the video
    if (result.Body) {
      result.Body.pipe(res);
      console.log('✅ Video stream started');
    } else {
      console.error('❌ No video body found');
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('💥 Video serve error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    res.status(500).json({ error: 'Failed to serve video' });
  }
});

// Serve thumbnail files directly from R2
app.get('/api/thumbnail/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('🖼️ Thumbnail request for filename:', filename);
    
    // Get the thumbnail from R2
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `thumbnails/${filename}`,
    });
    console.log('🔍 Looking for thumbnail at key:', `thumbnails/${filename}`);
    
    const result = await r2Client.send(getCommand);
    console.log('✅ Thumbnail found in R2:', {
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      etag: result.ETag,
      hasBody: !!result.Body
    });
    
    // Set appropriate headers
    res.setHeader('Content-Type', result.ContentType || 'image/jpeg');
    res.setHeader('Content-Length', result.ContentLength);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    console.log('📤 Streaming thumbnail with headers:', {
      'Content-Type': result.ContentType || 'image/jpeg',
      'Content-Length': result.ContentLength
    });
    
    // Stream the thumbnail
    if (result.Body) {
      result.Body.pipe(res);
      console.log('✅ Thumbnail stream started');
    } else {
      console.error('❌ No thumbnail body found');
      res.status(404).json({ error: 'Thumbnail not found' });
    }
  } catch (error) {
    console.error('💥 Thumbnail serve error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    res.status(500).json({ error: 'Failed to serve thumbnail' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    storage: 'Cloudflare R2',
    database: 'Supabase'
  });
});

// Endpoint to fix old video URLs in database
app.post('/api/fix-urls', async (req, res) => {
  try {
    console.log('🔧 Fixing old video URLs in database...');
    
    // Get all clips
    const { data: clips, error: fetchError } = await supabase
      .from(clipsTable)
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching clips:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch clips' });
    }
    
    let updatedCount = 0;
    
    // Update each clip with the correct video URL
    for (const clip of clips) {
      const correctVideoUrl = `http://localhost:3001/api/video/${clip.filename}`;
      
      if (clip.video_url !== correctVideoUrl) {
        console.log(`🔄 Updating clip ${clip.id}: ${clip.video_url} -> ${correctVideoUrl}`);
        
        const { error: updateError } = await supabase
          .from(clipsTable)
          .update({ video_url: correctVideoUrl })
          .eq('id', clip.id);
        
        if (updateError) {
          console.error(`❌ Error updating clip ${clip.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
    
    console.log(`✅ Updated ${updatedCount} clips`);
    res.json({ 
      success: true, 
      message: `Updated ${updatedCount} clips`,
      updatedCount 
    });
    
  } catch (error) {
    console.error('💥 Error fixing URLs:', error);
    res.status(500).json({ error: 'Failed to fix URLs' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Cloud-powered server running on http://localhost:${PORT}`);
  console.log(`📁 Videos stored in: Cloudflare R2`);
  console.log(`🗄️  Metadata stored in: Supabase`);
}); 