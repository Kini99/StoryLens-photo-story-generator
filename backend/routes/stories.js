import express from "express";
import { promises as fs } from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import imageService from "../services/imageService.js";
import ttsService from "../services/ttsService.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      console.error("Error creating upload directory:", error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed."
        )
      );
    }
  },
});

// Upload photo and generate story (text only)
router.post("/upload", upload.single("image"), async (req, res) => {
  let uploadedImagePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    uploadedImagePath = req.file.path;

    console.log(`Received image upload: ${uploadedImagePath}`);

    // Generate story from image
    const { caption, story } = await imageService.generateStory(uploadedImagePath);

    res.status(201).json({
      message: "Story generated successfully",
      caption,
      story,
    });

  } catch (error) {
    console.error("Error in image upload or story generation:", error);
    res.status(500).json({ error: "Failed to generate story" });
  } finally {
    // Clean up uploaded image file
    if (uploadedImagePath) {
      try {
        await fs.unlink(uploadedImagePath);
        console.log(`Deleted uploaded image: ${uploadedImagePath}`);
      } catch (cleanupError) {
        console.error(`Error deleting uploaded image ${uploadedImagePath}:`, cleanupError);
      }
    }
  }
});

// Generate audio for a given story text
router.post("/generate-audio", async (req, res) => {
  const { storyText } = req.body;
  if (!storyText) {
    return res.status(400).json({ error: "No story text provided" });
  }

  let audioPath = null;
  try {
    // Generate audio narration
    const audioFileName = `${Date.now()}.wav`;
    audioPath = path.join(uploadDir, audioFileName);
    
    console.log(`Generating audio for story and saving to ${audioPath}`);
    await ttsService.generateSpeech(storyText, audioPath);
    console.log('Audio generation successful.');

    res.status(200).json({
      message: "Audio generated successfully",
      audioPath: audioFileName // Return just the filename
    });

  } catch (error) {
    console.error("Error in audio generation:", error);
    res.status(500).json({ error: "Failed to generate audio" });
  } finally {
    // Clean up generated audio file after a delay to allow frontend to fetch it
    if (audioPath) {
      // A short delay might be necessary to ensure the frontend has time to fetch the file
      // In a production environment, a more robust approach like a temporary file service or streaming would be better
      setTimeout(async () => {
        try {
          await fs.unlink(audioPath);
          console.log(`Deleted generated audio: ${audioPath}`);
        } catch (cleanupError) {
          console.error(`Error deleting generated audio ${audioPath}:`, cleanupError);
        }
      }, 60000); // Delay deletion by 60 seconds
    }
  }
});

export default router;
