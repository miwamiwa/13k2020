let bar = 1800;
let maxbarcount=16;

function startBeatMachine(){

  setInterval(newbar,bar);
}


let beatinput = [
  {vals:'xox xoxx',beatval:8,f:playHardHat},
  {vals:'xx',beatval:2,f:playKick},
  {vals:'xoxxx',beatval:5,f:playSnare},
  {vals:'xx',beatval:3,f:playBlaster,v:360},
  {vals:'oox',beatval:3,f:playWobbleBass,v:40},
  {vals:' x x',beatval:4,f:playNoiseySynth,v:360}
];

let barcount=0;
function newbar(){

  if(random()>0.3&&barcount%2==1){
    beatinput[1].vals = 'x00x00x0x';
    beatinput[1].beatval=16;
  }
  else {
    beatinput[1].vals = 'xx';
    beatinput[1].beatval=2;
  }


  switch(barcount){
    case 0: beatinput[4].v=40; beatinput[0].vals='xox xoxx'; break;
    case 4: beatinput[4].v=60; break;
    case 8: beatinput[4].v=40; beatinput[0].vals='x xxooxx'; break;
    case 12: beatinput[4].v=60; break;
  }

  for(let i=0; i<beatinput.length; i++){
    for(let j=0; j<beatinput[i].vals.length; j++){
      if(beatinput[i].vals[j]=='x'){
        if(beatinput[i].v!=undefined)
        setTimeout(function(f,v){f(v);},j*bar/beatinput[i].beatval,beatinput[i].f,beatinput[i].v);
        else setTimeout(function(f){f();},j*bar/beatinput[i].beatval,beatinput[i].f)
      }

    }
  }
  barcount++;
  if(barcount==maxbarcount)barcount=0;
}
