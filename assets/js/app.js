// DOM
const logo = document.getElementById('logo');
const playBtn = document.getElementById('btnPlay');
const pauseBtn = document.getElementById('btnPause');

// P5.js config
let fft, input, inputSource;

// FFT config
const smoothing = 0;
const binCount = 128; // Must be a power of 2 between 16 and 1024 

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

  let level = amplitude.getLevel();
  level = map(level, 0, 1, 1, 3)
  let spectrum = fft.analyze();

  // Center + transform origin
  translate (center, center);

  // Draw logo shape
  for (i = 0; i < lines; i ++){
    beginShape();
      vertex(-vertexWidthBottom, radiusInner/level);
      vertex(vertexWidthBottom, radiusInner/level);
      vertex(vertexWidthTop, radiusOuter*level);
      vertex(-vertexWidthTop, radiusOuter*level);
    endShape();
    rotate(rotation);
  }

}


// DOM Controls
playBtn.addEventListener('click', function(){
  getAudioContext().resume();
  input.loop();
});

pauseBtn.addEventListener('click', function(){
  input.pause();
});
