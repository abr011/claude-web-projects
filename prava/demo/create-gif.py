#!/usr/bin/env python3
from PIL import Image
import glob

# Get all screenshot files in order (excluding intermediate files)
images = []
filenames = sorted([f for f in glob.glob('step-*.png') if 'base' not in f and 'full' not in f])

print(f"Found {len(filenames)} screenshots")

for filename in filenames:
    img = Image.open(filename)

    # Resize to 560px width (30% smaller than 800px)
    width = 560
    height = int(img.height * (width / img.width))
    img = img.resize((width, height), Image.Resampling.LANCZOS)

    images.append(img)
    print(f"✓ Processed: {filename}")

# Save as animated GIF
# Duration in milliseconds per frame (2000ms = 2 seconds)
images[0].save(
    'share-form-demo.gif',
    save_all=True,
    append_images=images[1:],
    duration=2000,
    loop=0,
    optimize=True
)

print("\n✓ Created share-form-demo.gif")
print(f"  {len(images)} frames, 2 seconds per frame")
print(f"  Clean GIF (no captions)")
