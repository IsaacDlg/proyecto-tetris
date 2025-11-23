const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Master volume
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.3; // Keep it not too loud
masterGain.connect(audioCtx.destination);

// Oscillator types
const OSC_SINE = 'sine';
const OSC_SQUARE = 'square';
const OSC_SAWTOOTH = 'sawtooth';
const OSC_TRIANGLE = 'triangle';

function playTone(freq, type, duration, startTime = 0) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
}

window.audio = {
    playMove() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            playTone(300, OSC_TRIANGLE, 0.05);
        } catch (e) { console.error(e); }
    },

    playRotate() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            playTone(400, OSC_SINE, 0.05);
        } catch (e) { console.error(e); }
    },

    playDrop() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            playTone(100, OSC_SQUARE, 0.1);
        } catch (e) { console.error(e); }
    },

    playLineClear() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            // Success chime
            playTone(400, OSC_SINE, 0.2, 0);
            playTone(500, OSC_SINE, 0.2, 0.1);
            playTone(600, OSC_SINE, 0.4, 0.2);
        } catch (e) { console.error(e); }
    },

    playLevelUp() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            // Power up sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = OSC_SAWTOOTH;
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) { console.error(e); }
    },

    playGameOver() {
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            // Glitchy crash
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = OSC_SAWTOOTH;
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.5);

            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);

            this.stopMusic();
        } catch (e) { console.error(e); }
    },

    musicOsc: null,
    musicGain: null,
    isPlaying: false,

    startMusic() {
        try {
            if (this.isPlaying) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            this.isPlaying = true;

            // Simple bassline loop
            const tempo = 0.4; // seconds per beat
            let nextNoteTime = audioCtx.currentTime;

            this.musicInterval = setInterval(() => {
                if (!this.isPlaying) return;

                // Bass
                playTone(110, OSC_TRIANGLE, 0.1, 0); // A2
                playTone(110, OSC_TRIANGLE, 0.1, tempo);
                playTone(130, OSC_TRIANGLE, 0.1, tempo * 2); // C3
                playTone(98, OSC_TRIANGLE, 0.1, tempo * 3); // G2

                // High hat-ish
                const noise = audioCtx.createOscillator();
                const noiseGain = audioCtx.createGain();
                noise.type = OSC_SQUARE; // Poor man's noise
                noise.frequency.setValueAtTime(1000, audioCtx.currentTime + tempo * 0.5);
                noiseGain.gain.setValueAtTime(0.05, audioCtx.currentTime + tempo * 0.5);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + tempo * 0.5 + 0.05);
                noise.connect(noiseGain);
                noiseGain.connect(masterGain);
                noise.start(audioCtx.currentTime + tempo * 0.5);
                noise.stop(audioCtx.currentTime + tempo * 0.5 + 0.05);

            }, tempo * 4 * 1000);
        } catch (e) { console.error(e); }
    },

    stopMusic() {
        this.isPlaying = false;
        if (this.musicInterval) clearInterval(this.musicInterval);
    }
};

// Resume audio context on any interaction
document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });


