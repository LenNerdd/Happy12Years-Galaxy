let videoStream = null;
let audioStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let countdownInterval = null;
let isRecording = false;

const videoPreview = document.getElementById('videoPreview');
const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const countdownDisplay = document.getElementById('countdownDisplay');
const instructionText = document.getElementById('instructionText');
const controls = document.getElementById('controls');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

async function startCamera() {
    try {
        // Video stream
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false
        });

        // Audio stream (permission only)
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        // Set preview
        videoPreview.srcObject = videoStream;
        videoPreview.muted = true;
        videoPreview.style.transform = 'none'; // normal UI

        // Show capture button
        startCameraBtn.style.display = 'none';
        captureBtn.style.display = 'inline-block';
        captureBtn.disabled = false;

        instructionText.textContent = "Step 2: Click 'Capture' when ready!";

    } catch (err) {
        console.error(err);
        alert("Camera and microphone permissions are required.");
    }
}

function capturePhoto() {
    captureBtn.disabled = true;
    instructionText.textContent = "Get ready! Capturing in...";

    let countdown = 3;
    countdownDisplay.textContent = countdown;

    countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = '';
            controls.classList.add('fade-out');
            instructionText.style.opacity = '0';

            setTimeout(startRecording, 500);
        }
    }, 1000);
}

function drawMirroredVideo() {
    canvas.width = videoPreview.videoWidth;
    canvas.height = videoPreview.videoHeight;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoPreview, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    requestAnimationFrame(drawMirroredVideo);
}

function startRecording() {
    recordedChunks = [];

    // Start drawing mirrored video
    drawMirroredVideo();

    // Record canvas + audio
    const canvasStream = canvas.captureStream(30); // 30 FPS
    const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
    });

    mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        combinedStream.getTracks().forEach(t => t.stop());

        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Play recorded video
        videoPreview.srcObject = null;
        videoPreview.src = url;
        videoPreview.controls = true;
        videoPreview.muted = false;
        videoPreview.style.transform = 'none'; // normal playback

        controls.classList.remove('fade-out');
        captureBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';
        downloadBtn.disabled = false;

        instructionText.style.opacity = '1';
        instructionText.textContent = "The moment is captured";
    };

    mediaRecorder.start();
    isRecording = true;
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        isRecording = false;
    }
}

function resetCamera() {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    videoStream?.getTracks().forEach(t => t.stop());
    audioStream?.getTracks().forEach(t => t.stop());

    recordedChunks = [];
    videoPreview.src = '';
    videoPreview.srcObject = null;
    videoPreview.controls = false;
    videoPreview.muted = true;
    videoPreview.style.transform = 'none';

    countdownDisplay.textContent = '';
    instructionText.style.opacity = '1';
    instructionText.textContent = "Step 1: Click 'Start Camera'";

    startCameraBtn.style.display = 'inline-block';
    captureBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    downloadBtn.style.display = 'none';

    controls.classList.remove('fade-out');
}

function downloadVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ForeverYou2025.webm';
    a.click();

    URL.revokeObjectURL(url);

    instructionText.textContent = "Video saved successfully!";
}

videoPreview.addEventListener('click', () => {
    if (isRecording) stopRecording();
});

document.addEventListener('keydown', e => {
    if (e.code === 'Space' && isRecording) {
        e.preventDefault();
        stopRecording();
    }
});

window.addEventListener('beforeunload', () => {
    videoStream?.getTracks().forEach(t => t.stop());
    audioStream?.getTracks().forEach(t => t.stop());
    if (countdownInterval) clearInterval(countdownInterval);
});
