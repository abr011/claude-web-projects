#!/usr/bin/env python3
from PIL import Image, ImageDraw

# Open the base screenshot (without modal) - this is our cropped main page
base = Image.open('step-07-base.png')

# Open the full viewport screenshot (with modal)
modal_full = Image.open('step-07-modal-full.png')

# Get dimensions
base_width, base_height = base.size
modal_width, modal_height = modal_full.size

print(f'Base (cropped page): {base_width}x{base_height}')
print(f'Modal full viewport: {modal_width}x{modal_height}')

# Create a new image starting with the base
result = base.copy()

# Add semi-transparent dark overlay to simulate modal background
overlay = Image.new('RGBA', (base_width, base_height), (0, 0, 0, 102))  # ~40% opacity
result_rgba = result.convert('RGBA')
result_rgba = Image.alpha_composite(result_rgba, overlay)

# Now we need to extract the modal from modal_full and center it on base
# The modal in the full screenshot is centered at (600, 700) roughly
# We need to find where it would be in our cropped base

# For now, let's crop the modal area from modal_full centered at viewport
# Modal is roughly 500x400 px, centered in 1200x1400 viewport
modal_center_x = modal_width // 2
modal_center_y = modal_height // 2

# Estimate modal size (we can adjust these)
modal_w = 520
modal_h = 450

# Crop modal from full viewport
modal_left = modal_center_x - modal_w // 2
modal_top = modal_center_y - modal_h // 2
modal_right = modal_left + modal_w
modal_bottom = modal_top + modal_h

modal_only = modal_full.crop((modal_left, modal_top, modal_right, modal_bottom))

# Now center this modal on our base image
base_center_x = base_width // 2
base_center_y = base_height // 2

paste_x = base_center_x - modal_w // 2
paste_y = base_center_y - modal_h // 2

# Paste modal on top
result_rgba.paste(modal_only, (paste_x, paste_y))

# Convert back to RGB
result_final = result_rgba.convert('RGB')

# Crop to match other screenshots (780x575 like step 6)
target_width = 780
target_height = 575

# If current result is larger, crop from center
if result_final.size[0] > target_width or result_final.size[1] > target_height:
    left = (result_final.size[0] - target_width) // 2
    top = (result_final.size[1] - target_height) // 2
    right = left + target_width
    bottom = top + target_height
    result_final = result_final.crop((left, top, right, bottom))
    print(f'  Cropped to: {target_width}x{target_height}')

result_final.save('step-07.png')

print(f'✓ Created step-07.png (centered modal composite)')
print(f'  Modal extracted: {modal_w}x{modal_h}')
print(f'  Centered at: ({paste_x}, {paste_y})')
print(f'  Final size: {result_final.size[0]}x{result_final.size[1]}')
