from PIL import Image, ImageFilter
import os

def validate_path(path):
    """
    Validates that the path is within the project root directory.
    """
    # Determine project root relative to this script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.realpath(os.path.join(script_dir, '..'))

    # Resolve the absolute path of the input
    resolved_path = os.path.realpath(path)

    # Check if the resolved path starts with the project root
    # Use os.path.commonpath to safely check directory containment
    if os.path.commonpath([project_root, resolved_path]) != project_root:
        raise ValueError(f"Security Error: Path '{path}' traverses outside the allowed directory '{project_root}'")

    return resolved_path

def bake_blur(input_path, output_path, radius=25):
    # Validate paths
    try:
        input_path = validate_path(input_path)
        output_path = validate_path(output_path)
    except ValueError as e:
        print(f"Error: {e}")
        return

    print(f"Loading {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
    except FileNotFoundError:
        print(f"Error: Could not find {input_path}")
        return
    except Exception as e:
        print(f"Error: Could not open {input_path}: {e}")
        return

    # Apply Gaussian Blur
    # Radius 25 is strong enough to look like "frosted glass" or deep DoF
    print(f"Applying Gaussian Blur (Radius: {radius}px)...")
    blurred = img.filter(ImageFilter.GaussianBlur(radius))
    
    # Save result
    try:
        blurred.save(output_path)
        print(f"✨ Success! Blurred image saved to {output_path}")
    except Exception as e:
        print(f"Error: Could not save to {output_path}: {e}")

if __name__ == "__main__":
    # Paths are relative to CWD (project root)
    INPUT = os.path.join("public", "All Day.png")
    OUTPUT = os.path.join("public", "All Day Blurred.png")
    
    bake_blur(INPUT, OUTPUT, radius=60)
