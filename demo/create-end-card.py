from PIL import Image, ImageDraw, ImageFont

# Create end card matching the dimensions of other frames
width = 780
height = 575 + 60  # Match captioned frames height
end_card = Image.new('RGB', (width, height), color=(250, 250, 250))  # Off-white

draw = ImageDraw.Draw(end_card)

# Load fonts
try:
    # Main headline - bigger and bolder
    font_main = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48, index=1)  # Bold
    # Subtext - smaller
    font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
except:
    font_main = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# Main text: Shorter version
main_text = "We removed the complexity"
bbox_main = draw.textbbox((0, 0), main_text, font=font_main)
text_width_main = bbox_main[2] - bbox_main[0]
text_height_main = bbox_main[3] - bbox_main[1]

# Position main text slightly above center
x_main = (width - text_width_main) // 2
y_main = (height - text_height_main) // 2 - 40

draw.text((x_main, y_main), main_text, fill=(26, 26, 26), font=font_main)  # Soft black

# Subtext: "You're welcome."
sub_text = "You're welcome."
bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
text_width_sub = bbox_sub[2] - bbox_sub[0]
text_height_sub = bbox_sub[3] - bbox_sub[1]

# Position subtext below main text
x_sub = (width - text_width_sub) // 2
y_sub = y_main + text_height_main + 40

draw.text((x_sub, y_sub), sub_text, fill=(102, 102, 102), font=font_sub)  # Gray

# Save
end_card.save('step-08-end-card.png')
print("✓ Created step-08-end-card.png")
print(f"  Dimensions: {width}x{height}")
print("  Message: We removed the 'rights management' / You're welcome.")
