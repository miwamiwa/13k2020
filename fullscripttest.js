
let context;
const twoPI = Math.PI*2;
let sine4counter=0;
let sine4fact=0.2;



function startSound(){

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
//  startBeatMachine();
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
  return Math.random()*0.02+constrain(Math.round(Math.sin(i / dividor)),0,0.130);
}
function constSine(i,dividor){
  return constrain(Math.round(Math.sin(i / dividor)),0,0.10);
}
function constSine2(i,dividor){
  return constrain(0.3*(Math.sin(i / dividor)+Math.sin(i / (10+dividor))),0,0.10);
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

function playSnare(){
  playSound(preloadSound(
    40,
    new Envelope(0.03,0.01,0.3,0.11),
    1,noisey2
  ),20,'highpass',1200,4);
}

function playHats(){
  playSound(preloadSound(
    400,
    new Envelope(0.05,0.01,0.5,0.01),
    1,noisey
  ),3,'highpass',2400,4);
}

function playWobbleBass(freq){
  playSound(preloadSound(
    freq,
    new Envelope(0.01,0.11,0.3,1.81),
    60,constSine2
  ),12,'highshelf',60,8);
}

function playNoiseySynth(freq){
  //console.log(freq)
  playSound(preloadSound(
    freq,
    new Envelope(0.01,0.11,0.3,1.45),
    50,constSine4
  ),9,'lowpass',1500,8);
  sine4counter++;
  if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}

function playHardHat(){
  playSound(preloadSound(
    8,
    new Envelope(0.01,0.01,0.11,0.13),
    1,constSine3
  ),8,'lowshelf',840,8);
}
function playKick(){
  playSound(preloadSound(
    160, // compact bassy hits <1500, trappy pitched long hits 6000-20000
    new Envelope(0.01,0.11,0.3,0.45),
    500,constSineB
  ),28,'lowpass',180,12);
}

// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
function playBlaster(factor){
  playSound(preloadSound(
    factor,
    new Envelope(0.01,0.11,0.3,0.35),
    100,constSineB2
  ),8,'highpass',1080,8);
}

function playDamageFX(){
  playSound(preloadSound(
    20,
    new Envelope(0.01,0.11,0.3,0.31),
    60+Math.floor(Math.random()*20),constSine3
  ),14,'highshelf',1500,2);
}
let canvas = {};
let ctx;
let camera = {};

// setupcamera()
//
// setup canvas since that is the "camera"
// initialize camera target position

function setupCamera(){

  camera.target = {x:player.x,y:player.y};
  camera.w = canvas.w2;
  camera.h = canvas.h2;
  camera.speed = 24;
}

function cameraFollow(x,y){

  y-=50;
  if(camera.target.x+camera.speed<x) camera.target.x+=camera.speed;
  else if(camera.target.x-camera.speed>x) camera.target.x-=camera.speed;
  else camera.target.x=x;

  if(camera.target.y+camera.speed<y) camera.target.y+=camera.speed;
  else if(camera.target.y-camera.speed>y) camera.target.y-=camera.speed;
  else camera.target.y=y;

  camera.left = camera.target.x-camera.w;
  camera.right = camera.target.x+camera.w;
  camera.top = camera.target.y-camera.h;
  camera.bottom = camera.target.y+camera.h;
}
let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;

function updateEnemies(){
  for(let i=enemies.length-1; i>=0; i--){
    enemies[i].update();
    if(enemies[i].hitPoints<=0){
      // ENEMY KILLED
      generateLoot(enemies[i]);
      enemies.splice(i,1);

    }
  }
//cantGoDown=false;
  if(enemies.length==0&&!firstEnemyKilled){
    firstEnemyKilled = true;
    cantGoDown = false;
    level1.platforms[level1.platforms.length-1].fill = platformFill;
    let index=saveData.seedIndex.indexOf(currentLevel);
    favoritesStatus[index] = "Unlocked. Difficulty: "+level1.enemyDifficulty;
  }
  if(firstEnemyKilled&&currentLevel!='home'&&!level1.cleared){

    if(enemies.length<maxEnemies){
      enemyUpdateCounter++;

      if(enemyUpdateCounter%100==0){
        let pick=Math.floor(Math.random()*level1.platforms.length);
        let plat = level1.platforms[pick];
        enemies.push(new Enemy(plat.x,plat.y-80,pick));
      }
    }
  }
}

class Enemy extends MovingObject {

  constructor(x,y,p){
    let fill = '#cc30';
    let size = 40;

    super(x,y,size,fill);
    this.currentPlatform=p;
    this.newTarget();
    this.targetReachDistance=10;
    this.targetCounter=0;
    this.roaming = true;
    this.goalReachedAction='none';
    this.jumpy=true;
    this.roamPauseLength=1600;
    this.attackCounter=0;
    this.nextAttack=0;
    this.attackInterval=25;
    this.facing;
    this.attackPower = 20;
    this.dashInterval = 60;
    this.nextDash=0;
    this.dashCount=15;
    this.facing='left';
    this.lastRoamingState=false;
    this.attackAnimOverTimeout;
    this.model = new CoolPath(0,0,
      ":=:=Febqfmnnqlsht`y^o`i*;<:HGsgn_j`a`cmkj*<<:JBW@v]j^ld*=<:JBW@vmnklg*>::JFGI^^^_`_*?=:TPwororsrxwvws*@=:OUrrwtvw*@<:STzxzzvyozrzrx*A=:OProwowsvwrxrs*B=:STwtrrrx*B<:STzxzzvyozrzrx*<<:NAPDRATCV@*;;:H@mhfifefbiakc*;=:ECfgfchcjbkghf",
      "CK1iiagtbctdEB0I@0IC0FF0lc_lf`he^QN0tucQR0QN0tueQR0",
      "*still*Z]]]]Y]]]]*****\\I*XI*YIaQ***walk*F]]]]`Qh]]*****\\@*c@*W@*N@**attack*Fa]]]]RdXa*c<e>**S<]>*`<]>*W<^>*N<S>*d<_>*X<d>*o<j>*dash*R`]]]]PeQs*`F*^L*TL\\N*jL\\N*c@\\FWL^N*a@PF^L*k@fF*S@QFOL*c@sF^L",
      ["rgba(142,203,0,0.0)","rgba(255,232,200,1.0)","rgba(177,91,0,1.0)","rgba(247,141,0,1.0)"]);
  }

  update(){

    //attack
    this.attackCounter++;
    let d = distance(player.x,player.y,this.x,this.y);

      if(this.nextAttack<this.attackCounter){

        if(d.d<30){
        let hit = false;
        if(this.facing=="right"&&player.x>this.x) hit=true;
        else if(this.facing=="left"&&player.x<this.x) hit = true;

        if(hit){
          //console.log("player hit!");
          player.hitPoints -= this.attackPower;

        }

        this.animate(2);
        this.nextAttack = this.attackCounter+this.attackInterval;
        this.attackAnimOverTimeout=setTimeout(function(enemy){if(enemy.roaming)enemy.animate(1); else enemy.animate(0);},400,this);
      }
    }



    // health regen
    if(this.hitPoints<100) this.hitPoints+= 0.2;
    this.display();

    // moving left-right
    if(this.roaming){


      // dash
      if(player.currentPlatform==this.currentPlatform&&this.nextDash<this.attackCounter&&d.d<120){
      //  console.log("dash!")
        this.nextDash = this.attackCounter+this.dashInterval;
        this.target = player.x - 30 + Math.random()*60;
        this.dashCount=0;
        clearTimeout(this.attackAnimOverTimeout);
        this.animate(3);
      }
      else if(!this.lastRoamingState) this.animate(1);

      if(this.dashCount<15){
        this.dashCount++;
        if(this.dashCount==15) this.animate(1);
        this.lrMaxSpeed=5;
      }
      else this.lrMaxSpeed=2;

      if(this.x+this.targetReachDistance<this.target){
        this.movingRight = true;
        this.movingLeft = false;
        this.facing="right";
      }
      else if(this.x-this.targetReachDistance>this.target){
        this.movingRight = false;
        this.movingLeft = true;
        this.facing="left";
      }
      else {
        this.roaming = false;
        this.movingRight = false;
        this.movingLeft = false;
        //console.log("new target",this.target,this.targetCounter)
        if(this.targetCounter%3==0){
        if(this.goalReachedAction=='up'){
          this.jump();
          console.log("going up")
        }
        else if(this.goalReachedAction=='down'){
          this.y+=4;
          console.log("going down ")
        }
      }
      this.animate(0);
        setTimeout(function(target){
          target.roaming = true;
          target.newTarget();
          //target.goalReachedAction='none';
        },this.roamPauseLength, this)
      }
    }


    if(this.screenPos!=false){
      this.model.x=this.screenPos.x+20;
      this.model.y=this.screenPos.y+20;
      this.model.update(ctx,(this.facing=='left'));
    }


    this.lastRoamingState = this.roaming;
  }

  animate(index){
    clearTimeout(this.attackAnimOverTimeout);
    this.model.selectAnimation(index);
  }

  newTarget(){

    this.targetCounter++;
    //console.log("new target")
    let p = level1.platforms[this.currentPlatform];
    this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;

    if(this.targetCounter%3==0&&this.jumpy){
      let possibleTargets = [];
      if( this.currentPlatform>0 ){
        possibleTargets.push(this.currentPlatform-1);
      }
      if( this.currentPlatform+1 < level1.platforms.length ){
        possibleTargets.push(this.currentPlatform+1);
      }
      let pick = possibleTargets[Math.floor(Math.random()*possibleTargets.length)];
      p = level1.platforms[pick];
      this.target = p.x;

      if(pick>this.currentPlatform) this.goalReachedAction='up';
      else this.goalReachedAction='down';

    //  console.log("platchange coming ",this.currentPlatform,pick,p.x)
      this.currentPlatform = pick;
    }

  }


}
let aboutguy;
let computer;

function createFriendlyNPCs(){

  let pos = level1.platforms[level1.platforms.length-1];
  aboutguy=new MovingObject(pos.x+150,pos.y-30,20,'#22af');
  computer=new MovingObject(pos.x-150,pos.y-30,20,'#447f');

}


function runFriendlyNPCs(){

  aboutguy.display();
  enableInteraction(aboutguy,"press E",50);

  computer.display();
  enableInteraction(computer,"press E, 1 or 2",50);

}


function enableInteraction(npc, text, range){

  if(npc.screenPos!=false){
    let d = distance(player.x,player.y,npc.x,npc.y);
    if(d.d<range){

      npc.interactible = true;
      ctx.fillStyle='black';
      ctx.font = "10px Georgia";
      let p = npc.screenPos;
      ctx.fillText(text,p.x,p.y-20);
    }
    else npc.interactible = false;

  }
  else npc.interactible = false;
}
let player;

function createPlayer(){

  let pos = level1.platforms[level1.platforms.length-1];
  if(currentLevel=='home') pos=level1.platforms[0]
  else pos.x-= 130;
  player=new MovingObject(pos.x,pos.y-100,40,'#2a20');
  player.facing='left';


}

let  playerMoving;
let lastPlayerMovingState=false;
let playerJumping=false;
function updatePlayer(){
  player.limitX();
  player.display();
  playerModel.x=player.screenPos.x+20;
  playerModel.y=player.screenPos.y+10;

  playerMoving=false;

  if(player.movingLeft||player.movingRight) playerMoving=true;

  if((player.jumpForce>0||player.fallSpeed>0)&&!playerJumping){

    playerJumping=true;
    playerModel.fullRig.selectAnimation(2);

    //console.log("jump")
  }
  else if(player.jumpForce==0&&playerJumping){
  //  console.log('jump over')
    playerJumping=false;
    resetPlayerAnimation();
  }
  else if(playerMoving&&!lastPlayerMovingState) playerModel.fullRig.selectAnimation(0);
  else if(!playerMoving&&lastPlayerMovingState) playerModel.fullRig.selectAnimation(3);
  lastPlayerMovingState=playerMoving;

  playerModel.update(ctx,(player.facing=='left'));
  if(player.hitPoints<100) player.hitPoints+=0.1;
}

function resetPlayerAnimation(){
  if(playerMoving) playerModel.fullRig.selectAnimation(0);
  else playerModel.fullRig.selectAnimation(3);
}
let aboutguydialogs = [
  "welcome to sam's 13k js 2020 game! what's up?",
  "still talking to me, huh"
];

let computerdialogs = [
  "i'm the computer! press 1 to reach another page, press 2 to process data strips."
]
let dialogUI = {
  open: false,
  t: 0,
  counter:0,
  line:[],
  lineI:0,
  displayedText:""
};

let aboutguyDialogProgression =0;
let computerDialogProgression =0;


function runDialog(){

  if(dialogUI.open){

    if(dialogUI.t!=0){
      let p = getScreenPos({x:dialogUI.t.x,y:dialogUI.t.y,w2:50,h2:50});
      dialogUI.x = p.x;
      dialogUI.y = p.y - 70;
    }

    ctx.fillStyle='white';
    ctx.fillRect(dialogUI.x,dialogUI.y,100,37);
    ctx.fillStyle='black';
    ctx.fillText(dialogUI.displayedText[0],dialogUI.x+5,dialogUI.y+15)
    ctx.fillText(dialogUI.displayedText[1],dialogUI.x+5,dialogUI.y+26)
  }

  // if no one is interactible, close dialog ui (add any other interactible things here)
  if(!aboutguy.interactible&&!computer.interactible) dialogUI.open=false;
  if(!computer.interactible){
    displayLinksUI = false;
    displayProcessUI = false;
  }

}

function continueDialog(){

  if(dialogDone){
    dialogUI.open = false;
    dialogDone = false;

    if(aboutguy.interactible) aboutguyDialogProgression = (aboutguyDialogProgression+1)%2;
    else computerDialogProgression =0;
  }
  else
  cutDialog();
}


let dialogDone = false;
let maxCharsPerLine = 20;

function cutDialog(){

  let line1 = makeLine();
  let line2 = {t:""};
  if(!line1.stop) line2 = makeLine();

  dialogUI.displayedText=[line1.t,line2.t];
}

function makeLine(){

  let result="";
  let stop=false;
  while(!stop&&result.length+dialogUI.line[0].length<maxCharsPerLine){
    result+=dialogUI.line[0]+" ";
    dialogUI.line.shift();
    if(dialogUI.line.length==0){
      stop=true;
      dialogDone = true;

    }
  }
  return {t:result,stop:stop};
}
let exitDoorRange=30;

// actionbutton()
//
// called when user presses action button. triggers dialog ui

function actionButton(){
  if(currentLevel=='home'){
    let a = aboutguy.interactible;


    if(!displayLinksUI&&!displayProcessUI){
      if(a||computer.interactible){
        if(!dialogUI.open){

          dialogUI.open=true;
          if(a){
            dialogUI.t=aboutguy;
            dialogUI.line = aboutguydialogs[aboutguyDialogProgression].split(" ");
          }

          else{
            dialogUI.line = computerdialogs[computerDialogProgression].split(" ");
            dialogUI.t =computer;
          }
          cutDialog();
        }
        else continueDialog();
      }
    }
    // if either links or process ui are open
    else {
      if(displayLinksUI){

      }
      else if(displayProcessUI){

      }
    }


  }
  else {
    if(exitdoor.interactible){
      currentLevel='home';
      createLevel();
      createPlayer();
      fadeIn=0;
      waittime=8;
    }
  }
}
let cantGoDown = false;

function keypress(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=true;
      player.movingRight=false;
      player.facing='left';
    break;

    case 68: //d
      player.movingRight=true;
      player.movingLeft=false;
      player.facing='right';
    break;

    case 32: //space
    if(player.fallSpeed<8) player.jump();
    break;

    case 83: //s
      if(player.y<killLine&&!cantGoDown) player.y++;
    break;

    case 69: //e
      // action button
      actionButton();
    break;

    case 49: //1
    if(currentLevel=='start'){
      console.log("yo")
      currentLevel='home';

      createLevel();
      createPlayer();

    }
    else  if(currentLevel=='home'&&computer.interactible&&!displayProcessUI) displayLinksUI = true;
      else displayLinksUI = false;
    break;

    case 50: //2
      if(currentLevel=='home'&&computer.interactible&&!displayLinksUI) displayProcessUI = true;
      else displayProcessUI = false;
    break;

    case 82: // r

    break;

    case 27: //escape
    displayProcessUI = false;
    displayLinksUI = false;
    dialogUI.open=false;
    inventoryDisplayed=!inventoryDisplayed;
    break;
  }
}


