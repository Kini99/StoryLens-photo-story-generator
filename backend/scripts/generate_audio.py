import sys
import os
from TTS.api import TTS

def generate_audio(text, api_key):
    try:
        # Initialize TTS
        tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2")

        # Generate audio file path
        output_path = f"uploads/audio_{os.urandom(4).hex()}.wav"

        # Generate audio
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav="path/to/reference_audio.wav",  # You'll need to provide a reference audio file
            language="en"
        )

        return output_path

    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_audio.py <text> <api_key>")
        sys.exit(1)

    text = sys.argv[1]
    api_key = sys.argv[2]

    audio_path = generate_audio(text, api_key)
    print(audio_path) 