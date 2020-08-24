let snarerelease=0.3;
function playSnare(){
  playSound(preloadSound(
    10,
    new Envelope(0.02,0.01,0.3,snarerelease),
    4,noisey2
  ),5,'highpass',2200,4);
}

function playHats(){
  playSound(preloadSound(
    400,
    new Envelope(0.01,0.01,0.1,0.2),
    40,noisey
  ),14,'highpass',1400,12);
}

let wubfactor=560;
function playWobbleBass(freq){
  playSound(preloadSound(
    freq,
    new Envelope(0.05,0.51,0.2,0.51),
    60,constSine2
  ),5,'lowshelf',wubfactor,10); // adjust filter freq value 200-1000 to get nice dub fx
}

function playNoiseySynth(freq){
  //console.log(freq)
  playSound(preloadSound(
    freq,
    new Envelope(0.01,0.11,0.3,1.45),
    50,constSine4
  ),8,'lowpass',1500,8);
  sine4counter++;
  if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}

function playHardHat(){
  playSound(preloadSound(
    8,
    new Envelope(0.01,0.01,0.11,0.13),
    1,constSine3
  ),6,'lowshelf',2240,12);
}
function playKick(fact){
  playSound(preloadSound(
    fact, // compact bassy hits <1500, trappy pitched long hits 6000-20000
    new Envelope(0.01,0.11,0.3,0.35),
    500,constSineB
  ),18,'lowpass',180,12);
}

// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
function playBlaster(factor,vol){
  playSound(preloadSound(
    factor,
    new Envelope(0.01,0.11,0.3,0.25),
    100,constSineB2
  ),vol,'highpass',1080,8);
}

function playSine(factor){
  playSound(preloadSound(
    factor,
    new Envelope(0.01,0.11,0.3,0.35),
    1,constSine
  ),1.0,'notch',280,28);
}

function playDamageFX(){
  playSound(preloadSound(
    20,
    new Envelope(0.01,0.11,0.3,0.31),
    60+Math.floor(Math.random()*20),constSine3
  ),14,'highshelf',1500,2);
}