function keyrelease(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=false;
    break;

    case 68: //d
      player.movingRight=false;
    break;

  }
}
let mouseIsPressed = false;
let mouseX =0;
let mouseY =0;
let shootStopTimeout;
// mousepressed()
//
// triggered once when mouse is pressed

function mousePressed(){
  //console.log("mouse press");
  mouseIsPressed = true;
  mouseX = event.clientX-canvas.x;
  mouseY = event.clientY-canvas.y;
  //console.log(mouseX,mouseY);
  if(!displayLinksUI&&!displayProcessUI&&currentLevel!='start')
    player.shoot(mouseX,mouseY,15);
    playerModel.selectAnimation(4);
    clearTimeout(shootStopTimeout);
    shootStopTimeout = setTimeout(function(){
      resetPlayerAnimation();
    },400);
}


// mouseReleased()
//
// called once when mouse is released

function mouseReleased(){
  //console.log("mouse released")
  mouseIsPressed = false;
}
let inventoryDisplayed = false;

function addToInventory(name,quantity){

  let alreadyHave = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name){
      alreadyHave = true;
      inventory[i].quantity+=quantity;
    }
  }
  if(!alreadyHave) inventory.push({name:name,quantity:quantity});
  updateInventoryDisplay();
}

function removeItem(name,quantity){
  let have = haveItem(name,quantity);
  console.log(have)
  if(have!=-1){
    inventory[have].quantity-=quantity;
    if(inventory[have].quantity==0) inventory.splice(have,1);
  }

  updateInventoryDisplay();
}

