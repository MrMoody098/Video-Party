import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Readable } from 'stream';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Cloudflare R2 configuration - using actual credentials
const R2_ENDPOINT = 'https://605bc46c9ccdfba90ff0885535547b24.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = '07ca14facf3066e76f491f7ae111a132';
const R2_SECRET_ACCESS_KEY = 'e12716a6bff6c0ebbaac761d2ff105c43bdbefe28315679af9d37ce01ffc3cd1';
const R2_BUCKET_NAME = 'video-party-storage';

// Create S3 client for R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Upload video to R2
export async function uploadVideoToR2(fileBuffer, fileName, contentType) {
  try {
    console.log('☁️ Starting R2 upload...');
    console.log('📝 Upload details:', {
      fileName,
      contentType,
      bufferSize: fileBuffer.length,
      bucket: R2_BUCKET_NAME,
      key: `videos/${fileName}`
    });

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${fileName}`,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make videos publicly accessible
    });

    console.log('📤 Sending to R2...');
    const result = await r2Client.send(command);
    console.log('✅ R2 upload successful:', {
      etag: result.ETag,
      requestId: result.$metadata?.requestId
    });
    
    // Generate thumbnail
    console.log('🖼️ Generating thumbnail...');
    const thumbnailResult = await generateThumbnail(fileBuffer, fileName);
    console.log('✅ Thumbnail generated:', thumbnailResult);
    
    // Use our server endpoint to serve the video
    const publicUrl = `http://localhost:3001/api/video/${fileName}`;
    console.log('🔗 Generated video URL:', publicUrl);
    
    return {
      success: true,
      url: publicUrl,
      key: `videos/${fileName}`,
      etag: result.ETag,
      thumbnailUrl: thumbnailResult.thumbnailUrl,
      thumbnailKey: thumbnailResult.thumbnailKey
    };
  } catch (error) {
    console.error('💥 R2 upload error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    throw new Error('Failed to upload video to cloud storage');
  }
}

// Delete video from R2
export async function deleteVideoFromR2(fileName) {
  try {
    console.log('🗑️ Deleting video from R2:', fileName);
    
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${fileName}`,
    });

    console.log('📤 Sending delete command to R2...');
    await r2Client.send(command);
    console.log('✅ R2 delete successful');
    return { success: true };
  } catch (error) {
    console.error('💥 R2 delete error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    throw new Error('Failed to delete video from cloud storage');
  }
}

// Generate thumbnail from video
export async function generateThumbnail(videoBuffer, fileName) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('🖼️ Generating thumbnail for:', fileName);
      
      // Import fs for file operations
      const fs = await import('fs');
      const path = await import('path');
      const os = await import('os');
      
      // Create temporary file paths
      const tempDir = os.tmpdir();
      const videoPath = path.join(tempDir, fileName);
      const thumbnailPath = path.join(tempDir, `${fileName.replace(/\.[^/.]+$/, '')}_thumb.jpg`);
      
      // Write video buffer to temporary file
      fs.writeFileSync(videoPath, videoBuffer);
      console.log('📁 Video written to temp file:', videoPath);
      
      // Generate thumbnail using ffmpeg
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [5], // Take screenshot at 5 seconds
          filename: `${fileName.replace(/\.[^/.]+$/, '')}_thumb.jpg`,
          folder: tempDir,
          size: '320x240' // Standard thumbnail size
        })
        .on('end', async (stdout, stderr) => {
          try {
            console.log('✅ Thumbnail generated successfully');
            
            // Read the generated thumbnail file
            const thumbnailBuffer = fs.readFileSync(thumbnailPath);
            
            // Upload thumbnail to R2
            const thumbnailKey = `thumbnails/${fileName.replace(/\.[^/.]+$/, '')}_thumb.jpg`;
            const uploadCommand = new PutObjectCommand({
              Bucket: R2_BUCKET_NAME,
              Key: thumbnailKey,
              Body: thumbnailBuffer,
              ContentType: 'image/jpeg',
              ACL: 'public-read',
            });
            
            await r2Client.send(uploadCommand);
            console.log('✅ Thumbnail uploaded to R2');
            
            // Clean up temporary files
            fs.unlinkSync(videoPath);
            fs.unlinkSync(thumbnailPath);
            console.log('🗑️ Temporary files cleaned up');
            
            resolve({
              success: true,
              thumbnailUrl: `http://localhost:3001/api/thumbnail/${fileName.replace(/\.[^/.]+$/, '')}_thumb.jpg`,
              thumbnailKey: thumbnailKey
            });
          } catch (error) {
            console.error('💥 Error processing thumbnail:', error);
            // Clean up temp files on error
            try {
              if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
              if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
            } catch (cleanupError) {
              console.error('💥 Error cleaning up temp files:', cleanupError);
            }
            reject(error);
          }
        })
        .on('error', (err) => {
          console.error('💥 FFmpeg error:', err);
          // Clean up temp files on error
          try {
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
          } catch (cleanupError) {
            console.error('💥 Error cleaning up temp files:', cleanupError);
          }
          reject(err);
        });
    } catch (error) {
      console.error('💥 Thumbnail generation error:', error);
      reject(error);
    }
  });
}

// Generate signed URL for private videos (if needed)
export async function generateSignedUrl(fileName, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${fileName}`,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw new Error('Failed to generate signed URL');
  }
} 