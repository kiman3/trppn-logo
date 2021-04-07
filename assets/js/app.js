// DOM
const logo = document.getElementById('logo');
const playBtn = document.getElementById('btnPlay');
const micBtn = document.getElementById('btnMic');

// P5.js config
let fft, input, audioFile;
let _isPlaying = false;

// FFT config
const smoothing = 0.3;
const binCount = 32; // FFT.analyze array size. Must be a power of 2 between 16 and 1024 

// Logo parameters
const size = 1000;
const center = size/2;
const radiusOuter = size*0.2;
const radiusInner = size*0.1;
const lines = 18;
const rotation = 360/lines;
const vertexWidthTop = radiusOuter*0.085;
const vertexWidthBottom = vertexWidthTop/2.5;

// Styles
logo.style.maxWidth = size + 'px';
const colorBackground = 0;
const colorFill = [0, 255, 225];

// Input source
audioFile = "assets/audio/snippet.mp3";

// Preload (if audio file)
function preload(){
  audioLoaded = loadSound(audioFile);
  soundFormats('mp3', 'ogg');
}

// Setup p5
function setup(){
  // Canvas init
  let vizCanvas = createCanvas(size, size);
  vizCanvas.parent('logo');
  vizCanvas.id('trppnSpectrum');
  vizCanvas.class('trppnSpectrum');

  // DOM responsivity
  vizCanvasElem = document.getElementById('trppnSpectrum');
  vizCanvasElem.style.width = 'auto';
  vizCanvasElem.style.height = 'auto';
  vizCanvasElem.style.maxWidth = '100%';
  vizCanvasElem.style.maxHeight = '100%';

  // Set styles
  noStroke();
  background(colorBackground);
  fill(colorFill);

  // Rotation mode
  angleMode(DEGREES);

  // Sound setup
  input = audioLoaded;
  mic = new p5.AudioIn();

  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(input);
}

// Draw every frame
function draw(){
  clear();

  let spectrum = fft.analyze();

  // Center + transform origin + flip
  translate (center, center);
  rotate(180);

  // Draw logo shape
  for (i = 0; i < lines; i ++){
    if (i === lines - 1){
      // To smooth out the circle between first and last line
      spectrumLevelCurrent = spectrum[i];
      spectrumLevelFirst = spectrum[0];

      if (spectrumLevelFirst > spectrumLevelCurrent){
        spectrumLevel = map(spectrum[0], 0, 255, 1, 1.15);
      } else{
        spectrumLevel = map(spectrum[i], 0, 255, 1, 1.3);
      }
    } else{
      spectrumLevel = map(spectrum[i], 0, 255, 1, 1.3);
    }

    beginShape();
      vertex(-vertexWidthBottom, radiusInner/1);
      vertex(vertexWidthBottom, radiusInner/1);
      vertex(vertexWidthTop, radiusOuter*spectrumLevel);
      vertex(-vertexWidthTop, radiusOuter*spectrumLevel);
    endShape();

    rotate(rotation);
  }

}

function audioAllow(){
  getAudioContext().resume();
}

// DOM Controls
playBtn.addEventListener('click', function(){
  audioAllow();
  input.stop();
  input = audioLoaded;

  if (!_isPlaying){
    input.play();
    _isPlaying = true;
    this.innerHTML = 'Pause';
  } else{
    input.pause();
    _isPlaying = false;
    this.innerHTML = 'Play';
  }
});

micBtn.addEventListener('click', function(){
  audioAllow();
  _isPlaying = false;
  input.stop();
  playBtn.innerHTML = 'Play';
  input = mic;
  input.start();
  fft.setInput(input);
});
