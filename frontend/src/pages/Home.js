import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, AutoStories, VolumeUp } from '@mui/icons-material';
import { uploadImage, generateAudio } from '../services/api';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [audioPath, setAudioPath] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setStoryData(null);
      setError(null);
      setAudioPath(null);
      setAudioError(null);
    }
  };

  const handleGenerateStory = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setStoryData(null);
    setAudioPath(null);
    setAudioError(null);

    try {
      const data = await uploadImage(selectedImage);
      setStoryData(data);
    } catch (err) {
      console.error('Error uploading image or generating story:', err);
      setError(err.message || 'Failed to generate story.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async (storyText) => {
    if (!storyText) {
        setAudioError('No story text available to generate audio.');
        return;
    }

    setAudioLoading(true);
    setAudioError(null);
    setAudioPath(null);

    try {
        const data = await generateAudio(storyText);
        setAudioPath(data.audioPath);
    } catch (err) {
        console.error('Error generating audio:', err);
        setAudioError(err.message || 'Failed to generate audio.');
    } finally {
        setAudioLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setStoryData(null);
    setError(null);
    setLoading(false);
    setAudioPath(null);
    setAudioLoading(false);
    setAudioError(null);
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Story from Image
      </Typography>

      <Box sx={{ my: 4 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload-input"
          type="file"
          onChange={handleImageSelect}
        />
        <label htmlFor="image-upload-input">
          <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
            Select Image
          </Button>
        </label>
        {imagePreview && (
          <Box sx={{ mt: 2 }}>
            <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </Box>
        )}
      </Box>

      <Box>
        <Button
          variant="contained"
          onClick={handleGenerateStory}
          disabled={!selectedImage || loading || audioLoading}
          sx={{ mr: 2 }}
        >
          {loading ? 'Generating Story...' : 'Generate Story'}
        </Button>
        <Button variant="outlined" onClick={handleReset} disabled={loading || audioLoading}>
          Reset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {storyData && (
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h5" gutterBottom>
            Generated Story:
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Caption:</strong> {storyData.caption}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Story:</strong> {storyData.story}
          </Typography>

          {!audioPath && !audioLoading && (
            <Box sx={{ mt: 2 }}>
                 <Button
                    variant="contained"
                    onClick={() => handleGenerateAudio(storyData.story)}
                    disabled={!storyData.story || audioLoading}
                    startIcon={<VolumeUp />}
                >
                    Listen to Audio
                </Button>
                {audioLoading && (
                    <CircularProgress size={24} sx={{ ml: 2, verticalAlign: 'middle' }} />
                )}
            </Box>
          )}

          {audioPath && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Audio Narration:</Typography>
              <audio controls src={`http://localhost:5000/uploads/${audioPath}`}>
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}

          {audioError && (
            <Alert severity="error" sx={{ mt: 2 }}>
                {audioError}
            </Alert>
          )}
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PhotoCamera sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Upload Photos
                </Typography>
                <Typography color="text.secondary">
                  Share your favorite moments through photos - vacations, birthdays, or everyday snapshots.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AutoStories sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  AI Story Generation
                </Typography>
                <Typography color="text.secondary">
                  Our advanced AI model creates unique stories and poems inspired by your photos.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <VolumeUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Voice Narration
                </Typography>
                <Typography color="text.secondary">
                  Listen to your stories with natural-sounding AI voice narration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
    </Container>
  );
};

export default Home; 