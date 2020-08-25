
let context;
const twoPI = Math.PI*2;
let sine4counter=0;
let sine4fact=0.2;



function startSound(){

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
 //startBeatMachine();
/*
  // start drums
  setInterval( playHardHat , 300);
  setInterval( playHats ,150);
  setInterval( playSnare ,600);
  setInterval( playKick ,450 );

  // bass tone
  setInterval( playWobbleBass,2400, 50 );
  // noisey pedal tone
  setInterval( playNoiseySynth ,600, 200);
*/
}



function constSineB(i,dividor){
  return constrain(Math.round(Math.sin(i / (dividor+i/100))),0,0.10);
}

function constSineB2(i,dividor){
  return constrain(Math.round(Math.sin(i / (dividor+i/1000))),0,0.10);
}
function noisey(i,dividor){
  return Math.random()*0.02
}

function noisey2(i,dividor){
  return Math.random()*constrain(Math.round(Math.sin(i / (i+dividor))),0,0.130);
}
function constSine(i,dividor){
  return constrain(Math.sin(i / dividor),-0.2,0.2);
}
function constSine2(i,dividor){
  return constrain(0.5*(Math.sin(i / dividor)+Math.sin(i / (20+dividor))),0,0.10);
}


function constSine3(i,dividor){
  return constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (100+dividor))),0,0.10);
}


function constSine4(i,dividor){
  return constrain(Math.random()*sine4fact+0.3*(Math.sin(i / dividor)+0.3*Math.sin(i / (2+dividor))),0,0.10);
}








// preloadsound()
//
// creates a sound buffer array
// freq: frequency, seconds: sample length
// prebuffercycles: how many cycles should actually be generated (then copied to fill the buffer)

function preloadSound(freq,envelope,preBufferCycles,func){

  let result = [];
  let seconds = envelope.a+envelope.d+envelope.r;

  let length = context.sampleRate * seconds;
  let sampleFreq = context.sampleRate / freq;
  let prebufferLength = Math.floor(sampleFreq)*preBufferCycles; // length of prebuffer in samples
  let dividor = (sampleFreq / twoPI);

  // preload a cycle
  let prebuffer = [];

  for(let i=0; i<prebufferLength; i++){
    prebuffer.push( func(i,dividor) );
  }

  // load full sound
  for (let i = 0; i < length; i++) {
    result[i] = 0.4* envelope.level(i) * prebuffer[i%prebufferLength];
  }

  return result;
}

function playSound(arr,vol,filterT,filterF,filterG) {

  let buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = vol*arr[i]
  let buffer = context.createBuffer(1, buf.length, context.sampleRate)
  buffer.copyToChannel(buf, 0)
  let source = context.createBufferSource();
  source.buffer = buffer;
  let filter = context.createBiquadFilter();
  source.connect(filter);

  filter.connect(context.destination);
  source.start(0);

  filter.type = filterT;
  filter.frequency.value=filterF;
  filter.gain.value = filterG;
  //biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
}

class Envelope{

  constructor(a,d,s,r){
    this.a=a;
    this.d=d;
    this.s=s;
    this.r=r;

    this.aS=a*context.sampleRate;
    this.dS=d*context.sampleRate;
    this.rS=r*context.sampleRate;

    this.rT=this.aS+this.dS;
  }
  level(i){
    if(i<this.aS) return i/this.aS;
    else if(i<this.rT) return 1 - (1-this.s) * (i-this.aS)/this.dS;
    else return this.s*( 1 - (i-this.rT)/this.rS );
  }
}


function constrain(input,min,max){
  return Math.min(Math.max(input, min), max);
}
