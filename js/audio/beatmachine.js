let bar = 1800;
let maxbars=16;

let startBeatMachine=()=>
  setInterval(newbar,bar);
let bassnote="0"

let mel2= "HJMOMPOPOJMOP";
let mel1="POMJHHHJMHH";
let mel = mel1;//"HJMOMPOPOJMOP"//"POMJHHHJMHH"
let beatinput = [
  {vals:' x x x x',beatval:8,f:playHats,p:true}, //0
  {vals:'x x',beatval:16,f:playKick,v: 600,p:true},         //1
  {vals:'     x',beatval:8,f:playSnare,p:true},
              //2
//  {vals:'   hfs',beatval:6,f:playBlaster,v:360,p:false},            //3
  {vals:' 5',beatval:8,f:playWobbleBass,v: 2000,p:true},     //3
//  {vals:'',beatval:8,f:playHardHat,p:false},                  //5
  {vals:'  ',beatval:8,f:playNoiseySynth,v:0,p:true},   //4

  {vals:'  M  K  R  P  M  P',beatval:16,f:playSine,v:0,p:true},//5
  {vals:'  P  P  T  R  P  R',beatval:16,f:playSine,v:0,p:true},//6
  {vals:'  R  T  W  T  R  T',beatval:17,f:playSine,v:0,p:true},//7
//  {vals:'  M',beatval:16,f:playSine,v:0,p:false},//7
];

let bars=0;
let section=0;

let noteToFreq=(note)=> (440 / 32) * (2 ** ((note - 9) / 12));
let melCounter=0;
let melCount2=1;

let newbar=()=>{

if(bars%4==0){

  wubfact2=100+randInt(200)
  beatinput[7].beatval=16+randInt(2);
  beatinput[6].beatval=16+randInt(3);
}

if(currentLevel!="home"&&levelData&&!levelData.cleared){
  if(bars%8==0){
    if(mel!=mel1){
      mel=mel1;
      beatinput[3].vals=' 5'

    }
    else{
      mel=mel2;
      beatinput[3].vals=' 0'
    }

    melCount2=1;
    melCounter=0;
  }

  beatinput[4].vals = "   "+mel[melCounter]+" "+mel[melCounter];
  melCounter++;
  if(melCounter>=melCount2){
    melCounter=0;
    melCount2++;
  }
  if(melCount2>=mel.length) melCount2=0;
}
else beatinput[4].vals=""



// trigger notes
for(let i=0; i<beatinput.length; i++){
  if(beatinput[i].p){
    for(let j=0; j<beatinput[i].vals.length; j++){
      if(beatinput[i].vals[j]=='x'){
        if(beatinput[i].v!=undefined)
        setTimeout(function(f,v){
          f(v);
        },j*bar/beatinput[i].beatval
        ,beatinput[i].f,beatinput[i].v);
        else setTimeout(function(f){
          f();
        },j*bar/beatinput[i].beatval
        ,beatinput[i].f);
      }
      else if(beatinput[i].v!=undefined&&beatinput[i].vals[j]!=' ')

      setTimeout(function(f,v){
        f(v);
      },j*bar/beatinput[i].beatval,beatinput[i].f
      ,noteToFreq(beatinput[i].vals.charCodeAt(j)-20)
    );

  }
}
}
bars++;

if(bars==maxbars){
  bars=0;
  section++;
}
}
