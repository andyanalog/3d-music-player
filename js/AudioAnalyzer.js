class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.audio = new Audio();
        this.source = null;
        this.isInitialized = false;
        this.bassDataArray = null;
    }

    async initialize() {
        if (!this.isInitialized) {
            // Create AudioContext only if it hasn't been created yet
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Main analyzer for full spectrum
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Bass analyzer with filter
            this.bassFilter = this.audioContext.createBiquadFilter();
            this.bassFilter.type = 'lowpass';
            this.bassFilter.frequency.value = 150;
            this.bassFilter.Q.value = 1;
            
            this.bassAnalyser = this.audioContext.createAnalyser();
            this.bassAnalyser.fftSize = 512;
            this.bassDataArray = new Uint8Array(this.bassAnalyser.frequencyBinCount);
            
            // Set up audio routing
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.source.connect(this.bassFilter);
            this.bassFilter.connect(this.bassAnalyser);
            this.analyser.connect(this.audioContext.destination);
            this.bassFilter.connect(this.audioContext.destination);
            
            this.isInitialized = true;
        }
        
        // If the context is suspended, resume it
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        // Wait for the current audio to be loaded
        return new Promise(resolve => {
            const handleLoaded = () => {
                this.audio.removeEventListener('loadedmetadata', handleLoaded);
                resolve();
            };
            
            if (this.audio.readyState >= 1) {
                resolve();
            } else {
                this.audio.addEventListener('loadedmetadata', handleLoaded);
            }
        });
    }

    getAudioData() {
        if (!this.analyser || !this.dataArray) return { average: 0, bass: 0 };
        
        this.analyser.getByteFrequencyData(this.dataArray);
        this.bassAnalyser.getByteFrequencyData(this.bassDataArray);
        
        // Get bass average (first ~10 frequency bins for kick drum frequencies)
        const bassAvg = Array.from(this.bassDataArray.slice(0, 10))
            .reduce((acc, val) => acc + val, 0) / 10;
        
        // Get overall average
        const fullAvg = this.dataArray.reduce((acc, val) => acc + val, 0) / this.dataArray.length;
        
        return {
            average: fullAvg,
            bass: bassAvg
        };
    }
}