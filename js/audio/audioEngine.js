
let aContext;
const twoPI = Math.PI*2;

let samprate;
// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aContext = new AudioContext();
  samprate = aContext.sampleRate;
  //startBeatMachine();
}





// preloadsound()
//
// creates a sound buffer array
// f: frequency, sec: sample length
// cycles: how many cycles should actually be generated (then copied to fill the buffer)

let preloadSound=(f,envelope,cycles,func)=>{

  let result = [];

  let length = samprate * ( envelope.a+envelope.d+envelope.r );
  let freq = samprate / f;
  let preBuffL = flo(freq)*cycles; // length of prebuffer in samples
  let dividor = freq / twoPI;

  // preload a cycle
  let prebuffer = [];

  for(let i=0; i<preBuffL; i++)
    prebuffer.push( func(i,dividor) );

  // load full sound
  for (let i = 0; i < length; i++)
    result[i] = 0.4* envelope.level(i) * prebuffer[i%preBuffL];

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
    this.a=a;
    this.d=d;
    this.s=s;
    this.r=r;

    this.aS=a*samprate;
    this.dS=d*samprate;
    this.rS=r*samprate;

    this.rT=this.aS+this.dS;
  }
  level(i){
    if(i<this.aS) return i/this.aS;
    else if(i<this.rT) return 1 - (1-this.s) * (i-this.aS)/this.dS;
    else return this.s*( 1 - (i-this.rT)/this.rS );
  }
}