function haveItem(name,quantity){
  let result = -1;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name&&inventory[i].quantity>=quantity) result = i;
  }
  return result;
}

function findAndRemoveItem(name,quantity){
  let result = haveItem(name,quantity);
  console.log(result,name)
  if(result!=-1) removeItem(name,quantity);
  console.log(result);

  updateInventoryDisplay();
  return result;
}

let slotSize=40;
let slotmargin=5;
function updateInventoryDisplay(){

  let items = document.getElementsByClassName("invitem");
  for(let i=0; i<items.length; i++){
    items[i].remove();
  }
  let bounds = {
    x:canvas.x+slotmargin,
    y:actionBar.y+slotmargin,
    w:slotSize,
    h:slotSize
  }
  for(let i=0; i<inventory.length; i++){

    let fill = "white";
    let index=0;
    for(let j=0; j<enemyLootTable.length; j++){
      if(enemyLootTable[j].name==inventory[i].name) fill = enemyLootTable[j].fill;
    }

    let el = div(bounds,fill);
    el.setAttribute("class","invitem");
    bounds.x+=slotSize+5;
    el.style.fontSize='10px';
    el.setAttribute("onclick","useItem('"+inventory[i].name+"')");
    el.innerHTML = inventory[i].name+" ("+inventory[i].quantity+")";
  }
}

function useItem(name){
//  console.log("use "+name)
  if(name==enemyLootTable[3].name){
  //  console.log("health uppp!")
    player.hitPoints = Math.min(player.hitPoints+20, 100);
    removeItem(name,1);
  }
  else if(name==cleaningitem&&currentLevel!='home'&&currentLevel!='true404'){
    cleanLevel();
    removeItem(name,1);
  }
}

function cleanLevel(){
  console.log("level cleaned!");
  let index = saveData.seedIndex.indexOf(currentLevel);
  clearedStates[index]=true;
  level1.cleared = true;
  favoritesStatus[index]='Cleared!';
}
let enemyLootTable = [
  {name:"angry data strip",fill:"grey",quantity:{min:12,r:14},chance:1},
  {name:"gold",fill:"gold",quantity:{min:1,r:5},chance:0.5},
  {name:"html bits",fill:"lightblue",quantity:{min:3,r:52},chance:0.8},
  {name:"health pot",fill:"tomato",quantity:{min:1,r:3},chance:0.9}
];

let cleaningitem = 'level clear-tastik';

let items = [];
let inventory = [];

function generateLoot(target){

  let r = Math.random();
  for(let i=0; i<enemyLootTable.length; i++){
    if(r<enemyLootTable[i].chance){
      let e = enemyLootTable[i];
      let r2 = Math.floor(e.quantity.min+Math.random()*e.quantity.r);
      items.push(new Item(target.x,target.y-50,10,e.fill,e.name,r2));
    //  console.log(items[items.length-1])
      let index=items.length-1;
      items[index].impactForce.x = Math.floor(6 + Math.random()*12);
      if(Math.random()>0.5) items[index].impactForce.x*=-1;
      items[index].initJumpForce=11;
      items[index].jump();
    }
  }
}

function updateItems(){
//  console.log("sup boyx")
  for(let i=0; i<items.length; i++){
    items[i].update();
  //  console.log("updat4e it")
  }
}

class Item extends MovingObject {

  constructor(x,y,size,fill,name,quantity){
    super(x,y,size,fill);
    this.name=name;
    this.looted = false;
    this.lootableRange = 80;
    this.pickupRange = 10;
    this.lootSpeed=1;
    this.quantity = quantity;
  //  console.log("load loot!")
  }

  update(){
//console.log("yo")
    if(!this.looted){
      let d = distance(this.x,this.y,player.x,player.y);
      if(d.d<this.pickupRange){
        // ITEM PICKED UP !
        this.looted = true;

        addToInventory(this.name,this.quantity);
      }
      else if(d.d<this.lootableRange){
        // ITEM MOVES TOWARDS PLAYER
        this.lootSpeed++;
        let ratio = this.lootSpeed/d.d;
        this.speedVect = {
          y: ratio*d.opp,
          x: ratio*d.adj
        }
        this.x+=this.speedVect.x;
        this.y+=this.speedVect.y;
        this.fallSpeed=0;
      }
      else if(this.lootSpeed>1) this.lootSpeed--;


      this.display();
      if(this.screenPos!=false){
        ctx.fillStyle='#000b';
        ctx.font='8px bold';
        ctx.fillText(this.quantity,this.screenPos.x+15,this.screenPos.y-15)
      }
      //console.log("updat4!")
    }

  }
}
let ns1 = 58;
let ns2 = 93;

class CoolPath{
  constructor(x,y,modeldata,rig,anim,colors){
    this.x=x;
    this.y=y;
    this.cmess;
    this.scale = 1.5;
    this.colors = colors;
    this.unpackModelMessage(modeldata); // this.model
    this.unpackRigMessage(rig); // this.rig
    this.unpackAnimation(anim); // this.animations


    for(let i=0; i<this.rig.length; i++){
      if(this.rig[i].isRoot) this.fullRig = new RigShape(i,this.scale,this.model,this.rig,this.animations,this.colors);
    }
    this.selectAnimation(1);
    this.timeCounter=0;
  }

