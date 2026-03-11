"""
Write random GPS coordinates within Germany into JPEG image EXIF data.
Iterates over all .jpg/.jpeg files in a given folder.

Usage:
    pip install piexif Pillow
    python write_gps_exif.py ./my_images
"""

import os
import sys
import random
import piexif
from PIL import Image

# Rough bounding box for Germany
GERMANY_LAT_MIN = 47.27
GERMANY_LAT_MAX = 55.06
GERMANY_LON_MIN = 5.87
GERMANY_LON_MAX = 15.04

IMAGE_EXTENSIONS = {".jpg", ".jpeg"}


def random_german_coords() -> tuple[float, float]:
    lat = random.uniform(GERMANY_LAT_MIN, GERMANY_LAT_MAX)
    lon = random.uniform(GERMANY_LON_MIN, GERMANY_LON_MAX)
    return round(lat, 6), round(lon, 6)


def decimal_to_dms(value: float) -> tuple[tuple[int, int], tuple[int, int], tuple[int, int]]:
    """Convert a decimal degree value to degrees/minutes/seconds as rational tuples."""
    value = abs(value)
    degrees = int(value)
    minutes = int((value - degrees) * 60)
    seconds = int(((value - degrees) * 60 - minutes) * 60 * 10000)
    return (degrees, 1), (minutes, 1), (seconds, 10000)


def build_gps_ifd(lat: float, lon: float) -> dict:
    """Build the GPS IFD dictionary that piexif expects."""
    lat_ref = b"N" if lat >= 0 else b"S"
    lon_ref = b"E" if lon >= 0 else b"W"

    return {
        piexif.GPSIFD.GPSLatitudeRef: lat_ref,
        piexif.GPSIFD.GPSLatitude: decimal_to_dms(lat),
        piexif.GPSIFD.GPSLongitudeRef: lon_ref,
        piexif.GPSIFD.GPSLongitude: decimal_to_dms(lon),
    }


def write_gps_to_image(filepath: str, lat: float, lon: float) -> None:
    """Write GPS EXIF data into a JPEG file, preserving existing EXIF where possible."""
    try:
        exif_dict = piexif.load(filepath)
    except Exception:
        # No valid EXIF yet, start fresh
        exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}

    exif_dict["GPS"] = build_gps_ifd(lat, lon)
    exif_bytes = piexif.dump(exif_dict)

    # Re-save with updated EXIF
    img = Image.open(filepath)
    img.save(filepath, exif=exif_bytes)
    img.close()


def process_folder(input_folder: str, output_folder: str) -> None:
    if not os.path.isdir(input_folder):
        print(f"Error: '{input_folder}' is not a valid directory.")
        sys.exit(1)

    os.makedirs(output_folder, exist_ok=True)

    files = [
        f for f in os.listdir(input_folder)
        if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS
    ]

    if not files:
        print(f"No JPEG files found in '{input_folder}'.")
        return

    print(f"Found {len(files)} image(s) in '{input_folder}'.")
    print(f"Output folder: '{output_folder}'\n")

    count = 0
    for filename in sorted(files):
        src = os.path.join(input_folder, filename)
        dst = os.path.join(output_folder, filename)

        # Copy original to output folder first
        img = Image.open(src)
        img.save(dst)
        img.close()

        lat, lon = random_german_coords()
        write_gps_to_image(dst, lat, lon)
        print(f"  {filename}  ->  lat={lat}, lon={lon}")

        count += 1
        if count >= 100: break

    print(f"\nDone. Wrote GPS data to {len(files)} file(s).")


INPUT = "images/500images"
OUTPUT = "images/images_with_exif"

if __name__ == "__main__":

    process_folder(INPUT, OUTPUT)
