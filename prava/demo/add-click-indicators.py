from PIL import Image, ImageDraw
import os

# Define click indicators for each step
# Format: (step_number, x, y, description)
click_indicators = [
    (1, 300, 167, "Click input field"),  # Input field
    (3, 280, 243, "Click autocomplete item"),  # Autocomplete dropdown item
    (4, 495, 352, "Click person card"),  # Petr Dvořák card
    (6, 457, 218, "Click link"),  # "Upravit individuální oprávnění" link
]

def add_click_indicator(image_path, x, y):
    """Add a semi-transparent red circle click indicator at the specified position"""
    img = Image.open(image_path)

    # Create a transparent overlay
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Draw outer circle (red, semi-transparent)
    radius = 30
    draw.ellipse(
        [x - radius, y - radius, x + radius, y + radius],
        fill=(220, 53, 69, 60),  # Red with transparency
        outline=(220, 53, 69, 180),  # Darker red border
        width=3
    )

    # Draw inner dot (solid red)
    dot_radius = 6
    draw.ellipse(
        [x - dot_radius, y - dot_radius, x + dot_radius, y + dot_radius],
        fill=(220, 53, 69, 255),  # Solid red
    )

    # Composite the overlay onto the original image
    img_rgba = img.convert('RGBA')
    result = Image.alpha_composite(img_rgba, overlay)

    # Save back as RGB
    result_rgb = result.convert('RGB')
    result_rgb.save(image_path)
    print(f"✓ Added click indicator to {os.path.basename(image_path)} at ({x}, {y})")

# Process each screenshot with click indicator
for step, x, y, desc in click_indicators:
    image_path = f'step-{step:02d}.png'
    if os.path.exists(image_path):
        add_click_indicator(image_path, x, y)
        print(f"  → {desc}")
    else:
        print(f"⚠ Skipped {image_path} (not found)")

print("\n✓ Click indicators added to all applicable screenshots")
