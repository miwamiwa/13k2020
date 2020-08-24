let bar = 1800;
let maxbarcount=16;

function startBeatMachine(){

  setInterval(newbar,bar);
}


let beatinput = [
  {vals:'x x 0 x xxx 0 x x x xxx x x',beatval:32,f:playHats},

  {vals:'',beatval:2,f:playKick},
  {vals:'xoxxx',beatval:5,f:playSnare},
  {vals:'',beatval:3,f:playBlaster,v:360},
  {vals:'x',beatval:6,f:playWobbleBass,v:20},
  {vals:'',beatval:8,f:playHardHat},
  {vals:'  A   F',beatval:8,f:playNoiseySynth,v:0}
];

let barcount=0;
let section=0;

function noteToFreq(note) {
    let a = 440; //frequency of A (coomon value is 440Hz)
    return (a / 32) * (2 ** ((note - 9) / 12));
}

function newbar(){

  switch(barcount%8){
    case 0: beatinput[6].vals='  A   F'; break;
    case 1: beatinput[6].vals='  J  HF'; break;
    case 2: beatinput[6].vals='     ACD'; break;

    case 4: beatinput[6].vals='DFDCA'; break;
    case 5: beatinput[6].vals='  JGJK'; break;
    case 6: beatinput[6].vals='  J   F'; break;

  }
if(section%2==1){


  if(random()>0.3&&barcount%2==1){
    beatinput[1].vals = 'x00x00x0x00000x';
    beatinput[1].beatval=16;
  }
  else {
    beatinput[1].vals = 'x  xx';
    beatinput[1].beatval=8;
  }


}

if(section>0){

//  beatinput[3].vals = ' AF'
  if(barcount%2==0){
    beatinput[2].beatval=6;
    beatinput[5].vals='xoooxooo';
  }else{
    beatinput[2].beatval=5;
    beatinput[5].vals='oxox0x0x';
  }
}




  for(let i=0; i<beatinput.length; i++){
    for(let j=0; j<beatinput[i].vals.length; j++){
      if(beatinput[i].vals[j]=='x'){
        if(beatinput[i].v!=undefined)
        setTimeout(function(f,v){f(v);},j*bar/beatinput[i].beatval,beatinput[i].f,beatinput[i].v);
        else setTimeout(function(f){f();},j*bar/beatinput[i].beatval,beatinput[i].f)
      }
      else if(beatinput[i].v!=undefined&&beatinput[i].vals[j]!=' ')
      {
        setTimeout(function(f,v){f(v);},j*bar/beatinput[i].beatval,beatinput[i].f,noteToFreq(beatinput[i].vals.charCodeAt(j)));
        console.log("note")
      }

    }
  }
  barcount++;

  if(barcount==maxbarcount){
    barcount=0;
    section++;
  }
}