  selectAnimation(index){
    this.selectedAnimation=index;
    this.fullRig.selectAnimation(index);
  }

  update(context,flipped){

    this.fullRig.updateRotationValues();
    ctx.translate(this.x,this.y);
    if(flipped) ctx.scale(-1,1);
    this.fullRig.display(ctx);
    ctx.resetTransform();

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.selectedAnimation].animLength) this.timeCounter=0;
  }
  unpackModelMessage(modeldata){

    let m = modeldata.split("*");
    this.model = [];

    // for each path
    for(let i=0; i<m.length; i++){

        this.cmess=m[i];
        this.segments = [];

        // check out characters by pair
        for(let j=5; j<m[i].length; j+=2){

            // if this point is part of a line
         if(this.toNum(j,0)<ns2) this.newSeg('L',j,ns1);

          // otherwise this point is part of a curve
          else{
            let sl=this.segments.length-1;

            if(sl>=0){
              // look at the current batch of points
              let s = this.segments[sl];
              // if they were part of a line, start a new curve
              if(s.type=="L") this.newSeg('C',j,ns2);
              // if instead we already have a curve going
              else {
                // if it's not full, add a point
                let p = s.points;
                  if(p.length<3) p.push({x:this.toNum(j,ns2),y:this.toNum(j+1,ns2)});
                  // if it is full start a new curve
                  else this.newSeg('C',j,ns2);
              }
            }
            // lastly if there was nothing in the list, add new curve entry
            else this.newSeg('C',j,ns2);

          }
        }

        this.model.push({
          shape:this.toNum(0,ns1),
          fill:this.toNum(1,ns1),
          stroke:this.toNum(2,ns1),
          origin:{x:this.toNum(3,ns1),y:this.toNum(4,ns1)},
          segments:this.segments
        });
    }

  }

  unpackRigMessage(rig){

    this.rig=[];

    let m = rig;
    this.cmess=m;
    let counter=0;

    for(let i=0; i<m.length; i++){

      let r = this.rig[this.rig.length-1];

      if(counter==0) this.rig.push({origin:{x:this.toNum(i,ns1)},connections:[],isRoot:false});
      else if(counter==1) r.origin.y=this.toNum(i,ns1);
      else if (counter>2){

          let c = r.connections[r.connections.length-1];
          if(counter%3==0) r.connections.push({x:this.toNum(i,ns2)});
          else if(counter%3==1) r.connections[r.connections.length-1].y=this.toNum(i,ns2);
          else c.shape=this.toNum(i,ns2);

      }
      else if(counter==2&&m[i]=='1') r.isRoot=true;

      counter++;
      if(counter>2&&this.isns1(m,i+1)) counter=0;

    }
  }

  unpackAnimation(anim){

    this.animations = [];
    this.cmess = anim;
    let m = anim;
    let done = false;
    let lastEnd=0;

    while(!done){

      let nameEnd = m.indexOf('*',lastEnd+1);
      let a={ name: m.substring(lastEnd+1,nameEnd) };
      a.animLength = this.toNum(nameEnd+1,ns1);

      let x = nameEnd+1+this.rig.length;
      a.initVals = [];
      a.timeStamps = [];

      for(let i=nameEnd+2; i<x+1; i++){
        a.initVals.push( this.toAngle(i) );
      }

      lastEnd = x+1;
      for(let i=0; i<this.rig.length; i++){

        a.timeStamps.push([]);
        let nextEnd = m.indexOf('*',lastEnd+1);
        let counter=0;

        for(let j=lastEnd+1; j<nextEnd; j++){
          let ts=a.timeStamps[ l(a.timeStamps)-1];
          if(counter%2==0) ts.push( {rot: this.toAngle(j) } );
          else ts[ l(ts)-1 ].time=this.toNum(j,ns1);
          counter++;
        }

        lastEnd = nextEnd;
        if(nextEnd==-1) done = true;
      }
      this.animations.push(a);
    }

  //  return result;
  }

  newSeg(t,charindex,ns){
    let p = {x:this.toNum(charindex,ns),y:this.toNum(charindex+1,ns)};
    this.segments.push({type:t,points:[p]});
  }

  toNum(character,startnum){
    return this.cmess.charCodeAt(character)-startnum;
  }

  isns1(message,charindex){
    return (message.charCodeAt(charindex)<ns2);
  }

  toAngle(i){
    return 180*this.toNum(i,ns2)/30;
  }
}

class RigShape{

  constructor(index,scale,model,rig,animations,colors){
  //  // console.log(animShapes[index])
    // get origin from animShape index
    this.colors=colors;
    this.model=model;
    this.rig = rig;
    this.animations=animations;
    this.shapeIndex=index;
    this.origin={ x:this.rig[index].origin.x*scale, y:this.rig[index].origin.y*scale };
    this.rotation =0;
    this.paths = [];
    this.fill;
    this.stroke;
    this.timeCounter=0;

    for(let i=0; i<this.model.length; i++){
      // console.log(this.model[i]);
      // create path from model save data
      if(this.model[i].shape==index){

      let x=this.model[i].origin.x*scale;
      let y=this.model[i].origin.y*scale;
      let path = "M "+x+" "+y+" ";
      for(let j=0; j<this.model[i].segments.length; j++){
        path+=this.model[i].segments[j].type+" ";

        for(let k=0; k<this.model[i].segments[j].points.length; k++){

          x=this.model[i].segments[j].points[k].x*scale;
          y=this.model[i].segments[j].points[k].y*scale;
          path+=x + " " + y;

          path+=" ";
        }
      }

      this.paths.push({path:new Path2D(path),stroke: this.model[i].stroke, fill: this.model[i].fill});
    }

    }

    // create connections from animshape index
    this.connections=[];
    for(let i=0; i<this.rig[index].connections.length; i++){
    //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.connections.push({
        shape:new RigShape(this.rig[index].connections[i].shape,scale,this.model,this.rig,this.animations,this.colors),
        x: this.rig[index].connections[i].x*scale,
        y: this.rig[index].connections[i].y*scale
      });
    }
  }
  selectAnimation(index){
    this.selectedAnimation=index;
    for(let i=0; i<this.connections.length; i++){
    //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.connections[i].shape.selectAnimation(index);
    }
  }
  updateRotationValues(){

      //setRotationsFromTimeStamps();\
      // if time is 0, rotations = initial values
      if(this.timeCounter==0){
        this.rotation= this.animations[this.selectedAnimation].initVals[this.shapeIndex];
      }
      else{
        // if time isn't 0, we hafta look at the timestamps

       this.rotation = this.getRotFromTimeStamps();
    //     // console.log(this.rotation+", time: "+timeCounter);

      }

    for(let i=0; i<this.connections.length; i++){
      this.connections[i].shape.updateRotationValues();
    }

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.selectedAnimation].animLength) this.timeCounter=0;
  }

  // context must be specified since this is used in both
  // the rig editor's and the anim editor's canvas.
  display(context){
    // display this


    context.save();
    context.rotate(rad(this.rotation));
    context.translate(-this.origin.x,-this.origin.y)

    // display all paths in this shape
    for(let i=0; i<this.paths.length; i++){

      context.strokeStyle=this.colors[this.paths[i].stroke];
      context.fillStyle=this.colors[this.paths[i].fill];
    //  context.strokeStyle="black"
    //  context.fillStyle="blue"
      context.fill(this.paths[i].path);
      context.stroke(this.paths[i].path);
    //  // console.log(this.paths[i].path)
    }

    // + display any connections
    for(let i=0; i<this.connections.length; i++){
      context.save();
      context.translate(this.connections[i].x,this.connections[i].y);
      this.connections[i].shape.display(context);
      context.restore();
    }
    context.restore();
  }

  // getgotfromtimestamps()
  //
  // calculates this rig shape's rotation value according to time stamps

  getRotFromTimeStamps(){

    let newrot; // value to be returned

    // get list of time stamps for this shape
    let stamps = this.animations[this.selectedAnimation].timeStamps[this.shapeIndex];
    //// console.log(stamps);
    // find which stamp is just behind and which stamp is just ahead
    // at this point in time:

    let correctStampFound=false;
  //  // console.log(stamps);
    // if this shape has time stamps
    if(stamps.length>0){

      // check each time stamp related to this shape
      for(let i=0; i<stamps.length; i++){

        // if current time is less than this stamp's time,
        // then stamps[j] is the stamp we are working towards.
        if(this.timeCounter<=stamps[i].time&&!correctStampFound){

          let lastStampTime=0;
          let lastStampRot=0;

          // get time between last stamp and this next stamp:
            if(i>0) {
              // if last stamp was a timestamp
              lastStampTime=stamps[i-1].time;
              lastStampRot=stamps[i-1].rot;
            }
            else{
              //if last stamp was the initval
              lastStampTime=0;
              lastStampRot=this.animations[this.selectedAnimation].initVals[this.shapeIndex];
            }

            // calculate where we are (% of time between stamps) (fraction of 1)
            let pos = (this.timeCounter-lastStampTime)/(stamps[i].time-lastStampTime);

            // calculate rotation:
            // d = lastStampRot + %pos * (nextStampRot-lastStampRot)
          newrot = lastStampRot + pos * (stamps[i].rot - lastStampRot);
  //  // console.log(timeCounter,lastStampTime,stamps[i].time,pos,lastStampRot,newrot);

          correctStampFound=true;
        }
      }
      if(!correctStampFound){
        // case in which there are no more stamps ahead (work back to initval)

        let lastStampTime=stamps[stamps.length-1].time;
        let lastStampRot=stamps[stamps.length-1].rot;

        let pos = (this.timeCounter-lastStampTime)/(this.animations[this.selectedAnimation].animLength-lastStampTime);
      //  // console.log("POS2* "+pos);
        //    // console.log(timeCounter,lastStampTime,pos,lastStampRot,newrot);
        newrot = lastStampRot + pos * (this.animations[this.selectedAnimation].initVals[this.shapeIndex] - lastStampRot);
      }
    }
    //currentRigPos[this.shapeIndex]=newrot;
    return newrot;
  }
}
let playerModel;
let monsterModel;

