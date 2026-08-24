import os
import urllib.request

audio_dir = r"e:\Projects\AlMulhim-Travel\public\audio"
os.makedirs(audio_dir, exist_ok=True)

tracks = {
    "song-turkey.mp3": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "song-azerbaijan.mp3": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "song-russia.mp3": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "song-default.mp3": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

for filename, url in tracks.items():
    dest_path = os.path.join(audio_dir, filename)
    if os.path.exists(dest_path):
        print(f"{filename} already exists, skipping.")
        continue
    
    print(f"Downloading {url} to {dest_path}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("Audio download script finished.")
