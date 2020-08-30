let sine4counter=0;
let sine4fact=0.2;


let constSineB=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/100))),0,0.10);

let constSineB2=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/1000))),0,0.10);

let noisey=(i,dividor)=>
Math.random()*0.02;

let noisey2=(i,dividor)=> Math.
random()*constrain(Math.round(Math.sin(i / (i+dividor))),0,0.130);

let constSine=(i,dividor)=>
constrain(Math.sin(i / dividor),-0.2,0.2);

let constSine2=(i,dividor)=>
constrain(0.5*(Math.sin(i / dividor)+Math.sin(i / (20+dividor))),0,0.10);

let constSine3=(i,dividor)=>
constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (100+dividor))),0,0.10);

let constSine4=(i,dividor)=>
constrain(Math.random()*sine4fact+0.3*(Math.sin(i / dividor)+0.3*Math.sin(i / (2+dividor))),0,0.10);




let snarerelease=0.3;
let playSnare=()=>{
  playSound(preloadSound(
    10,
    new Envelope(0.02,0.01,0.3,snarerelease),
    4,noisey2
  ),5,'highpass',2200,4);
}

let playHats=()=>{
  playSound(preloadSound(
    400,
    new Envelope(0.01,0.01,0.1,0.2),
    40,noisey
  ),14,'highpass',1400,12);
}

let wubfactor=560;
let playWobbleBass=(freq)=>{
  playSound(preloadSound(
    freq,
    new Envelope(0.05,0.51,0.2,0.51),
    60,constSine2
  ),5,'lowshelf',wubfactor,10); // adjust filter freq value 200-1000 to get nice dub fx
}

let playNoiseySynth=(freq)=>{
  //console.log(freq)
  playSound(preloadSound(
    freq,
    new Envelope(0.01,0.11,0.3,1.45),
    50,constSine4
  ),8,'lowpass',1500,8);
  sine4counter++;
  if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}

let playHardHat=()=>{
  playSound(preloadSound(
    8,
    new Envelope(0.01,0.01,0.11,0.13),
    1,constSine3
  ),6,'lowshelf',2240,12);
}
let playKick=(fact)=>{
  playSound(preloadSound(
    fact, // compact bassy hits <1500, trappy pitched long hits 6000-20000
    new Envelope(0.01,0.11,0.3,0.35),
    500,constSineB
  ),18,'lowpass',180,12);
}

// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
let playBlaster=(factor,vol)=>{
  playSound(preloadSound(
    factor,
    new Envelope(0.01,0.11,0.3,0.25),
    100,constSineB2
  ),vol,'highpass',1080,8);
}

let playSine=(factor)=>{
  playSound(preloadSound(
    factor,
    new Envelope(0.01,0.11,0.3,0.35),
    1,constSine
  ),1.0,'notch',280,28);
}

let playDamageFX=()=>{
  playSound(preloadSound(
    20,
    new Envelope(0.01,0.11,0.3,0.31),
    60+Math.floor(Math.random()*20),constSine3
  ),14,'highshelf',1500,2);
}
