const songs = [
    {
        title: "PERC - Full Globin",
        file: "assets/songs/perc-fullglobin.mp3"
    },
    {
        title: "PERC - Cold Snap",
        file: "assets/songs/perc-coldsnap.mp3"
    },
    {
        title: "PERC - Milk Snatchers Return",
        file: "assets/songs/perc-milksnatchersreturn.mp3"
    },
    // Add more songs here
];

let currentSongIndex = 0;
let animationFrameId = null;
const canvas = document.getElementById('visualizer');
const audioAnalyzer = new AudioAnalyzer();
const visualizer = new VisualizerSphere(canvas);
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');

async function init() {
    audioAnalyzer.audio.src = songs[currentSongIndex].file;
    updateSongInfo(); // Add this line
    playPauseBtn.textContent = '▶';
    
    // Initialize audio context on first user interaction
    playPauseBtn.addEventListener('click', async () => {
        await audioAnalyzer.initialize();
        togglePlay();
    });
    
    prevBtn.addEventListener('click', async () => {
        await audioAnalyzer.initialize();
        playPrevious();
    });
    
    nextBtn.addEventListener('click', async () => {
        await audioAnalyzer.initialize();
        playNext();
    });
    
    audioAnalyzer.audio.addEventListener('timeupdate', updateProgress);
    audioAnalyzer.audio.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶';
        cancelAnimationFrame(animationFrameId);
        playNext();
    });
}

function updateSongInfo() {
    const songTitle = document.querySelector('.title');
    songTitle.textContent = songs[currentSongIndex].title;
}

async function togglePlay() {
    if (audioAnalyzer.audio.paused) {
        try {
            await audioAnalyzer.audio.play();
            playPauseBtn.textContent = '⏸';
            animate();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    } else {
        audioAnalyzer.audio.pause();
        playPauseBtn.textContent = '▶';
        cancelAnimationFrame(animationFrameId);
    }
}

function animate() {
    if (!audioAnalyzer.audio.paused) {
        animationFrameId = requestAnimationFrame(animate);
        const audioData = audioAnalyzer.getAverageFrequency();
        visualizer.update(audioData);
    }
}

async function playPrevious() {
    cancelAnimationFrame(animationFrameId);
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongInfo();
    await loadAndPlaySong();
}

async function playNext() {
    cancelAnimationFrame(animationFrameId);
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    await loadAndPlaySong();
}

async function loadAndPlaySong() {
    audioAnalyzer.audio.src = songs[currentSongIndex].file;
    updateSongInfo();
    try {
        await audioAnalyzer.audio.play();
        playPauseBtn.textContent = '⏸';
        animate();
    } catch (error) {
        console.error('Error playing audio:', error);
        playPauseBtn.textContent = '▶';
    }
}

function updateProgress() {
    if (audioAnalyzer.audio.duration) {
        const progress = (audioAnalyzer.audio.currentTime / audioAnalyzer.audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        const currentTime = formatTime(audioAnalyzer.audio.currentTime);
        currentTimeDisplay.textContent = currentTime;
    } else {
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '00:00';
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function animate() {
    if (!audioAnalyzer.audio.paused) {
        animationFrameId = requestAnimationFrame(animate);
        const audioData = audioAnalyzer.getAudioData();
        visualizer.update(audioData);
    }
}

init();