// DOM
const logo = document.getElementById('logo');
const playBtn = document.getElementById('btnPlay');

// P5.js config
let fft, input, inputSource;
let _isPlaying = false;

// FFT config
const smoothing = 0.25;
const binCount = 128; // FFT.analyze array size. Must be a power of 2 between 16 and 1024 

// Logo parameters
const size = 1000;
const center = size/2;
const radiusOuter = size*0.2;
const radiusInner = size*0.125;
const lines = 90;
const rotation = 360/lines;
const vertexWidthTop = radiusOuter*0.02;
const vertexWidthBottom = vertexWidthTop/2;

// Styles
logo.style.maxWidth = size + 'px';
const colorBackground = 0;
const colorFill = [0, 255, 225];

// Input source
inputSource = "assets/audio/snippet.mp3";

// Preload (if audio file)
function preload(){
  input = loadSound(inputSource);
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
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(input);
  amplitude = new p5.Amplitude();
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
    spectrumLevel = map(spectrum[i], 0, 255, 1, 1.5);

    beginShape();
      vertex(-vertexWidthBottom, radiusInner/spectrumLevel);
      vertex(vertexWidthBottom, radiusInner/spectrumLevel);
      vertex(vertexWidthTop, radiusOuter*spectrumLevel);
      vertex(-vertexWidthTop, radiusOuter*spectrumLevel);
    endShape();

    rotate(rotation);
  }

}


// DOM Controls
playBtn.addEventListener('click', function(){
  if (!_isPlaying){
    getAudioContext().resume();
    input.loop();
    _isPlaying = true;
    this.innerHTML = 'Pause';
  } else{
    input.pause();
    _isPlaying = false;
    this.innerHTML = 'Play';
  }
});
