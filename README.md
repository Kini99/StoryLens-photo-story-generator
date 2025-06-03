# StoryLens - Multi-modal Photo Story Generator

StoryLens is an AI-powered application that generates creative stories and poems from uploaded photos, complete with AI voice narration.

## Features

- Photo upload and processing
- AI-powered story/poem generation using Microsoft's Kosmos-2 model
- AI voice narration using Coqui's XTTS-v2
- User authentication and story management
- Responsive web interface

## Tech Stack

- **Frontend**: React.js, Material-UI, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Models**: 
  - Microsoft Kosmos-2 (Image understanding and story generation)
  - Coqui XTTS-v2 (Text-to-speech)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Python 3.8+ (for AI models)
- Git

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
KOSMOS_API_KEY=your_kosmos_api_key
COQUI_API_KEY=your_coqui_api_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/StoryLens.git
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

4. Install Python dependencies for AI models:
```bash
pip install -r requirements.txt
```

## API Endpoints

- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/stories/upload - Upload photo and generate story
- GET /api/stories - Get user's stories
- GET /api/stories/:id - Get specific story
- DELETE /api/stories/:id - Delete story

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License