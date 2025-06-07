import { pipeline } from '@xenova/transformers';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TTSService {
    constructor() {
        this.tts = null;
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            console.log('Initializing TTS service...');
            try {
                this.tts = await pipeline('text-to-speech', 'Xenova/speecht5_tts');
                this.initialized = true;
                console.log('TTS service initialized.');
            } catch (error) {
                console.error('Error initializing TTS service:', error);
                if (error.stack) console.error('Error Stack:', error.stack);
                if (error.message) console.error('Error Message:', error.message);
                throw new Error('Failed to initialize text-to-speech service');
            }
        }
    }

    async generateSpeech(text, outputPath) {
        console.log(`Generating speech for text: ${text.substring(0, 50)}...`);
        try {
            await this.initialize();
            
            console.log('Calling TTS pipeline...');
            // Generate speech
            const result = await this.tts(text);
            console.log('TTS pipeline finished.');
            
            console.log(`Writing audio file to ${outputPath}...`);
            // Save the audio file
            if (result && result.audio) {
                await fs.writeFile(outputPath, result.audio);
                console.log('Audio file written successfully.');
            } else {
                throw new Error('TTS pipeline did not return expected audio data.');
            }
            
            return outputPath;
        } catch (error) {
            console.error('Error generating speech:', error);
            if (error.stack) console.error('Error Stack:', error.stack);
            if (error.message) console.error('Error Message:', error.message);
            throw new Error('Failed to generate speech from text');
        }
    }
}

export default new TTSService(); 