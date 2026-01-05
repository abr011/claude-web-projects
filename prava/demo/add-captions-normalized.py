from PIL import Image, ImageDraw, ImageFont
import glob
import os

# Captions for each step
captions = {
    1: "Click on the search field to add people",
    2: "Type a name to search",
    3: "Select a person from the autocomplete dropdown",
    4: "Click on another person card to add them",
    5: "Both people are now added with default permissions",
    6: "Click \"Manage individual permissions\" to customize access",
    7: "Set specific permissions for each person"
}

print("Step 1: Finding maximum height across all screenshots...")

# Find the tallest screenshot
max_height = 0
max_width = 0
screenshot_files = sorted([f for f in glob.glob('step-*.png') if 'captioned' not in f and 'base' not in f and 'full' not in f])

for filename in screenshot_files:
    img = Image.open(filename)
    if img.height > max_height:
        max_height = img.height
    if img.width > max_width:
        max_width = img.width

print(f"✓ Maximum dimensions: {max_width}x{max_height}")

print("\nStep 2: Normalizing all frames and adding captions...")

caption_height = 60

def add_caption_to_normalized_image(input_path, output_path, caption_text, target_height, target_width):
    """Normalize frame height, then add caption"""
    img = Image.open(input_path)

    # Create normalized image (same width, padded to max height)
    normalized = Image.new('RGB', (target_width, target_height), color=(250, 250, 250))
    normalized.paste(img, (0, 0))

    # Now add caption bar at bottom
    captioned_height = target_height + caption_height
    captioned_img = Image.new('RGB', (target_width, captioned_height), color=(250, 250, 250))
    captioned_img.paste(normalized, (0, 0))

    # Draw caption bar
    draw = ImageDraw.Draw(captioned_img)
    caption_y = target_height
    draw.rectangle(
        [(0, caption_y), (target_width, captioned_height)],
        fill=(26, 26, 26)
    )

    # Add text - bigger and bolder
    try:
        # Try Helvetica Bold first, fallback to regular Helvetica, then default
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20, index=1)  # Bold
        except:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)  # Regular
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), caption_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (target_width - text_width) // 2
    text_y = caption_y + (caption_height - text_height) // 2

    draw.text((text_x, text_y), caption_text, fill=(255, 255, 255), font=font)

    captioned_img.save(output_path)
    print(f"✓ Created {os.path.basename(output_path)}")

# Process all screenshots with normalization (steps 1-7)
for step in range(1, 8):
    input_file = f"step-{step:02d}.png"
    output_file = f"step-{step:02d}-captioned.png"

    if os.path.exists(input_file):
        add_caption_to_normalized_image(
            input_file,
            output_file,
            captions[step],
            max_height,
            max_width
        )

# Step 8: End card already has proper dimensions, just copy it
if os.path.exists('step-08-end-card.png'):
    import shutil
    shutil.copy('step-08-end-card.png', 'step-08-captioned.png')
    print("✓ Added step-08-captioned.png (end card)")

print("\nStep 3: Creating captioned GIF...")

# Create GIF from captioned screenshots
images = []
filenames = sorted([f for f in glob.glob('step-*-captioned.png')])

for filename in filenames:
    img = Image.open(filename)
    # Resize to 560px width
    width = 560
    height = int(img.height * (width / img.width))
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    images.append(img)

# Save as animated GIF
images[0].save(
    'share-form-demo-captioned.gif',
    save_all=True,
    append_images=images[1:],
    duration=2000,
    loop=0,
    optimize=True
)

print("\n✓ Created share-form-demo-captioned.gif")
print(f"  All frames normalized to {max_width}x{max_height + caption_height}")
print("  Captions are now visible on all frames")
