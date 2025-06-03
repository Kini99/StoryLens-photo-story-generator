import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!image) {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title || 'Untitled Story');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/stories/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Story
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Story Title (Optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              mb: 3,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {preview ? (
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Click to upload an image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: JPG, PNG
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !image}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating Story...' : 'Create Story'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload; 