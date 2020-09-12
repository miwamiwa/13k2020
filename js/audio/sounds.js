let sine4counter=0;
let sine4fact=0.1;


let constSineB=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/100))),0,0.10);

let constSineB2=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/1000))),0,0.10);

let noisey=(i,dividor)=>
Math.random()*0.02;

let noisey2=(i,dividor)=> Math.
random()*constrain(Math.round(Math.sin(i / (i+dividor))),0,0.130);

let constSine=(i,dividor)=>
constrain(Math.sin(i / dividor),-0.8,0.8);

let wubfact2=200;
let constSine2=(i,dividor)=>
constrain(0.5*(Math.sin(i / dividor)+Math.sin(i / (wubfact2+dividor))),0,0.10);

let constSine3=(i,dividor)=>
constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (100+dividor))),0,0.10);

let constSine5=(i,dividor)=>
constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (1000+dividor))),0,0.10);



let constSine4=(i,dividor)=>
constrain(Math.random()*sine4fact+0.3*(Math.sin(i / dividor)+0.3*Math.sin(i / (2+dividor))),0,0.10);




let snarerelease=0.3;

let playSnare=()=>
  play( 10, 0.02,0.01,0.4,snarerelease , 4,noisey2,5,'highpass',1200,4);


let cash2timeout;
let playCash=()=>{

  play(1600, 0.01,0.02,0.3,0.6, 2,constSine2,4,'lowpass',1200,2);
  clearTimeout(cash2timeout);
  cash2timeout=setTimeout(function(){
    play(2400, 0.01,0.02,0.3,0.6, 2,constSine2,4,'lowpass',1800,2);
}, 260);
}

let play=(freq,a,d,s,r,cycles,func,vol,ftype,ffreq,fq,slide)=>{
  playSound(preloadSound(
    freq,
    new Envelope(a,d,s,r),
    cycles,func,slide
  ),vol,ftype,ffreq,fq);
}

let playHats=()=>
  play(40,0.01,0.01,0.5,0.8,40,noisey,14,'highpass',6400,6);


let constSineZ=(i,dividor)=>
constrain(0.1*Math.random()+0.8*(Math.sin(i / (0.2*i+dividor))),0,0.60);


let playHop=(fact)=>
  play(fact,0.01,0.11,0.3,0.31,10,constSine2,8,'highpass',500,2,-0.001);



let playHop2=()=>
  play( 200,0.01,0.11,0.3,0.31,200,constSineZ,9,'highshelf',1500,2);


let wubfactor=250;
let playWobbleBass=(freq)=>
  play(freq,.05,0.51,0.8,1.41, 4,constSine,3.6,'lowpass',wubfactor,10); // adjust filter freq value 200-1000 to get nice dub fx


let playNoiseySynth=(freq)=>{
  //console.log(freq)
  play( freq,0.01,0.11,0.3,1.45, 50,constSine4,8.5,'lowpass',1500,8);
  sine4counter++;
  if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}

let playHardHat=()=>
  play(8,0.01,0.01,0.11,0.13,1,constSine3,6,'lowshelf',2240,12);


 // compact bassy hits <1500, trappy pitched long hits 6000-20000
let playKick=(fact)=>
  play(fact, 0.01,0.11,0.3,0.35, 500,constSineB ,16,'lowpass',180,12);


// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
let playBlaster=(factor,vol)=>
  play( factor, 0.01,0.11,0.3,0.25, 100,constSineB2 ,vol,'highpass',1080,8);


let playSine=(factor)=>{
  if(currentLevel!="home"){
    let t = .35;
    if(levelData&&levelData.cleared) t = 0.8;
    play(
      factor,
      0.01,0.11,0.3,t,
      1,constSine
    ,.7,'highpass',600,1);
  }
}

let playDamageFX=()=>
  play( 20, 0.01,0.11,0.3,0.31, 60+randInt(20),constSine3 ,14,'highshelf',1500,2);



let playThunder=()=>
  play( 15+randInt(85), 0.3,0.61,0.3,2.81, 20+randInt(50),constSine5 ,4,'lowpass',300+randInt(2200),2);
