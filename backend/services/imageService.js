import { pipeline } from '@xenova/transformers';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageService {
    constructor() {
        this.imageCaptioner = null; // Pipeline for image captioning
        this.storyGenerator = null; // Pipeline for text generation
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            console.log('Initializing image captioning and story generation services...');
            try {
                // Initialize image captioning pipeline
                console.log('Initializing image captioning pipeline...');
                this.imageCaptioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', { timeout: 60000 });
                console.log('Image captioning pipeline initialized.');

                // Initialize text generation pipeline
                console.log('Initializing story generation pipeline with TinyLlama...');
                this.storyGenerator = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0', { timeout: 300000 }); // Increased timeout to 5 minutes
                console.log('Story generation pipeline initialized.');

                this.initialized = true;
                console.log('Image processing and story generation services initialized.');
            } catch (error) {
                console.error('Error initializing image captioning or story generation services:', error);
                if (error.stack) console.error('Error Stack:', error.stack);
                if (error.message) console.error('Error Message:', error.message);
                throw new Error('Failed to initialize image processing or story generation services.');
            }
        }
    }

    async generateStory(imagePath) {
        console.log(`Generating caption and story for image: ${imagePath}`);
        try {
            await this.initialize();

            // 1. Generate caption from the image
            console.log('Generating caption...');
            const captionResult = await this.imageCaptioner(imagePath);
            const caption = captionResult[0]?.generated_text || 'No caption generated.';
            console.log(`Generated Caption: ${caption}`);

            // 2. Generate story from the caption using text generation model
            console.log('Generating story from caption...');
            // Refined prompt for creative story generation
            const storyPrompt = `Create a unique and creative short story, or a descriptive poem, inspired by the following image caption:\n\nCaption: "${caption}"\n\nStory/Poem:`; // Further refined prompt
            const storyResult = await this.storyGenerator(storyPrompt, { 
                max_new_tokens: 300, // Further increased story length
                temperature: 0.9, // Increased temperature for more randomness and creativity
                do_sample: true, // Ensure sampling is enabled
                repetition_penalty: 1.3, // Further penalize repetition
                // You might experiment with top_k or top_p for different sampling strategies
                // top_k: 50,
                // top_p: 0.95,
            });
            
            const story = storyResult[0]?.generated_text || 'No story generated.';
            console.log(`Generated Story (raw): ${story}`);
            
            // Clean up the prompt prefix from the story result
            // Models might include the prompt in the output, or add special tokens
            let cleanedStory = story.replace(storyPrompt, '').trim();

            // Further cleaning for potential chat template artifacts or incomplete sentences
            if (cleanedStory.startsWith("<|user|>") || cleanedStory.startsWith("<|assistant|>")) {
                 cleanedStory = cleanedStory.replace(/^<\|.*?\|>\n*/, '').trim();
            }

            // Basic check to avoid returning just the caption again
            if (cleanedStory.length < caption.length * 2 && cleanedStory.includes(caption.split(' ')[0])) { // Simple check: if cleaned story is less than twice the caption length and contains the first word of the caption, it might be a bad generation.
                 console.log("Generated story seems too short or too similar to caption, attempting alternative.");
                 // If the initial generation is poor, you might consider a retry with different parameters or a different prompt structure if the model supports it.
                 // For now, returning a fallback or the slightly cleaned version.
                 // Returning the slightly cleaned version for now, as retrying within this function adds complexity.
            }

            console.log(`Generated Story (cleaned): ${cleanedStory}`);
            
            console.log('Story generated successfully.');
            
            return {
                caption,
                story: cleanedStory
            };
        } catch (error) {
            console.error('Error generating story:', error);
            if (error.stack) console.error('Error Stack:', error.stack);
            if (error.message) console.error('Error Message:', error.message);
            throw new Error('Failed to generate story from image.');
        }
    }
}

export default new ImageService(); 