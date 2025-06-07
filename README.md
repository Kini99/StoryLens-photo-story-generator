# StoryLens - Multi-modal Photo Story Generator

StoryLens is an AI-powered application that generates 
creative stories and poems from uploaded photos, complete 
with AI voice narration.

## Features

- Photo upload
- AI-powered story generation from images
- AI voice narration for the generated story (on demand)

## Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js, Multer, @xenova/transformers

## Prerequisites

- Node.js (v14 or higher)
- Git

## Environment Variables

### Backend (.env)
```
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Kini99/StoryLens-photo-story-generator.git
cd StoryLens
```

2. Backend Setup:
```bash
cd backend
npm install
npm start
```

3. Frontend Setup:
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- POST /api/stories/upload - Upload photo and generate story and audio

