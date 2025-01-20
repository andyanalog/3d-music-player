const songs = [
    {
        title: "PERC - Cold Snap",
        file: "assets/songs/perc-coldsnap.mp3"
    },
    {
        title: "PERC - Milk Snatchers Return",
        file: "assets/songs/perc-milksnatchersreturn.mp3"
    }
];

let currentSongIndex = 0;
let animationFrameId = null;
let isAudioInitialized = false;
let isDragging = false;
let wasPlaying = false;

const canvas = document.getElementById('visualizer');
const audioAnalyzer = new AudioAnalyzer();
const visualizer = new VisualizerSphere(canvas);
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const progressBarContainer = document.querySelector('.progress-bar');

async function init() {
    // Set initial song source but don't initialize audio context yet
    audioAnalyzer.audio.src = songs[currentSongIndex].file;
    updateSongInfo();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Add event listeners
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    progressBarContainer.addEventListener('mousedown', handleSeek);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDragging);
    
    // Audio event listeners
    audioAnalyzer.audio.addEventListener('loadedmetadata', updateProgress);
    audioAnalyzer.audio.addEventListener('timeupdate', updateProgress);
    audioAnalyzer.audio.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        cancelAnimationFrame(animationFrameId);
        playNext();
    });
}

async function handleSeek(e) {
    e.preventDefault();
    
    if (!isAudioInitialized) {
        await audioAnalyzer.initialize();
        isAudioInitialized = true;
    }
    
    isDragging = true;
    wasPlaying = !audioAnalyzer.audio.paused;
    
    if (wasPlaying) {
        audioAnalyzer.audio.pause();
        cancelAnimationFrame(animationFrameId);
    }
    
    updateTimeFromClick(e);
}

function handleDrag(e) {
    if (!isDragging) return;
    updateTimeFromClick(e);
}

function stopDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    if (wasPlaying) {
        audioAnalyzer.audio.play();
        animate();
    }
}

function updateTimeFromClick(e) {
    const rect = progressBarContainer.getBoundingClientRect();
    let clickPosition = (e.clientX - rect.left) / rect.width;
    clickPosition = Math.max(0, Math.min(1, clickPosition));
    
    if (audioAnalyzer.audio.duration) {
        const newTime = clickPosition * audioAnalyzer.audio.duration;
        audioAnalyzer.audio.currentTime = newTime;
        
        // Update progress bar and time display
        progressBar.style.width = `${clickPosition * 100}%`;
        currentTimeDisplay.textContent = formatTime(newTime);
    }
}

function updateSongInfo() {
    const songTitle = document.querySelector('.title');
    songTitle.textContent = songs[currentSongIndex].title;
}

async function togglePlay() {
    try {
        // Initialize audio context on first play
        if (!isAudioInitialized) {
            await audioAnalyzer.initialize();
            isAudioInitialized = true;
        }

        if (audioAnalyzer.audio.paused) {
            await audioAnalyzer.audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            animate();
        } else {
            audioAnalyzer.audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            cancelAnimationFrame(animationFrameId);
        }
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

async function playPrevious() {
    cancelAnimationFrame(animationFrameId);
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    await loadAndPlaySong();
}

async function playNext() {
    cancelAnimationFrame(animationFrameId);
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    await loadAndPlaySong();
}

async function loadAndPlaySong() {
    audioAnalyzer.audio.src = songs[currentSongIndex].file;
    updateSongInfo();
    
    // Wait for audio to be initialized and metadata loaded
    if (!isAudioInitialized) {
        await audioAnalyzer.initialize();
        isAudioInitialized = true;
    } else {
        // Wait for new song metadata to load
        await new Promise(resolve => {
            const handleMetadata = () => {
                audioAnalyzer.audio.removeEventListener('loadedmetadata', handleMetadata);
                resolve();
            };
            audioAnalyzer.audio.addEventListener('loadedmetadata', handleMetadata);
        });
    }
    
    try {
        await audioAnalyzer.audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        animate();
    } catch (error) {
        console.error('Error playing audio:', error);
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function updateProgress() {
    if (!isDragging && audioAnalyzer.audio.duration) {
        const progress = (audioAnalyzer.audio.currentTime / audioAnalyzer.audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audioAnalyzer.audio.currentTime);
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