// JavaScript for audio waveform visualizer
window.onload = function() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const canvas = document.getElementById('waveform');
  const canvasContext = canvas.getContext('2d');

  function drawWaveform(analyser) {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.1)';
    canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'rgb(103, 177, 246)';
    canvasContext.beginPath();

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * HEIGHT/2;

      if(i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height/2);
    canvasContext.stroke();
  }

  // Create an analyser node for each audio element
  const audioElements = document.querySelectorAll('audio');
  const analysers = [];

  audioElements.forEach(audio => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);

    analysers.push(analyser);
  });

  // Start drawing the waveform for each analyser
  function updateWaveform() {
    analysers.forEach(analyser => {
      drawWaveform(analyser);
    });
    requestAnimationFrame(updateWaveform);
  }
  
  updateWaveform();
};



let currentPhotoIndex = 0;
const photos = document.querySelectorAll('.photo');

function showPhoto(index) {
    photos.forEach((photo, idx) => {
        if (idx === index) {
            photo.classList.add('active');
        } else {
            photo.classList.remove('active');
        }
    });
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    showPhoto(currentPhotoIndex);
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    showPhoto(currentPhotoIndex);
}

// Show the first photo initially
showPhoto(currentPhotoIndex);

