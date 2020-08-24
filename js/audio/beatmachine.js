let bar = 1800;
let maxbarcount=16;

function startBeatMachine(){

  setInterval(newbar,bar);
}


let beatinput = [
  {vals:'x x 0 x xxx 0 x x x xxx x x',beatval:32,f:playHats},

  {vals:'x  xx',beatval:8,f:playKick,v: 200,p:false},
  {vals:'xoxxx',beatval:5,f:playSnare,p:false},
  {vals:'',beatval:3,f:playBlaster,v:360,p:false},
  {vals:'/  --',beatval:6,f:playWobbleBass,v: 0,p:false},
  {vals:'',beatval:8,f:playHardHat,p:false},
  {vals:'  M   N',beatval:8,f:playNoiseySynth,v:0,p:false},
  {vals:'MNRW  V  W  YZYW',beatval:16,f:playSine,v:0,p:false},
];

let barcount=0;
let section=0;

function noteToFreq(note) {
    let a = 440; //frequency of A (coomon value is 440Hz)
    return (a / 32) * (2 ** ((note - 9) / 12));
}

function newbar(){
/*
  switch(barcount%8){
    case 0: beatinput[6].vals='  A   F'; break;
    case 1: beatinput[6].vals='  J  HF'; break;
    case 2: beatinput[6].vals='     ACD'; break;

    case 4: beatinput[6].vals='DFDCA'; break;
    case 5: beatinput[6].vals='  JGJK'; break;
    case 6: beatinput[6].vals='  J   F'; break;

  }
  */
  let hats = beatinput[0];
  let noiznote = beatinput[6];
  let wub=beatinput[4];
  let kick=beatinput[1];
  let hardhat=beatinput[5];
  let snare=beatinput[2];

  switch(section){
    case 0: hats.p=true; noiznote.p=true; wub.p=true; wubfactor=200; break;
    case 1: noiznote.p=false; kick.p=true; hardhat.p=true; wubfactor=400; break;
    case 2: snare.p=true; snarerelease=0.2; wubfactor=600; break;
    case 3: noiznote.p=true; kick.p=false; wubfactor=200; break;

  }
if(section%2==1){


  if(random()>0.3&&barcount%2==1){
    beatinput[1].vals = 'x  x  x x     x';
    beatinput[1].beatval=16;
  }
  else {
    beatinput[1].vals = 'x  xx';
    beatinput[1].beatval=8;
  }


}

if(section>=0){

//  beatinput[3].vals = ' AF'
  if(barcount%2==0){
    beatinput[2].vals='x xxx'
    beatinput[2].beatval=5;
    beatinput[5].vals='xoooxooo';
  }else{
    beatinput[2].vals='x  x'
    beatinput[2].beatval=8;
    beatinput[5].vals='oxox0x0x';
  }
}




  for(let i=0; i<beatinput.length; i++){
    if(beatinput[i].p){
      for(let j=0; j<beatinput[i].vals.length; j++){
        if(beatinput[i].vals[j]=='x'){
          if(beatinput[i].v!=undefined)
          setTimeout(function(f,v){f(v);},j*bar/beatinput[i].beatval,beatinput[i].f,beatinput[i].v);
          else setTimeout(function(f){f();},j*bar/beatinput[i].beatval,beatinput[i].f)
        }
        else if(beatinput[i].v!=undefined&&beatinput[i].vals[j]!=' ')
        {
          setTimeout(function(f,v){f(v);},j*bar/beatinput[i].beatval,beatinput[i].f,noteToFreq(beatinput[i].vals.charCodeAt(j)-20));
        //  console.log("note")
        }

      }
    }

  }
  barcount++;

  if(barcount==maxbarcount){
    barcount=0;
    section++;
  }
}
