﻿# 3D Music Player

A responsive web-based music player featuring a 3D visualizer that reacts to audio frequencies. The visualizer creates an interactive sphere that pulses and rotates to the beat of the music, with special emphasis on bass frequencies.

https://github.com/user-attachments/assets/dd13ae56-5c2a-46df-83ab-1f5997b9baa3

## Features

- 3D visualization using Three.js
- Real-time audio frequency analysis
- Responsive design that works on all devices
- Full playback controls (play/pause, next/previous)
- Progress bar with seek functionality
- Bass-reactive animations

## Technologies Used

- HTML5 / CSS3
- JavaScript (ES6+)
- Three.js for 3D graphics
- Web Audio API for sound analysis
- Font Awesome for icons

## Getting Started

### Prerequisites

- A modern web browser that supports WebGL and Web Audio API
- Local development server (due to CORS restrictions when loading audio files)

### Installation

1. Clone the repository
```bash
git clone https://github.com/andyanalog/3d-music-player.git
```

2. Navigate to the project directory
```bash
cd 3d-music-player
```

3. Serve the project using a local development server
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js's http-server
npx http-server
```

4. Open your browser and navigate to `http://localhost:8000` (or whatever port your server is using)

## Project Structure

```
3d-music-player/
├── index.html
├── styles/
│   └── style.css
├── js/
│   ├── main.js
│   ├── AudioAnalyzer.js
│   └── VisualizerSphere.js
└── assets/
    └── songs/
```

## Usage

- Click the play button to start playback
- Use previous/next buttons to change tracks
- Click anywhere on the progress bar to seek within the current track
- Watch the 3D sphere react to the music's frequencies

## Music Credits

All music rights belong to their respective artists. The songs included in this project are for demonstration purposes only and are not for commercial use.

Featured tracks:
- "Cold Snap" by PERC
- "Milk Snatchers Return" by PERC

These tracks are property of their respective owners and all rights are reserved. If you plan to use this player with your own music, please ensure you have the appropriate rights and permissions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Note: The license applies only to the code and implementation of the music player. It does not cover any of the music files included in the project.

## Acknowledgments

- Three.js community for 3D graphics support
- Web Audio API for audio analysis capabilities
- Font Awesome for the icon set

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you find any bugs or have feature requests, please open an issue in the GitHub repository.