function loadModelData(){
  /*
  playerModel = new CoolPath(0,0,
    ":;:CEhbnemiIIBI*:<:JFOGIH*:=:FEifkfkh*;>:ACcfcgdg*<<:IIIKOI*=;:JOodgcfgdicrdr*><:JMiojmnnlnknnolokomp*>;:IGltilij*?<:FIeleiijgjgjikgkgkil*?;:EDhhfpeg*@;:OGntgjji*A;:BHfdd`bk*B;:DCeocnee*C;:EQhlfkft*D;:FAjmhigd",
      "EG0jb^lk_@>0JJ0EO0he]fgdlhfGH0DE0JI1nj`kmapnbBA0ckeBC0DK0gtgEA0",
      "*walking*R]]]]dW]^]\\Z*Z;^>^D*_=]@*]HbL]O*\\D*[?fEYKgR*`?VEaKXR**`?`E_M*bEZM*Z?YE[M*XE^M*still*Z]]]]]]]]]]]*\\@_L[T**]@`C]K*\\@**]@\\P**`@`E]P*a@bE*X@XE\\P*X@YE",
      ["rgba(197,119,0,0.0)","rgba(58,0,121,1.0)","rgba(255,127,62,1.0)","#ffff","rgba(2,0,4,1.0)"]);
      */

      playerModel = new CoolPath(0,0,
        ":;:JFHF*;;:PAo^e^fffppnqf*<<:DQip`hmkqmqulv*<=:DQexjylv*=>:=H_ddcckdmaq`k*>=:?L_mciepjpfubo*?>:@Hdmaq`k_ddcck*@=:?L_mciepjpfubo*A=:TJvirktntqzswm*B;:SNUOTRzuyvvvSQ*C=:QKrkviwmzstqtn*D;:SNUOTRzuyvvv*;=:PCrhojpfnjlimfEB*B=:SNsoylxr*D=:SNsoylxr*@;:@REONTOSKPloiogp@O*@:<@RFNNS",
          "HM1nm`jwdkp_hwffmbHG0HM0kj^>D0bma?J0>D0bmc?J0RI0vpeSM0RI0vpgSM0",
          "*run*L^]]S]WV^^f**ZC**C*SC*cC*]C*`C*eC*VC*]C*gethit*F]]]]]]]]]]]*U=*Z=_B**H=XB*U=OB*T=aB*U=RB*a=[B*g=bB*n=^B*_=iB*fall*RbZ]YZlSQ]W]*]CbK*[CUK*]K*QCWK*^K*kCiK*[C[K*NCRK*kCaK*LC[K*jC`K*nothing*R]\\]Z]Y]Z_[^**_E**]E*VE*\\E*WE*****shooting*F]]]]]_[]]]]*[<*X<**W<*L<*U<*T<*_<*[<*_<*",
          ["rgba(254,255,247,0.0)","rgba(0,0,0,1.0)","rgba(255,154,33,1.0)","rgba(53,77,230,1.0)","rgba(240,112,0,1.0)"]);
          playerModel.fullRig.selectAnimation(1);


}
class MovingObject extends DisplayObject {// extends display object class
  constructor(x,y,size,fill){
    super(x,y,size,size);
    this.fill=fill;
    // parameters
    this.hasGravity=true; // object falls if true
    this.fallAcc=2; // fall acceleration
    this.lrMaxSpeed=10; // max horizontal speed
    this.lrAcc=1; // horizontal acceleration
    this.lrFriction=2; // deceleration while not moving
    this.initJumpForce=25;
    // variables
    this.movingLeft=false;
    this.movingRight=false;

    this.jumpForce=0;
    this.jumpDecel = 2.2;
    this.fallSpeed=0;
    this.lrSpeed=0;
    this.impactForce={x:0,y:0};
    this.hitPoints = 100;

  }

  display(){

    this.moveLeftRight();
    this.applyPhysics();
    this.updateOnScreenPosition();
    if(this.screenPos!=false){

      ctx.fillStyle=this.fill;
      ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);

      if(this.hitPoints<100){
        this.displayHealthBar();
      }
    }
  }

  displayHealthBar(){

    let w = 30;
    let h = 10;
    let y = this.screenPos.y-25;
    let x = this.screenPos.x;
    ctx.fillStyle = "white";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "red";
    ctx.fillRect(x,y,w*this.hitPoints/100,h);
  }

  jump(){

    this.jumpForce = this.initJumpForce;
  }

  moveLeftRight(){

      if(this.movingLeft&&!this.movingRight){
        this.lrSpeed -= this.lrAcc;
        this.lrSpeed = Math.max( this.lrSpeed, - this.lrMaxSpeed );
      }
      else if(this.movingRight&&!this.movingLeft){
        this.lrSpeed += this.lrAcc;
        this.lrSpeed = Math.min( this.lrSpeed, this.lrMaxSpeed );
      }
      else {
        if(this.lrSpeed+this.lrFriction<0) this.lrSpeed+=this.lrFriction;
        else if(this.lrSpeed-this.lrFriction>0) this.lrSpeed -= this.lrFriction;
        else this.lrSpeed=0;
      }

      if(this.impactForce.x>0) this.impactForce.x--;
      else if(this.impactForce.x<0) this.impactForce.x++;

      this.x += this.lrSpeed + this.impactForce.x;

    }



  applyPhysics(){

    // check if falling
    this.updateFallSpeed();


    // do something with impact force:
    //if(this.impactForce.y>0) console.log(this.impactForce.y);
    if(this.jumpForce-this.jumpDecel>0) this.jumpForce-=this.jumpDecel;
    else this.jumpForce=0;
    // update player position
    this.y+= this.fallSpeed - this.jumpForce;
  }

  updateFallSpeed(){

    let p=level1.platforms;
    let nearestPlatform =killLine;
    //console.log("chck "+this.speedVect)
    for(let i=0; i<p.length; i++){
      if(
        // if platform overlaps on x axis
        this.x>p[i].x-p[i].w2
        &&this.x<p[i].x+p[i].w2
        // and is below player
        &&p[i].y>=this.y+this.h/2
        &&p[i].y<nearestPlatform
      ){
        nearestPlatform = p[i].y;
        this.currentPlatform =i;
      }

    }

    // update falling speed
    if(this.y+this.h/2+this.fallSpeed<nearestPlatform){
      this.fallSpeed+=this.fallAcc;
    }
    else{
      this.y=nearestPlatform-this.h/2;
      this.impactForce.y = this.fallSpeed;
      if(this.impactForce.y>36) this.hitPoints -= this.impactForce.y/2;
      this.fallSpeed = 0;

    //  console.log("bang")
    }
  }
}
class DisplayObject{

