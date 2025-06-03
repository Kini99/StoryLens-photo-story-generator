import sys
import os
from transformers import AutoProcessor, AutoModelForVision2Seq
from PIL import Image

def generate_story(image_path, api_key):
    try:
        # Load model and processor
        processor = AutoProcessor.from_pretrained("microsoft/kosmos-2")
        model = AutoModelForVision2Seq.from_pretrained("microsoft/kosmos-2")

        # Load and process image
        image = Image.open(image_path)
        inputs = processor(images=image, return_tensors="pt")

        # Generate story
        generated_ids = model.generate(
            pixel_values=inputs.pixel_values,
            max_length=200,
            num_beams=5,
            no_repeat_ngram_size=2
        )

        # Decode and return story
        story = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        return story

    except Exception as e:
        print(f"Error generating story: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_story.py <image_path> <api_key>")
        sys.exit(1)

    image_path = sys.argv[1]
    api_key = sys.argv[2]

    story = generate_story(image_path, api_key)
    print(story) 