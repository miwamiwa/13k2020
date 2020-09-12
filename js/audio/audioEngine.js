// see: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer

const twoPi=Math.PI*2;
let aContext;
let samprate;
let soundStarted=false;

// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aContext = new AudioContext();
  samprate = aContext.sampleRate;
  soundStarted=true;
  startBeatMachine();
}


// preloadsound()
//
// creates a sound buffer array
// f: frequency,
// cycles: how many cycles to prebuffer
// envelope: envelope to apply, func: sound generating function
// sliding: optional, factor by which to slide the note

let preloadSound=(f,envelope,cycles,func,sliding)=>{

  let result = [];
  let prebuffer = [];
  let length = samprate * ( envelope.a+envelope.d+envelope.r );
  let period = samprate / f;
  let preBuffL = flo(period)*cycles; // length of prebuffer in samples
  let dividor = period / twoPi;

  // if this isn't a sliding sound:

  if(sliding==undefined){
    // prebuffer a given number of cycles
    for(let i=0; i<preBuffL; i++)
      prebuffer.push( func(i,dividor) );

    // then repeat those over the full length of the note
    for (let i = 0; i < length; i++)
      result[i] = 0.4* envelope.level(i) * prebuffer[i%preBuffL];
  }

  // if this is a sliding sound:

  // buffer the entire note
  else{
    for (let i = 0; i < length; i++)
      result[i] = 0.4* envelope.level(i) * func(i,dividor+i*sliding);
  }


  return result;
}

let playSound=(arr,vol,filterT,filterF,filterG)=>{

  let buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = vol*arr[i]
  let buffer = aContext.createBuffer(1, buf.length, samprate)
  buffer.copyToChannel(buf, 0)
  let source = aContext.createBufferSource();
  source.buffer = buffer;
  let filter = aContext.createBiquadFilter();
  source.connect(filter);

  filter.connect(aContext.destination);
  source.start(0);

  filter.type = filterT;
  filter.frequency.value=filterF;
  filter.gain.value = filterG;
}

class Envelope{

  constructor(a,d,s,r){
    // i feel like these 3 are useless but somehow audio breaks if i delete them ..?
    this.a=a;
    this.d=d;
    this.r=r;

    this.s=s;
    this.aS=a*samprate; // attack length in samples
    this.dS=d*samprate; // decay length in samples
    this.rS=r*samprate; // release length in samples
    this.rT=this.aS+this.dS; // release time is attack + decay
  }
  // return envelope level at given time point
  level(i){
    // if during attack
    if(i<this.aS) return i/this.aS;
    // if during decay
    else if(i<this.rT) return 1 - (1-this.s) * (i-this.aS)/this.dS;
    // if during release
    else return this.s*( 1 - (i-this.rT)/this.rS );
  }
}