  constructor(x,y,w,h){

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.w2=this.w/2;
    this.h2=this.h/2;
  }

  updateOnScreenPosition(){

    let bounds = getBounds(this);

    // if object is on screen, then update screen pos.
    if( checkCollision(bounds,camera) ) this.screenPos = getScreenPos(this);
    // if it is offscreen screenpos is false.
    else this.screenPos = false;
  }

  limitX(){
    this.x = Math.min(Math.max(this.x,-sceneW/2),sceneW/2);
  }

  shoot(targetx,targety,speed){
    if(targetx<this.screenPos.x) this.facing='left';
    else this.facing='right';
    projectiles.push(new Projectile(this.x,this.y,4,"black",speed,targetx,targety));
  }
}

function checkCollision(bounds1,bounds2){
  return (
    ( bounds1.right>=bounds2.left && bounds1.right<=bounds2.right )
    || ( bounds1.left>=bounds2.left && bounds1.left<=bounds2.right )
    || ( bounds1.left<=bounds2.left && bounds1.right>=bounds2.right )
  )
  &&(
    ( bounds1.bottom>=bounds2.top && bounds1.bottom<=bounds2.bottom)
    || ( bounds1.top>=bounds2.top && bounds1.top<=bounds2.bottom )
    || ( bounds1.top<=bounds2.top && bounds1.bottom>=bounds2.bottom )
  )
}

function getScreenPos(input){
  return {
    x: canvas.w2 + input.x-camera.target.x - input.w2,
    y: canvas.h2 + input.y-camera.target.y - input.h2
  }
}
class Projectile extends MovingObject{

  constructor(x,y,size,fill, speed,targetx,targety){
    super(x,y,size,fill);
    this.destroyed = false;

    this.y-=20;
    this.updateOnScreenPosition();

    let p = this.screenPos;
    let d = distance(p.x,p.y,targetx,targety);
    let ratio = speed/d.d;
    this.speedVect = {
      y: ratio*d.opp,
      x: ratio*d.adj
    }
    //console.log(this.speedVect)
    this.hasGravity=false;
    this.lifeTimer=0;
  }

  updateProjectile(){
    this.lifeTimer++;
    if(!this.destroyed){


      this.x+=this.speedVect.x;
      this.y+=this.speedVect.y;

      this.updateOnScreenPosition();
      if(this.screenPos!=false){

        this.checkForCollisions(level1.platforms,false);
        this.checkForCollisions(enemies,10);
        this.checkWallCollisions();

        ctx.fillStyle=this.fill;
        ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);
      }
    }
    else this.display();

  }

  checkWallCollisions(){
    if(this.x<-sceneW/2
    || this.x>sceneW/2){
      this.stopProjectile();
    }
  }

  checkForCollisions(input,damage){
    for(let i=0; i<input.length; i++){
      if(
        checkCollision(getBounds(input[i]),getBounds(this))

  ){
        this.stopProjectile();

        if(damage!=false){
          input[i].hitPoints -= damage;
          let d2 = damage/2;
          input[i].impactForce.x+=Math.min(Math.max(input[i].x-this.x,-d2),d2);
        }
      }
    }
  }

  stopProjectile(){
    this.speedVect.x=0;
    this.speedVect.y=0;
    this.destroyed = true;
  }
}
let projectiles = [];

function updateProjectiles(){

  for(let i=projectiles.length-1; i>=0; i--){
    projectiles[i].updateProjectile();
    if(projectiles[i].lifeTimer>50){
      projectiles.splice(i,1);
    //  console.log("projectile ded")
    }
  }
}
let saveData = null;
function loadSave(){

  saveData=localStorage.getItem(saveDataHeader);
  // if there is no save data, setup a save data object
  if(saveData==null){
    newGameSave();
  }
}

// newgamesave()
//
// resets the save game data
function newGameSave(){
  saveData = {
    seedIndex:[],
    seedData:[],
    linkNames:[]
  }
}
let saveDataHeader='sams404gameforjs13kof2020';


function saveGame(){
  localStorage.setItem(saveDataHeader, JSON.stringify(saveData));
}
let canvasElw;
let canvasElh;

function createCanvas(){
  canvas.w = 600;
  canvas.h = 400;
  canvas.w2=canvas.w/2;
  canvas.h2=canvas.h/2;

  canvas.canvas = document.createElement("canvas");
  canvas.canvas.setAttribute("width",canvas.w);
  canvas.canvas.setAttribute("height",canvas.h);


  document.body.appendChild(canvas.canvas);
  //canvas.canvas.setAttribute("style",``);
  ctx = canvas.canvas.getContext("2d");

  let bounds = canvas.canvas.getBoundingClientRect();
  canvas.x = Math.round(bounds.x);
  canvas.y = Math.round(bounds.y);
}

window.onresize=resizeCanvas;
function resizeCanvas(){


  let pos= {
    x:canvas.x,
    y:canvas.y+canvas.h,
    w: canvas.w,
    h: 50,
  }
  setStyle( actionBar.el,pos,actionBarFill );

  pos.w=pos.w*0.9;
  setStyle( actionBar.inventory,pos,'grey');

  pos.x+=pos.w;
  pos.w=pos.w*0.1/0.9;
  setStyle( actionBar.right,pos,'blue');
}
let noiseSeed =0;

let seedStorageHeader="sams404gameseed";

let seedDataLength=100;
let maxCharVal=100;
let charStartVal = 128; // start index for charcode assignments

// setuprandomseed()
// stores random strings to be used as noise generator seeds
// or retrieves already stored random strings

function setupRandomSeed(index){

  if(!saveData.seedIndex.includes(index)){

    let result="";
    for(let i=0; i<seedDataLength; i++){
      result+= String.fromCharCode( charStartVal+Math.floor(Math.random()*maxCharVal) );
    }
    saveData.seedData.push(result);
    localStorage.setItem( seedStorageHeader+index, result );

    saveData.seedIndex.push(index);
  }
}

let noiseCounter=0;

function random(){
  let seed = currentLevel;
  localStorage.removeItem(seedStorageHeader+"0")
  //console.log(random(0),random(0),random(0),random(0),random(0),random(0),random(0));
  setupRandomSeed(seed);
  let val1 = getNoiseVal(Math.floor(noiseCounter),seed);
  let val2 = getNoiseVal(Math.ceil(noiseCounter),seed);
  noiseCounter+=0.7;

  return (noiseCounter%1)*(val2-val1)+val1;
}

