from PIL import Image, ImageFilter
import os

def bake_blur(input_path, output_path, radius=25):
    print(f"Loading {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
    except FileNotFoundError:
        print(f"Error: Could not find {input_path}")
        return

    # Apply Gaussian Blur
    # Radius 25 is strong enough to look like "frosted glass" or deep DoF
    print(f"Applying Gaussian Blur (Radius: {radius}px)...")
    blurred = img.filter(ImageFilter.GaussianBlur(radius))
    
    # Save result
    blurred.save(output_path)
    print(f"✨ Success! Blurred image saved to {output_path}")

if __name__ == "__main__":
    # Paths are relative to CWD (project root)
    INPUT = os.path.join("public", "All Day.png")
    OUTPUT = os.path.join("public", "All Day Blurred.png")
    
    bake_blur(INPUT, OUTPUT, radius=60)
