const playlist = [
    './music/Phora ft. Jhené Aiko - Stars In The Sky.mp3',
    './music/Daniel Casesar ft. H.E.R. - Best Part.mp3',
    './music/Bryson Tiller - Find My Way.mp3',
    './music/Kendrick Lamar, SZA - Luther.mp3',
    './music/KAROL G, Camilo - Contigo Voy A Muerte.mp3',
];

const audio = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle.querySelector('.icon') || musicToggle;

let manualPause = false;
let currentSongIndex = 0;
let fadeInterval = null;
let isTransitioning = false;

// Fade settings (in milliseconds)
const FADE_DURATION = 2000; // 2 seconds
const FADE_STEPS = 40;
const FADE_INTERVAL = FADE_DURATION / FADE_STEPS;

// Fade out function
function fadeOut(callback) {
    if (audio.volume === 0) {
        if (callback) callback();
        return;
    }

    const startVolume = audio.volume;
    const volumeStep = startVolume / FADE_STEPS;
    let currentStep = 0;

    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.max(0, startVolume - (volumeStep * currentStep));
        audio.volume = newVolume;

        if (newVolume <= 0 || currentStep >= FADE_STEPS) {
            clearInterval(fadeInterval);
            audio.volume = 0;
            if (callback) callback();
        }
    }, FADE_INTERVAL);
}

function fadeIn(targetVolume = 1.0) {
    audio.volume = 0;
    const volumeStep = targetVolume / FADE_STEPS;
    let currentStep = 0;

    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(targetVolume, volumeStep * currentStep);
        audio.volume = newVolume;

        if (newVolume >= targetVolume || currentStep >= FADE_STEPS) {
            clearInterval(fadeInterval);
            audio.volume = targetVolume;
            isTransitioning = false;
        }
    }, FADE_INTERVAL);
}

// Load song and state
function loadPlaylistState() {
    const savedIndex = sessionStorage.getItem('currentSongIndex');
    const savedTime = sessionStorage.getItem('currentTime');
    const savedPause = sessionStorage.getItem('manualPause');

    if (savedIndex !== null && !isNaN(savedIndex)) currentSongIndex = parseInt(savedIndex, 10);
    manualPause = savedPause === 'true';

    // Set the current song
    audio.src = playlist[currentSongIndex];
    audio.volume = 1.0; // Always start at full volume

    audio.addEventListener('loadedmetadata', () => {
        if (savedTime !== null && !isNaN(savedTime)) {
            audio.currentTime = parseFloat(savedTime);
        }

        // Enforce user preference
        if (manualPause) {
            audio.pause();
            musicIcon.textContent = '🔇';
        } else {
            audio.play().catch(() => {}); // autoplay may fail until interaction
            musicIcon.textContent = '🔊';
        }
    }, { once: true });
}

// Save state on time update and before unload
function savePlaylistState() {
    sessionStorage.setItem('currentSongIndex', currentSongIndex.toString());
    sessionStorage.setItem('currentTime', audio.currentTime.toString());
    sessionStorage.setItem('manualPause', manualPause.toString());
}

audio.addEventListener('timeupdate', savePlaylistState);
window.addEventListener('beforeunload', savePlaylistState);

// Play next song with fade transition
function playNextSong() {
    if (isTransitioning) return;
    isTransitioning = true;

    fadeOut(() => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;

        // Save index immediately
        sessionStorage.setItem('currentSongIndex', currentSongIndex.toString());
        sessionStorage.setItem('currentTime', '0');

        audio.src = playlist[currentSongIndex];
        
        // Wait for the audio to be ready before playing
        audio.load();
        audio.addEventListener('loadeddata', () => {
            audio.currentTime = 0;
            audio.play().then(() => {
                fadeIn(1.0);
            }).catch(() => {
                isTransitioning = false;
            });
        }, { once: true });
    });
}

// Detect when song is about to end to start fade
audio.addEventListener('timeupdate', () => {
    if (!manualPause && audio.duration > 0 && !isTransitioning) {
        const timeRemaining = audio.duration - audio.currentTime;
        // Start fade out 3 seconds before song ends
        if (timeRemaining <= 3 && timeRemaining > 2.9) {
            playNextSong();
        }
    }
});

// Backup
audio.addEventListener('ended', () => {
    if (manualPause || isTransitioning) return;
    
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    sessionStorage.setItem('currentSongIndex', currentSongIndex.toString());
    sessionStorage.setItem('currentTime', '0');

    audio.src = playlist[currentSongIndex];
    audio.load();
    audio.addEventListener('loadeddata', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }, { once: true });
});

// Toggle button functionality
musicToggle.addEventListener('click', () => {
    clearInterval(fadeInterval); // Stop any ongoing fades
    
    if (audio.paused) {
        manualPause = false;
        audio.volume = 1.0; // Instant full volume
        audio.play().then(() => {
            musicIcon.textContent = '🔊';
            savePlaylistState();
        }).catch(() => {});
    } else {
        manualPause = true;
        audio.pause();
        audio.volume = 1.0; // Reset volume
        musicIcon.textContent = '🔇';
        savePlaylistState();
    }
});

// Play audio on first user interaction
function unlockAudioOnFirstInteraction() {
    if (!manualPause && audio.paused) {
        audio.play().then(() => {
            musicIcon.textContent = '🔊';
        }).catch(() => {});
    }
    document.removeEventListener('click', unlockAudioOnFirstInteraction);
    document.removeEventListener('keydown', unlockAudioOnFirstInteraction);
}

document.addEventListener('click', unlockAudioOnFirstInteraction, { once: true });
document.addEventListener('keydown', unlockAudioOnFirstInteraction, { once: true });

// Helpful functions
function pauseAudio() {
    if (!audio.paused) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.volume = 1.0;
    }
}

function resumeAudio() {
    if (!manualPause && audio.paused) {
        audio.volume = 1.0;
        audio.play().catch(() => {});
    }
}

// Start the playlist state on page load
loadPlaylistState();