function getNoiseVal(val,seed){
  val = val % seedDataLength;
  return ( saveData.seedData[saveData.seedIndex.indexOf(seed)].charCodeAt(val)-charStartVal )/maxCharVal;
}
function distance(x1,y1,x2,y2){
  let adj=x2-x1;
  let opp=y2-y1;
  return{
    d:Math.sqrt( adj*adj+opp*opp ),
    adj:adj,
    opp:opp
  }
}

function getBounds(el){
  return {
    left:el.x-el.w2,
    right:el.x+el.w2,
    top:el.y-el.h2,
    bottom:el.y+el.h2
  }
}

function div(box,fill){
  let result = document.createElement("div");
  document.body.appendChild(result);
  setStyle(result,box,fill);
  return result;
}

function setStyle(el,box,fill){
  el.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${fill};`);
}

function button(bounds,fill,id,action){
  let result = div(bounds,fill);
  result.id=id;
  at(result,'onclick',action+"()");
  at(result,'onmouseenter',`hover("${id}")`);
  at(result,'onmouseleave',`unhover("${id}","${fill}")`);
  return result;
}

function at(target,attribute,value){
  target.setAttribute(attribute,value);
}

function hover(id,fill){
  document.getElementById(id).style.backgroundColor="grey";
}
function unhover(id,fill){
  document.getElementById(id).style.backgroundColor=fill;
}

function rad(angle){
  return angle*Math.PI/180;
}

function l(i){
  return i.length;
}
let actionBar = {};
let actionBarFill = 'black';
function setupActionBar(){

  actionBar= {
    x:canvas.x,
    y:canvas.y+canvasElh,
    w: canvasElw,
    h: 50,
  }

    actionBar.el = div(actionBar,actionBarFill);

    actionBar.w=actionBar.w*0.9;
    actionBar.inventory = div(actionBar,'grey');

    actionBar.x+=actionBar.w;
    actionBar.w=actionBar.w*0.1/0.9;
    actionBar.right = div(actionBar,'blue');

}
let waittime=5;
function runFadeIn(){

  let fact =1;
  if(fadeIn>waittime){
    fact = 1-(fadeIn-waittime)/30;

  }

  if(fact>0){
    ctx.fillStyle='rgba(0,0,0,'+fact+')';
    ctx.fillRect(0,0,canvas.w,canvas.h);
  }

  fadeIn++;
}
let displayLinksUI = false;
let lastdisplayState = false;
let linksUI = {
  w:260,
  h:80
};
let linkLoadTime=800;
let linksUIel;
let textform;
let listform;


function runLinksUI(){

  if(displayLinksUI){
    if(!lastdisplayState){
      lastdisplayState =true;
      dialogUI.open=false;

      linksUI.x = canvasElw/2-linksUI.w/2 + canvas.x;
      linksUI.y = canvasElh/2-linksUI.h/2 + canvas.y;

      linksUIel = document.createElement('div');
      linksUIel.setAttribute("style",`padding:10px;position:fixed;left:${linksUI.x}px;top:${linksUI.y}px;width:${linksUI.w}px;height:${linksUI.h}px;background-color:white;font-size:14px;`);

      let options = "";
      for(let i=0; i<favorites.length; i++){
        options+=`<option value="${favorites[i]}">status: ${favoritesStatus[i]}</option>`
      }

      linksUIel.innerHTML = `Choose from favorites:<br><input list="browsers" name="browser" id="browser" onchange='inputListChanged()'>
      <datalist id="browsers">
      ${options}
      </datalist></input>
      <br>Or type url name:<br>
      <input type="text" id="fname" name="fname" value="custom url" onkeydown='formKeyDown()' onclick='formclick()'>
      <div style='font-size:12px;position:absolute; right:26px;top:10px;'><br>select a list<br>item, or type<br>url name and <br>press enter</div>
      `;
      document.body.appendChild(linksUIel);

      textform=document.getElementById("fname");
      listform=document.getElementById("browser");
    }


  }
  else{
    if(lastdisplayState) linksUIel.remove();
    lastdisplayState = false;

  }
}

function formclick(){
  textform.value="";
}

function formKeyDown(){

  if(event.keyCode==13){
    textform.value = textform.value.trim();
    goToLink();
  }
}

function inputListChanged(){

  textform.value=listform.value;
  goToLink();
}

function goToLink(){

  let tinput = textform.value;
  let linput = listform.value;
  let result = linput;
  if(tinput!=linput) result = tinput;
  linksUIel.innerHTML = "loading "+result+"!";
  fadeIn =0;
  waittime=24;

  getLinkSeed(result);
  //currentLevel =0;
  noiseCounter=0
  createLevel();
  createPlayer();

  setTimeout(function(){
    displayLinksUI = false;

  },linkLoadTime);

}

let difficultyLevels = [];
// convert level/link name to seed index from the save data array
function getLinkSeed(name){

  let index = saveData.linkNames.indexOf(name);
  if(index!=-1) currentLevel = saveData.seedIndex[index];
  else {

    if(allLinkNames.includes(name)){


      if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0){
        enemyDifficulty = Math.min(enemyDifficulty+1,maxEnemyDifficulty);

      }

      difficultyLevels.push(enemyDifficulty);
      let favindex= favorites.indexOf(name);
      let statustext="Locked. Difficulty: "+enemyDifficulty;
      console.log("favindex",favindex)
      if(favindex!=-1){
        favoritesStatus[favindex]=statustext;
      }
      else{
        favorites.push(name);
        favoritesStatus.push(statustext);
      }
      lvlCount++;
      console.log('difficulty',enemyDifficulty)
      let newSeedIndex = Math.floor(Math.random()*100);
      while(saveData.seedIndex.includes(newSeedIndex)){
        newSeedIndex = Math.floor(Math.random()*100);
      }
      saveData.linkNames.push(name);
      currentLevel =newSeedIndex;
    }
    else {
      currentLevel ='true404';
    }

  }
}
let displayProcessUI = false;
let allLinkNames = ["home","contact","store","gallery","news","events","wormhole","destroy","noob","rekt","acidpool","badfile"];
let favorites = ["home","contact","store"];
let favoritesStatus = ["unknown","unknown","unknown"];
let clearedStates = [false,false,false];
let nextLink = "";

let pUI = {
  w:200,
  h:200,
  last:false,
  el:0
}

function runProcessUI(){

  if(displayProcessUI&&!pUI.last){

    // create process UI
    pUI.x = canvasElw/2-pUI.w/2;
    pUI.y = canvasElh/2-pUI.h/2;

    dialogUI.open=false;
    pUI.el = div(pUI,'white');
    pUI.el.innerHTML='spend '+dataCost+' data strips towards discovering a new page';
    let bsize = {x:pUI.x,y:pUI.y+pUI.h/4,w:pUI.w,h:pUI.h/4};
    pUI.dataButton = button(bsize,'yellow','but1','processDataStrips');
    bsize.y+=pUI.h/4;
    pUI.el2 = div(bsize,'white');
    pUI.el2.innerHTML='spend '+htmlCost+' html bits towards clearing an html page';
    bsize.y+=pUI.h/4;
    pUI.htmlButton = button(bsize,'orange','but2','processHTMLBits');
  }
  else if(!displayProcessUI&&pUI.last){

    // remove process UI
    pUI.el.remove();
    pUI.el2.remove();
    pUI.dataButton.remove();
    pUI.htmlButton.remove();
  }

  pUI.last=displayProcessUI;
}

let dataCost = 50; // cost to uncover url bits

function processDataStrips(){
console.log("data strps")
let have = findAndRemoveItem(enemyLootTable[0].name,dataCost);
console.log(have)
if(have!=-1){

  console.log("have!")
  if(nextLink=="") pickNextLinkAward();


    let pick = Math.floor(Math.random()*revealedLink.length);
    while(revealedLink[pick]!="_"){
      pick = Math.floor(Math.random()*revealedLink.length);
    }

    console.log(pick,nextLink)
    if(pick<nextLink.length-1)
    revealedLink = revealedLink.substring(0,pick)+nextLink[pick]+revealedLink.substring(pick+1,revealedLink.length);
    else revealedLink = revealedLink.substring(0,pick)+nextLink[pick]
    pUI.dataButton.innerHTML=revealedLink;
    console.log(revealedLink)
    revealedChars++;
    if(revealedChars==revealedLink.length){
      favorites.push(nextLink);
      favoritesStatus.push("unknown");
      clearedStates.push(false);
      pickNextLinkAward();
      console.log("done")
    }


}


}

let revealedLink = "";
let revealedChars =0;


function pickNextLinkAward(){
  console.log("reset reward")
  let pick = randomlink();
  if( favorites.length<allLinkNames.length-1 ){
    while(favorites.includes(pick)){
      pick = randomlink();
    }
  }
  else{
    let wordL = 4+Math.floor(Math.random()*4);
    pick="";
    for(let i=0; i<wordL; i++){
      pick+= String.fromCharCode(Math.floor(97+Math.random()*26));
    }
  }

  nextLink = pick;
  revealedLink = "";
  revealedChars =0;
  for(let i=0; i<nextLink.length; i++){
    revealedLink+="_";
  }
}

function randomlink(){
  return allLinkNames[Math.floor(Math.random()*allLinkNames.length)];
}


let htmlCost = 500;
function processHTMLBits(){
console.log("html bits");
let have =findAndRemoveItem(enemyLootTable[2].name,htmlCost);
if(have!=-1){
  addToInventory(cleaningitem,'1');
}
}

function displayStartUI(){
ctx.fillStyle='white';
ctx.fillRect(0,0,canvas.w,canvas.h);
ctx.fillStyle='black';
ctx.fillText("sam's js13k game",50,50);
ctx.fillText("press 1 to start new game. press 2 to continue.",50,65)
}


function startNewGame(){

}

function continueGame(){

}

function saveAndExit(){

}
let level1;

let sceneW=0;
let fadeIn =0;
let exitdoor;
let enemies = [];
let lvlCount=0;
let enemyDifficulty=1;
let lvlDiffIncreaseInterval = 3;
let maxEnemyDifficulty =3;
// a place to setup some platforms and stuff

function createLevel(){

  enemies = [];
  items = [];
  firstEnemyKilled = false;

  if(currentLevel=='home'){
    sceneW = canvas.w;
    let plats = [
      [50,killLine-100,100],
      [-60,killLine-60,100],
      [0, killLine, canvas.w]
    ];

    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));

    cantGoDown = false;
    createFriendlyNPCs();
  }
  else if(currentLevel=='true404'){
    sceneW = canvas.w;
    let plats = [
      [50,killLine-100,100],
      [-60,killLine-60,100],
      [0, killLine, canvas.w]
    ];

    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));
    let plat=level1.platforms[level1.platforms.length-1];
    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    exitdoor=new MovingObject(plat.x+50,plat.y-50,20,'#a22f');
    cantGoDown = false;
    //createFriendlyNPCs();
  }
  else {
    sceneW = 2*canvas.w;
    let sceneW2 = sceneW/2;
    let plats = [[0,killLine,sceneW]];
    let maxExtraPlatCount=8;
    let platCount = 5+Math.floor(random()*maxExtraPlatCount);
    let y = killLine;
    let minPlatW = 50;
    let maxExtraPlatW = 150;
    let platInterval = 65;
    let maxPlatDist = 60;


    let x = (-sceneW2+random()*sceneW)*0.6;
    let w = Math.min( minPlatW + random()*maxExtraPlatW , sceneW-x );

    for(let i=0; i<platCount-1; i++){

      if(i%4==2) maxExtraPlatW = 300;
      else maxExtraPlatW = 40;
      y-= platInterval;


      plats.push([x,y,w]);


      let middlemargin=50;

      let xdir = Math.floor( random()*3 )-1;
      if(x<0-middlemargin||x>0+middlemargin){
        xdir = Math.abs(sceneW2-x)/(sceneW2-x);
      }

      x += xdir*Math.floor( random() * maxPlatDist );
      w = Math.min( minPlatW + random()*maxExtraPlatW , (sceneW-x)/2 );

    }

    //plats[plats.length-1] = [0, killLine, canvas.w*2];

    let plat = plats[plats.length-1];
    plat[0] = sceneW/8;
    plat[2] = sceneW*1.2;
    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));
    let lastplat=level1.platforms.length-1;
    plat=level1.platforms[lastplat];

    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    exitdoor=new MovingObject(plat.x+50,plat.y-50,20,'#a22f');

    let index = saveData.seedIndex.indexOf(currentLevel);
    level1.enemyDifficulty = difficultyLevels[index];

    level1.cleared = clearedStates[index];

    // check if top platform is already unlocked
    if(favoritesStatus[index].substring(0,3)=="Unl"){
      firstEnemyKilled = true;
       cantGoDown=false;
    }
    else{
      cantGoDown = true;
      plat.fill = 'orange'
    enemies.push(new Enemy(plat.x,plat.y-80,lastplat));
    enemies[0].jumpy=false;
  }
  }

}

class Level{
  constructor(plist,w,h){

    this.platforms = [];
    for(let i=0; i<plist.length; i++){
      this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2]));
    }
    this.bgFill='#ddff';

  let offset = w/4;
    this.walls=[
      new DisplayObject( - w+offset, 0, w/2, 2000 ),
      new DisplayObject( w/2+offset, 0, w/2, 2000 ),
      new DisplayObject( 0, killLine+500, 2000, 1000 )
    ]
  }

  displayBackground(){
    ctx.fillStyle=this.bgFill;
    ctx.fillRect(0,0,canvas.w,canvas.h);



  }

  display404Background(){
    this.text404.updateOnScreenPosition();
    ctx.font='100px Georgia';
    ctx.fillStyle='black';
    ctx.fillText("404",this.text404.screenPos.x,this.text404.screenPos.y);
    ctx.font='30px Georgia';
    ctx.fillText("return to last page...",this.text404.screenPos.x,this.text404.screenPos.y+50);
  }

  displayPlatforms(){

    for(let i=0; i<this.platforms.length; i++){
      this.platforms[i].display();
    }

    ctx.fillStyle = "yellow"
    for(let i=0; i<this.walls.length; i++){
      let w = this.walls[i];
      w.updateOnScreenPosition();

      let p = w.screenPos;
    //  console.log("wall!",w.x,w.y,w.w,w.h)
      if(p!=false)
        ctx.fillRect(p.x,p.y,w.w,w.h);
    }


  }
}
let platformHeight = 10;
let platformFill='#a43f';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l){

    super(x,y,l,platformHeight);
    this.fill=platformFill;
  }

  display(){

    this.updateOnScreenPosition();
    if(this.screenPos!=false){

      ctx.fillStyle=this.fill;
      ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);
    }
  }
}
window.onload = start;
let currentLevel='start';
let killLine = 500;

function start(){

  loadSave();
  //pickNextLinkAward()
  fadeIn =0;
  createCanvas();
  setupActionBar();
  resizeCanvas();

  createLevel();
  createPlayer();
  setupCamera();
  loadModelData();

  startSound();
  setInterval( run, 33 );
}

function run(){

  if(currentLevel!='start'){
    let h = currentLevel=='home';
    cameraFollow(player.x,player.y);
    level1.displayBackground();
    if(!h) level1.display404Background();
    level1.displayPlatforms();
    if(h){
      runFriendlyNPCs();
    }
    else runExitDoor();

    updateEnemies();
    updatePlayer();
    updateProjectiles();
    runDialog();

    updateItems();

    runFadeIn();

    runProcessUI();
    runLinksUI();


  }
  else displayStartUI();

}


function runExitDoor(){
  exitdoor.display();
  enableInteraction(exitdoor,"press E to return home",exitDoorRange);

}
