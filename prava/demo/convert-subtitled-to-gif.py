from moviepy import VideoFileClip, vfx
from PIL import Image
import os

print("Converting share-form.mp4 (with subtitles) to GIF...")

# Load the MP4 with subtitles
clip = VideoFileClip("share-form.mp4")

# First convert to temporary GIF
temp_gif = "temp-share-form.gif"
clip.write_gif(temp_gif, fps=10)
clip.close()

print("✓ MP4 converted to GIF")
print("  Resizing to 560px width...")

# Now resize using PIL
gif = Image.open(temp_gif)
frames = []

try:
    while True:
        # Resize each frame
        target_width = 560
        target_height = int(gif.height * (target_width / gif.width))
        resized_frame = gif.copy().resize((target_width, target_height), Image.Resampling.LANCZOS)
        frames.append(resized_frame)
        gif.seek(gif.tell() + 1)
except EOFError:
    pass

# Save resized GIF
frames[0].save(
    "share-form.gif",
    save_all=True,
    append_images=frames[1:],
    duration=gif.info.get('duration', 100),
    loop=0,
    optimize=True
)

# Clean up temp file
os.remove(temp_gif)

print("✓ Created share-form.gif")
print(f"  Dimensions: {target_width}x{target_height}")
print("  Ready for webpage with visible subtitles")
