/* ===========================
   BeatBox - Metronome Application
   =========================== */

class Metronome {
    constructor() {
        // Audio context for precise timing
        this.audioContext = null;
        this.isRunning = false;
        
        // BPM and timing
        this.bpm = 120;
        this.beatDuration = 0;
        this.nextBeatTime = 0;
        this.currentBeat = 1;
        this.beatsPerMeasure = 4; // 4/4 time signature
        
        // Timing parameters
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
        this.lookAhead = 25.0; // How frequently to call scheduling function (ms)
        this.lastScheduledBeat = -1;
        this.schedulingTimer = null;
        
        // DOM elements
        this.bpmDisplay = document.getElementById('bpmDisplay');
        this.bpmDisplayMini = document.getElementById('bpmDisplayMini');
        this.bpmSlider = document.getElementById('bpmSlider');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.increaseBtn = document.getElementById('increaseBtn');
        this.decreaseBtn = document.getElementById('decreaseBtn');
        this.beatIndicator = document.getElementById('beatIndicator');
        this.beatNumber = document.getElementById('beatNumber');
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.initAudioContext();
        this.attachEventListeners();
        this.updateDisplay();
    }

    /**
     * Initialize Web Audio API context
     */
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Attached event listeners to DOM elements
     */
    attachEventListeners() {
        this.startStopBtn.addEventListener('click', () => this.toggleMetronome());
        this.bpmSlider.addEventListener('input', (e) => this.setBPM(parseInt(e.target.value)));
        this.increaseBtn.addEventListener('click', () => this.adjustBPM(5));
        this.decreaseBtn.addEventListener('click', () => this.adjustBPM(-5));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleMetronome();
            }
        });
    }

    /**
     * Toggle metronome on/off
     */
    toggleMetronome() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Start the metronome
     */
    start() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isRunning = true;
        this.currentBeat = 1;
        this.nextBeatTime = this.audioContext.currentTime;
        this.lastScheduledBeat = -1;
        
        // Update UI
        this.startStopBtn.classList.add('playing');
        this.startStopBtn.innerHTML = '<span class="btn-icon">⏹</span><span class="btn-label">Stop</span>';
        this.bpmSlider.disabled = true;
        this.increaseBtn.disabled = true;
        this.decreaseBtn.disabled = true;
        
        // Start the scheduling loop
        this.scheduler();
    }

    /**
     * Stop the metronome
     */
    stop() {
        this.isRunning = false;
        
        // Cancel any scheduled sounds
        if (this.schedulingTimer) {
            clearTimeout(this.schedulingTimer);
            this.schedulingTimer = null;
        }
        
        // Update UI
        this.startStopBtn.classList.remove('playing');
        this.startStopBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-label">Start</span>';
        this.bpmSlider.disabled = false;
        this.increaseBtn.disabled = false;
        this.decreaseBtn.disabled = false;
        this.beatIndicator.classList.remove('active');
        this.currentBeat = 1;
        this.updateBeatDisplay();
    }

    /**
     * Main scheduling loop for accurate timing
     */
    scheduler() {
        // Schedule beats that fall within the lookahead window
        while (this.nextBeatTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNoteOn(this.nextBeatTime, this.currentBeat);
            this.advanceNote();
        }

        // Schedule the next call to scheduler()
        if (this.isRunning) {
            this.schedulingTimer = setTimeout(() => this.scheduler(), this.lookAhead);
        }
    }

    /**
     * Schedule a beat to play at the specified time
     */
    scheduleNoteOn (time, beat) {
        if (beat !== this.lastScheduledBeat) {
            this.lastScheduledBeat = beat;
            
            // Play the beat sound
            this.playBeatSound(time, beat);
            
            // Schedule visual update
            if (time - this.audioContext.currentTime <= this.scheduleAheadTime) {
                const delay = Math.max(0, (time - this.audioContext.currentTime) * 1000);
                setTimeout(() => {
                    if (this.isRunning) {
                        this.updateVisualBeat();
                    }
                }, delay);
            }
        }
    }

    /**
     * Generate and play a metronome beat sound using Web Audio API
     */
    playBeatSound(time, beat) {
        // Create oscillator for the beat sound
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Frequency - higher for first beat, lower for others
        const isFirstBeat = (beat === 1);
        const frequency = isFirstBeat ? 1000 : 800;
        osc.frequency.setValueAtTime(frequency, time);
        
        // Volume - louder for first beat
        const volume = isFirstBeat ? 0.3 : 0.15;
        gain.gain.setValueAtTime(volume, time);
        
        // Envelope - attack, decay
        const duration = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
    }

    /**
     * Advance to the next beat
     */
    advanceNote() {
        this.beatDuration = (60.0 / this.bpm) * 1000 / 1000; // Convert BPM to beat duration in seconds
        this.nextBeatTime += this.beatDuration;
        this.currentBeat++;
        
        if (this.currentBeat > this.beatsPerMeasure) {
            this.currentBeat = 1;
        }
    }

    /**
     * Update visual beat indicator
     */
    updateVisualBeat() {
        this.beatIndicator.classList.remove('active');
        // Trigger reflow to restart animation
        void this.beatIndicator.offsetWidth;
        this.beatIndicator.classList.add('active');
        this.updateBeatDisplay();
    }

    /**
     * Update beat counter display
     */
    updateBeatDisplay() {
        this.beatNumber.textContent = this.currentBeat;
    }

    /**
     * kept BPM to specific value...
     */
    setBPM(value) {
        value = Math.max(20, Math.min(300, value));
        this.bpm = value;
        this.updateDisplay();
    }

    /**
     * Adjust BPM by increment
     */
    adjustBPM(increment) {
        this.setBPM(this.bpm + increment);
    }

    /**
     * Update all displays with current BPM
     */
    updateDisplay() {
        this.bpmDisplay.textContent = this.bpm;
        this.bpmDisplayMini.textContent = this.bpm;
        this.bpmSlider.value = this.bpm;
    }
}

// Initialize the metronome when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Metronome();
});
