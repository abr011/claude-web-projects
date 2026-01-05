from PIL import Image, ImageDraw, ImageFont
import os

# Captions for each step (from subtitles-en.srt)
captions = {
    1: "Click on the search field to add people",
    2: "Type a name to search",
    3: "Select a person from the autocomplete dropdown",
    4: "Click on another person card to add them",
    5: "Both people are now added with default permissions",
    6: "Click \"Manage individual permissions\" to customize access",
    7: "Set specific permissions for each person"
}

def add_caption_to_image(input_path, output_path, caption_text):
    """Add caption bar at bottom of image"""
    img = Image.open(input_path)

    # Create a new image with extra height for caption
    caption_height = 60
    new_height = img.height + caption_height
    captioned_img = Image.new('RGB', (img.width, new_height), color=(250, 250, 250))

    # Paste original image at top
    captioned_img.paste(img, (0, 0))

    # Draw caption bar
    draw = ImageDraw.Draw(captioned_img)

    # Dark background for caption
    caption_y = img.height
    draw.rectangle(
        [(0, caption_y), (img.width, new_height)],
        fill=(26, 26, 26)  # Soft black from design rules
    )

    # Add text
    try:
        # Try to use a system font
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Calculate text position (centered)
    bbox = draw.textbbox((0, 0), caption_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (img.width - text_width) // 2
    text_y = caption_y + (caption_height - text_height) // 2

    # Draw text in white
    draw.text((text_x, text_y), caption_text, fill=(255, 255, 255), font=font)

    # Save
    captioned_img.save(output_path)
    print(f"✓ Created {os.path.basename(output_path)}")

# Process all screenshots
print("Adding captions to screenshots...\n")

for step in range(1, 8):
    input_file = f"step-{step:02d}.png"
    output_file = f"step-{step:02d}-captioned.png"

    if os.path.exists(input_file):
        add_caption_to_image(input_file, output_file, captions[step])
    else:
        print(f"⚠ Skipped {input_file} (not found)")

print("\n✓ All captions added")
print("\nNow creating captioned GIF...")

# Create GIF from captioned screenshots
from PIL import Image
import glob

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
    duration=2000,  # 2 seconds per frame
    loop=0,
    optimize=True
)

print("✓ Created share-form-demo-captioned.gif")
print("  Ready for webpage with visible captions")
