import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';

const StoryDetail = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStory();
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${id}`);
      setStory(response.data);
    } catch (err) {
      setError('Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.src = `${process.env.REACT_APP_API_URL}${story.audioUrl}`;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Story not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {story.title}
        </Typography>

        <Box
          component="img"
          src={`${process.env.REACT_APP_API_URL}${story.imageUrl}`}
          alt={story.title}
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3,
          }}
        />

        <Typography variant="body1" paragraph>
          {story.story}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <IconButton
            color="primary"
            onClick={handlePlayPause}
            sx={{ mr: 2 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {isPlaying ? 'Pause Audio' : 'Play Audio'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default StoryDetail; 