import numpy as np
from PIL import Image
import math
import os

def bake_smudge(input_path, output_path, scale=30, freq=0.01):
    print(f"Loading {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
    except FileNotFoundError:
        print(f"Error: Could not find {input_path}")
        return

    # Convert to numpy array
    arr = np.array(img)
    height, width, channels = arr.shape
    
    # Create coordinate grids
    x = np.arange(width)
    y = np.arange(height)
    X, Y = np.meshgrid(x, y)
    
    # LIQUID DISTORTION LOGIC
    # We use a combination of sine waves to create a "melting/flowing" look
    # Shift X based on Y (Horizontal smear)
    shift_x = np.sin(Y * freq) * scale * 1.5
    # Shift Y based on X (Vertical melt)
    shift_y = np.cos(X * freq * 0.5) * scale * 0.5
    
    # Apply displacement
    X_new = np.clip(X + shift_x, 0, width - 1).astype(int)
    Y_new = np.clip(Y + shift_y, 0, height - 1).astype(int)
    
    # Remap pixels
    new_arr = arr[Y_new, X_new]
    
    # Save result
    result = Image.fromarray(new_arr)
    result.save(output_path)
    print(f"✨ Success! Smudged image saved to {output_path}")

if __name__ == "__main__":
    # Paths are relative to CWD (project root)
    INPUT = os.path.join("public", "All Day.png")
    OUTPUT = os.path.join("public", "All Day Smudged.png")
    
    bake_smudge(INPUT, OUTPUT, scale=50, freq=0.02)
