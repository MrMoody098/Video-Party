# Gamer Video App UI

A modern gaming video sharing platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎮 **Gaming-focused UI** with dark theme and neon accents
- 📹 **Video Upload** with drag & drop support
- 🏷️ **Tagging System** for organizing clips
- 🔒 **Privacy Controls** for private/public clips
- 📱 **Responsive Design** for all devices
- ⚡ **Fast Development** with Vite

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
In one terminal, start the upload server:
```bash
npm run server
```
This will start the server on `http://localhost:3001`

### 3. Start the Frontend
In another terminal, start the React development server:
```bash
npm run dev
```
This will start the app on `http://localhost:5173` (or next available port)

### 4. Upload Your First Clip!

1. Navigate to the **Upload Page** in the app
2. Drag & drop a video file or click "Browse Files"
3. Fill in the required fields:
   - **Title** (required)
   - **Game** (required)
   - **Description** (optional)
   - **Tags** (optional)
4. Set privacy settings
5. Click "Upload Clip"

## Project Structure

```
Gamer Video App UI/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   ├── Homepage.tsx   # Main homepage
│   ├── UploadPage.tsx # Video upload interface
│   └── ...
├── styles/
│   └── globals.css    # Tailwind CSS styles
├── uploads/           # Uploaded video files (created automatically)
├── server.js          # Express backend server
├── App.tsx            # Main React app
└── package.json       # Dependencies and scripts
```

## API Endpoints

- `POST /api/upload` - Upload a video file
- `GET /api/clips` - Get all uploaded clips
- `GET /api/clips/:id` - Get specific clip details
- `GET /uploads/:filename` - Serve uploaded video files

## Supported Video Formats

- MP4
- MOV
- AVI
- And other video formats supported by browsers

## File Size Limits

- Maximum file size: 500MB
- Files are stored locally in the `uploads/` folder

## Development

### Frontend (React + Vite)
- Hot module replacement
- TypeScript support
- Tailwind CSS for styling

### Backend (Express)
- File upload handling with Multer
- CORS enabled for frontend communication
- Local file storage
- RESTful API endpoints

## Troubleshooting

### Server Connection Issues
If you see "Network error" when uploading:
1. Make sure the backend server is running (`npm run server`)
2. Check that the server is on port 3001
3. Verify no firewall is blocking the connection

### File Upload Issues
- Ensure the file is a valid video format
- Check that the file size is under 500MB
- Make sure all required fields are filled

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Multer, CORS
- **UI Components**: Radix UI, Lucide React Icons
- **Styling**: Custom gaming theme with CSS variables 