from PIL import Image, ImageDraw, ImageFont
import glob
import os

# Czech captions for each step
captions = {
    1: "Klikněte do vyhledávacího pole",
    2: "Napište jméno pro vyhledání",
    3: "Vyberte osobu z rozbalovacího seznamu",
    4: "Klikněte na další kartu pro přidání",
    5: "Obě osoby přidány s výchozími oprávněními",
    6: "Klikněte na \"Upravit individuální oprávnění\"",
    7: "Nastavte konkrétní oprávnění pro každou osobu"
}

print("Krok 1: Hledám maximální výšku screenshotů...")

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

print(f"✓ Maximální rozměry: {max_width}x{max_height}")

print("\nKrok 2: Normalizuji snímky a přidávám české titulky...")

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
    print(f"✓ Vytvořen {os.path.basename(output_path)}")

# Process all screenshots with normalization (steps 1-7)
for step in range(1, 8):
    input_file = f"step-{step:02d}.png"
    output_file = f"step-{step:02d}-captioned-cs.png"

    if os.path.exists(input_file):
        add_caption_to_normalized_image(
            input_file,
            output_file,
            captions[step],
            max_height,
            max_width
        )

# Step 8: End card - create Czech version
print("\nKrok 3: Vytvářím českou koncovou kartu...")

end_card_width = max_width
end_card_height = max_height + caption_height
end_card = Image.new('RGB', (end_card_width, end_card_height), color=(26, 26, 26))
draw = ImageDraw.Draw(end_card)

try:
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28, index=1)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
except:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Main text
main_text = "Napište jméno, klikněte, sdílejte."
bbox = draw.textbbox((0, 0), main_text, font=font_large)
text_width = bbox[2] - bbox[0]
text_x = (end_card_width - text_width) // 2
draw.text((text_x, end_card_height // 2 - 30), main_text, fill=(255, 255, 255), font=font_large)

# Subtitle
subtitle = "To je vše."
bbox = draw.textbbox((0, 0), subtitle, font=font_small)
text_width = bbox[2] - bbox[0]
text_x = (end_card_width - text_width) // 2
draw.text((text_x, end_card_height // 2 + 20), subtitle, fill=(153, 153, 153), font=font_small)

end_card.save('step-08-captioned-cs.png')
print("✓ Vytvořen step-08-captioned-cs.png (koncová karta)")

print("\nKrok 4: Vytvářím český GIF s titulky...")

# Create GIF from captioned screenshots
images = []
filenames = sorted([f for f in glob.glob('step-*-captioned-cs.png')])

for filename in filenames:
    img = Image.open(filename)
    # Resize to 560px width
    width = 560
    height = int(img.height * (width / img.width))
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    images.append(img)

# Save as animated GIF
images[0].save(
    'share-form-demo-captioned-cs.gif',
    save_all=True,
    append_images=images[1:],
    duration=2000,
    loop=0,
    optimize=True
)

print("\n✓ Vytvořen share-form-demo-captioned-cs.gif")
print(f"  Všechny snímky normalizovány na {max_width}x{max_height + caption_height}")
print("  České titulky jsou nyní viditelné na všech snímcích")
