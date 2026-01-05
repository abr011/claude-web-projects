from moviepy import VideoFileClip

print("Converting GIF to MP4...")

# Load the GIF
clip = VideoFileClip("share-form-demo.gif")

# Write to MP4 with settings optimized for YouTube
clip.write_videofile(
    "share-form-demo.mp4",
    fps=25,  # 25 frames per second for smooth playback
    codec='libx264',  # H.264 codec (YouTube standard)
    audio=False,  # No audio
    preset='medium',  # Encoding speed/quality tradeoff
    bitrate='2000k'  # Good quality bitrate
)

clip.close()

print("✓ Created share-form-demo.mp4")
print("  Ready for YouTube upload with subtitles")
