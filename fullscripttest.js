
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
let bar = 1800;
let maxbars=16;

let startBeatMachine=()=>
  setInterval(newbar,bar);



let beatinput = [
  {vals:'x x 0 x xxx 0 x x x xxx x x',beatval:32,f:playHats}, //0
  {vals:'x  xx',beatval:8,f:playKick,v: 200,p:false},         //1
  {vals:'xoxxx',beatval:5,f:playSnare,p:false},               //2
  {vals:'',beatval:3,f:playBlaster,v:360,p:false},            //3
  {vals:'/  --',beatval:6,f:playWobbleBass,v: 0,p:false},     //4
  {vals:'',beatval:8,f:playHardHat,p:false},                  //5
  {vals:'  M   N',beatval:8,f:playNoiseySynth,v:0,p:false},   //6
  {vals:'MNRW  V  W  YZYW',beatval:16,f:playSine,v:0,p:false},//7
];

let bars=0;
let section=0;

function noteToFreq(note) {
  let a = 440; //frequency of A (coomon value is 440Hz)
  return (a / 32) * (2 ** ((note - 9) / 12));
}

function newbar(){
  /*
  switch(bars%8){
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

  if(random()>0.3&&bars%2==1){
    kick.vals = 'x  x  x x     x';
    kick.beatval=16;
  }
  else {
    kick.vals = 'x  xx';
    kick.beatval=8;
  }
}

if(section>=0){

  if(bars%2==0){
    snare.vals='x xxx'
    snare.beatval=5;
    hardhat.vals='xoooxooo';
  }else{
    snare.vals='x  x'
    snare.beatval=8;
    hardhat.vals='oxox0x0x';
  }
}


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
let canvas = {};
let ctx;
let camera = {};

// setupcamera()
//
// setup canvas since that is the "camera"
// initialize camera target position

let setupCamera=()=>{

  camera.target = {x:player.x,y:player.y};
  camera.w = canvas.w2;
  camera.h = canvas.h2;
  camera.speed = 24;
}

// camerafollow()
//
// set viewport target

let cameraFollow=(x,y)=>{

  y-=50;
  // move towards target
  reach(camera.target,{x:x,y:y},camera.speed);

  camera.left = camera.target.x-camera.w;
  camera.right = camera.target.x+camera.w;
  camera.top = camera.target.y-camera.h;
  camera.bottom = camera.target.y+camera.h;
}
let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;

function updateEnemies(){

  // if this is a level with enemies
  if(currentLevel!='home'&&currentLevel!='start'){
    // UPDATE ENEMIES:

    for(let i=enemies.length-1; i>=0; i--){
      // move and display enemy
      enemies[i].update();

      // if enemy killed:
      if(enemies[i].hitPoints<=0){

        // generate loot at enemy position and remove enemy
        generateLoot(enemies[i]);
        enemies.splice(i,1);

        // update level completion
        levelData.completion=Math.min(levelData.completion+5,100);
        //completions[level1.arrayindex]=levelData.completion;

        // start cleasing background
        level1.uncorrupting=true;
        // if level isn't complete yet, set timeout to stop cleansing
        // ( if level is complete, cleasing continues until done )
        if(levelData.completion<100)
          setTimeout(function(){level1.uncorrupting=false;},2000);
      }
    }


    // SPAWN ENEMIES:

    // phase 1,
    // when first enemy is killed:
    if(enemies.length==0&&!firstEnemyKilled){

      // update top platform, enable going down
      cantGoDown = false;
      let p = last(level1.platforms);
      p.fill = platformFill;

      // start level phase 2
      firstEnemyKilled = true;
    //  favoritesStatus[ favIndex() ] =
    //    "Unlocked. Difficulty: "+level1.enemyDifficulty;

      levelData.unlocked=true;
    }


    // phase 2,
    // while level isn't cleared
    if(firstEnemyKilled&&!level1.cleared){
      // if level isn't complete and there are less than the max number of enemies
      if(enemies.length<maxEnemies && levelData.completion<100){

        // spawn new enemy every 100 frames
        enemyUpdateCounter++;
        if(enemyUpdateCounter%100==0){
          // pick a random platform
          let pick= randInt(l(level1.platforms));
          let plat = level1.platforms[pick];
          // spawn enemy
          enemies.push(new Enemy(plat.x,plat.y-80,pick));
        }
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
    this.dashInterval = 20;
    this.nextDash=0;
    this.dashCount=15;
    this.facing='left';
    this.lastRoamingState=false;
    this.attackAnimOverTimeout;
    this.model = new CoolPath(0,0, edata);
    }

    update(){

      // ATTACK :

      // count frames
      this.attackCounter++;
      // get distance to player
      let d = distance(player.x,player.y,this.x,this.y);
      // when attack cooldown is over
      if(this.nextAttack<this.attackCounter){
        // if player is in range
        if(d.d<30&&player.currentPlatform==this.currentPlatform){
          // damage player
          damagePlayer(this.attackPower);
          // start attack animation
          this.animate(2);
          // set cooldown
          this.nextAttack = this.attackCounter+this.attackInterval;
          // reset enemy animation
          this.attackAnimOverTimeout=setTimeout(function(enemy){if(enemy.roaming)enemy.animate(1); else enemy.animate(0);},400,this);
        }
      }



      // UPDATE HEALTH :

      // regen health
      if(this.hitPoints<100) this.hitPoints+= 0.2;
      this.display();



      // MOVE :

      if(this.roaming){


        // DASH:

        // start dash
        if(
          player.currentPlatform==this.currentPlatform // player is on same platform
          &&this.nextDash<this.attackCounter // dash cooldown is over
          &&d.d<220 // player is in rangge
        ){
          // reset dash cooldown & counter
          this.nextDash = this.attackCounter+this.dashInterval;
          this.dashCount=0;

          // set target
          this.target = player.x - 30 + Math.random()*60;

          // start dash animation
          clearTimeout(this.attackAnimOverTimeout); // clear animation reset if active
          this.animate(3);
        }

        // start still animation if not moving
        else if(!this.lastRoamingState) this.animate(1);

        // if dashing
        if(this.dashCount<15){
          this.dashCount++;
          // update max speed
          this.lrMaxSpeed=7;
          // on dash end set animatino
          if(this.dashCount==15) this.animate(1);
        }
        // if not dashing, update max speed
        else this.lrMaxSpeed=2;

        // update position:

        // if target not reached, move right/left
        if(this.x+this.targetReachDistance<this.target) this.goRight();
        else if(this.x-this.targetReachDistance>this.target) this.goLeft();


        // if target reached :
        else {

          this.roaming = false;
          this.movingRight = false;
          this.movingLeft = false;

          // move up or down
          if(this.targetCounter%3==0){
            if(this.goalReachedAction=='up') this.jump();
            else if(this.goalReachedAction=='down') this.y+=4;
          }

          // start still animatino
          this.animate(0);

          // set new target and start roaming after a pause
          setTimeout(function(target){
            target.roaming = true;
            target.newTarget();
          },this.roamPauseLength, this)
        }
      }

      // if this guy is on screen, display model
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
      // get this enemy's current platform and player's current platform
      let p = level1.platforms[this.currentPlatform];
      let pp = level1.platforms[player.currentPlatform];

      // if enemy and player are on same platform
      if(p.y==pp.y)
        this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;

      else{
        // if this platform is lower

          let p1 = getBounds(p);
          let tarfound=false;
          for(let i=0; i<level1.platforms.length; i++){

            if(tarfound) return;
            let p2 = getBounds(level1.platforms[i]);
            let x=-1;
            let r=-1;

            if(p1.left>=p2.left&&p1.right<=p2.right){
              x=p1.left;
              r=p.w;
            }
            else if(p1.left<=p2.left&&p1.right>=p2.right){
              x=p2.left;
              r=level1.platforms[i].w;
            }
            else if(p2.right>=p1.left&&p2.right<=p1.right){
              x=p1.left;
              r=p2.left+level1.platforms[i].w - p1.left;
            }
            else if(p2.left>=p1.left&&p2.left<=p1.right){
              x=p2.left;
              r=p1.left+p.w-p2.left;
            }

            if(x!=-1){
              let diff = level1.platforms[i].y - p.y;
              if(this.y<player.y && diff>0 && diff < 150){
                console.log('moving down')
                tarfound=true;
                this.target = x+randInt(r);
                this.goalReachedAction='down'
              }
              else if(this.y>player.y && diff<0 && diff > -100){
                tarfound=true;
                this.target = x+randInt(r);
                this.goalReachedAction='up';
              }

            }

          }

          if(!tarfound) this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;
      }
    }


  }
  let aboutguy;

  function createFriendlyNPCs(){

    let pos = level1.platforms[level1.platforms.length-1];
    aboutguy=new MovingObject(pos.x+150,pos.y-30,20,'#22af');
  }


  function runFriendlyNPCs(){

    aboutguy.display();
    enableInteraction(aboutguy,"press E",50);
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
    setupCamera();

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

    if(player.impactForce>36){
      playDamageFX();

      playerModel.selectAnimation(1);
      setTimeout(function(){
        resetPlayerAnimation();
      },400)
    }

   aBar.health.innerHTML='health: '+Math.floor( player.hitPoints );
  }

  function resetPlayerAnimation(){
    if(playerMoving) playerModel.fullRig.selectAnimation(0);
    else playerModel.fullRig.selectAnimation(3);
  }

  function damagePlayer(damage){
    //console.log("player hit!");
    player.hitPoints -= damage;
    playDamageFX();

    playerModel.selectAnimation(1);
    setTimeout(function(){
      resetPlayerAnimation();
    },400)
  }
  let texts = [
    "Hmm? # Oh! You must be from the cleaning service. # Thank goodness you're here. # Our web page is being attacked by a mysterious slimey virus! # Our pages have been replaced by fake 404s, monsters and slime. # Yuck! It's revolting! Here, let me add our directory to your favorites.",
    "We must clear the virus from this website. # I suspect other infected files have been implanted in the servers. # Bring back any clues you might find and we'll track them down!",
    ];
    let dUI = {
      open: false,
      t: 0,
      counter:0,
      line:[],
      lineI:0,
      displayedText:""
    };

    let dialogNum =0;
    let dialogDone = false;
    let maxCharsPerLine = 20;


    // rundialog()
    //
    //

    let runDialog=()=>{

      if(dUI.open){

        if(dUI.t!=0){
          let p = getScreenPos({x:dUI.t.x,y:dUI.t.y,w2:50,h2:50});
          dUI.x = p.x;
          dUI.y = p.y - 70;
        }

        cFill('white');
        cRect(dUI.x,dUI.y,190,42);
        cFill('black');
        cFont('16px Courier New')
        cText(dUI.displayedText[0],dUI.x+5,dUI.y+18)
        cText(dUI.displayedText[1],dUI.x+5,dUI.y+36)
      }

      // if no one is interactible, close dialog ui (add any other interactible things here)
      if(!aboutguy.interactible) dUI.open=false;

    }


    // continuedialog()
    //
    //


    let continueDialog=()=>{

      // dialog over actions
      if(dialogDone){

        dUI.open = false;
        dialogDone = false;

        // trigger action.. so far there is only one.. should this be an if()?
        switch(dialogNum){
          case 0:
          for(let i=0; i<2; i++)
            newLevel(allLinkNames[i]);
          updateFavorites();
          break;
        }


        if(aboutguy.interactible&&dialogNum<texts.length-1) dialogNum ++;
      }
      else
        cutDialog();
    }


    // cutdialog()
    //
    //

    let cutDialog=()=>{

      let line1 = makeLine();
      let line2 = {t:""};
      if(!line1.stop) line2 = makeLine();

      dUI.displayedText=[line1.t,line2.t];
    }


    // makeline()
    //
    //

    let makeLine=()=>{

      let result="";
      let stop=false;
      let broke=false;
      while(!stop&&!broke&&result.length+dUI.line[0].length<maxCharsPerLine){

        if(dUI.line[0]=='#') broke=true;
        else result+=dUI.line[0]+" ";

        dUI.line.shift();
        if(dUI.line.length==0){
          stop=true;
          dialogDone = true;
        }
      }
      return {t:result,stop:stop};
    }

    // actionbutton()
    //
    // called when user presses action button. triggers dialog ui

    let actionButton=()=>{
      if(currentLevel=='home'&&aboutguy.interactible){

          if(!dUI.open){

            dUI.open=true;
            dUI.t=aboutguy;
            dUI.line = texts[dialogNum].split(" ");

            if(!revealedLink.includes('_'))
              pickNextLinkAward();

            cutDialog();
          }
          else continueDialog();
      }
    }
    let cantGoDown = false;

    function keypress(){
      if(!tFormSelected){
        switch(event.keyCode){

           //a
          case 65: player.goLeft(); break;

          //d
          case 68: player.goRight(); break;

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

          case 27: //escape
          dUI.open=false;
          break;
        }
      }
    }


    function keyrelease(){
      if(!tFormSelected){
        switch(event.keyCode){
          case 65: //a
            player.movingLeft=false;
          break;

          case 68: //d
            player.movingRight=false;
          break;
        }
      }

    }
    let mouseIsPressed = false;
    let mouseX =0;
    let mouseY =0;
    let cantShoot=false;

    const playerShotCooldown =200; //ms

    // mousepressed()
    //
    // triggered once when mouse is pressed

    let mousePressed=()=>{

      // get mouse data
      mouseIsPressed = true;
      mouseX = event.clientX-canvas.x;
      mouseY = event.clientY-canvas.y;

      // shoot
      if(currentLevel!='start'&&!cantShoot){
        // trigger sfx
        playBlaster(1800,3);
        // create projectile
        player.shoot(mouseX,mouseY,15);
        // trigger player animation
        playerModel.selectAnimation(4);

        // trigger cooldown and animation reset
        cantShoot=true;
        setTimeout(function(){
          resetPlayerAnimation();
          cantShoot=false;
        }, playerShotCooldown);
      }
    }


    // mouseReleased()
    //
    // called once when mouse is released

    let mouseReleased=()=> mouseIsPressed = false;

    let datastrip =0;

    // addloot()
    //
    // loot carried data and update word research

    let addLoot=()=>{

      // add data strip
      datastrip++;
      updateInv(datastrip);

      // if we have enough data strips, trigger research
      if(datastrip>dataCost){
        datastrip-=dataCost
        processDataStrips();
        updateInv(datastrip);
      }
    }


    // updateInv()
    //
    // updates inventory display

    let updateInv=(input)=>{
      let t = "";
      if(revealedLink!="") t=". Next url: "+revealedLink;
      aBar.inventory.innerHTML='data strips: '+input+' / '+dataCost;
      aBar.research.innerHTML=t;
    }
    let items = [];

    let generateLoot=(target)=>{

      let res = 5+randInt(15);

      for(let i=0; i<res; i++){

        items.push(new Item(target.x,target.y-50,10,'grey'));

        // apply force to item
        let j=items[items.length-1];
        j.impactForce.x = 6+randInt(12);
        if(Math.random()>0.5) j.impactForce.x*=-1;
        j.initJumpForce=11;
        j.jump();
      }
    }



    let updateItems=()=>{

      for(let i=items.length-1; i>=0; i--){
    //    console.log("hey")
        items[i].update();
        if(items[i].looted) items.splice(i,1);
      }
    }

    class Item extends MovingObject {

      constructor(x,y,size,fill){
        super(x,y,size,fill);
        this.looted = false;
        this.v=1;
      }

      update(){

        if(!this.looted){
          let d = distance(this.x,this.y,player.x,player.y);

          // item picked up
          if(d.d<10){ // set pickup range here
            this.looted = true;
            addLoot();
          }

          // item in player range
          else if(d.d<80){ // set pull range here
            this.v++;
            let r = this.v/d.d;

            this.x+=r*d.adj;
            this.y+=r*d.opp;
            this.fallSpeed=0;
          }
          else if(this.v>1) this.v--;

          this.display();
        }
      }
    }
    let ns1 = 58;
    let ns2 = 93;

    class CoolPath{
      constructor(x,y,data){
        this.x=x;
        this.y=y;
        this.cmess;
        this.scale = 1.5;
        this.colors = data.c;
        this.model=data.m;
        this.rig=data.r;
        this.animations=data.a;

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





    let cmess="";
    let segments = [];
    let riglength;

    function newSeg(t,charindex,ns){
      let p = {x:this.toNum(charindex,ns),y:this.toNum(charindex+1,ns)};
      segments.push({type:t,points:[p]});
    }

    function toNum(character,startnum){
      return cmess.charCodeAt(character)-startnum;
    }

    function isns1(message,charindex){
      return (message.charCodeAt(charindex)<ns2);
    }

    function toAngle(i){
      return 180*this.toNum(i,ns2)/30;
    }




    function unpackModelMessage(modeldata){

      let m = modeldata.split("*");
      let model = [];
      segments = [];

      // for each path
      for(let i=0; i<m.length; i++){

          cmess=m[i];
          segments = [];

          // check out characters by pair
          for(let j=5; j<m[i].length; j+=2){

              // if this point is part of a line
           if(toNum(j,0)<ns2) newSeg('L',j,ns1);

            // otherwise this point is part of a curve
            else{
              let sl=segments.length-1;

              if(sl>=0){
                // look at the current batch of points
                let s = segments[sl];
                // if they were part of a line, start a new curve
                if(s.type=="L") newSeg('C',j,ns2);
                // if instead we already have a curve going
                else {
                  // if it's not full, add a point
                  let p = s.points;
                    if(p.length<3) p.push({x:toNum(j,ns2),y:toNum(j+1,ns2)});
                    // if it is full start a new curve
                    else newSeg('C',j,ns2);
                }
              }
              // lastly if there was nothing in the list, add new curve entry
              else newSeg('C',j,ns2);

            }
          }

          model.push({
            shape:toNum(0,ns1),
            fill:toNum(1,ns1),
            stroke:toNum(2,ns1),
            origin:{x:toNum(3,ns1),y:toNum(4,ns1)},
            segments:segments
          });
      }

    return model;
    }

    function unpackRigMessage(rigdata){

      let rig=[];

      let m = rigdata;
      cmess=m;
      let counter=0;

      for(let i=0; i<m.length; i++){

        let r = rig[rig.length-1];

        if(counter==0) rig.push({origin:{x:toNum(i,ns1)},connections:[],isRoot:false});
        else if(counter==1) r.origin.y=toNum(i,ns1);
        else if (counter>2){

            let c = r.connections[r.connections.length-1];
            if(counter%3==0) r.connections.push({x:toNum(i,ns2)});
            else if(counter%3==1) r.connections[r.connections.length-1].y=toNum(i,ns2);
            else c.shape=toNum(i,ns2);

        }
        else if(counter==2&&m[i]=='1') r.isRoot=true;

        counter++;
        if(counter>2&&isns1(m,i+1)) counter=0;

      }
      riglength=rig.length;
      return rig;
    }

    function unpackAnimation(anim){

      let animations = [];
      cmess = anim;
      let m = anim;
      let done = false;
      let lastEnd=0;

      while(!done){

        let nameEnd = m.indexOf('*',lastEnd+1);
        let a={ name: m.substring(lastEnd+1,nameEnd) };
        a.animLength = toNum(nameEnd+1,ns1);

        let x = nameEnd+1+riglength;
        a.initVals = [];
        a.timeStamps = [];

        for(let i=nameEnd+2; i<x+1; i++){
          a.initVals.push( toAngle(i) );
        }

        lastEnd = x+1;
        for(let i=0; i<riglength; i++){

          a.timeStamps.push([]);
          let nextEnd = m.indexOf('*',lastEnd+1);
          let counter=0;

          for(let j=lastEnd+1; j<nextEnd; j++){
            let ts=a.timeStamps[ a.timeStamps.length-1];
            if(counter%2==0) ts.push( {rot: toAngle(j) } );
            else ts[ ts.length-1 ].time=toNum(j,ns1);
            counter++;
          }

          lastEnd = nextEnd;
          if(nextEnd==-1) done = true;
        }
        animations.push(a);
      }

     return animations;
    }
    let playerModel;
    let monsterModel;

    let edata={
      m:unpackModelMessage(":=:=Febqfmnnqlsht`y^o`i*;<:HGsgn_j`a`cmkj*<<:JBW@v]j^ld*=<:JBW@vmnklg*>::JFGI^^^_`_*?=:TPwororsrxwvws*@=:OUrrwtvw*@<:STzxzzvyozrzrx*A=:OProwowsvwrxrs*B=:STwtrrrx*B<:STzxzzvyozrzrx*<<:NAPDRATCV@*;;:H@mhfifefbiakc*;=:ECfgfchcjbkghf"),
      r:unpackRigMessage("CK1iiagtbctdEB0I@0IC0FF0lc_lf`he^QN0tucQR0QN0tueQR0"),
      a:unpackAnimation("*still*Z]]]]Y]]]]*****\\I*XI*YIaQ***walk*F]]]]`Qh]]*****\\@*c@*W@*N@**attack*Fa]]]]RdXa*c<e>**S<]>*`<]>*W<^>*N<S>*d<_>*X<d>*o<j>*dash*R`]]]]PeQs*`F*^L*TL\\N*jL\\N*c@\\FWL^N*a@PF^L*k@fF*S@QFOL*c@sF^L"),
      c:["rgba(142,203,0,0.0)","rgba(255,232,200,1.0)","rgba(177,91,0,1.0)","rgba(247,141,0,1.0)"]
    }

    let pdata = {
      m:unpackModelMessage(":;:JFHF*;;:PAo^e^fffppnqf*<<:DQip`hmkqmqulv*<=:DQexjylv*=>:=H_ddcckdmaq`k*>=:?L_mciepjpfubo*?>:@Hdmaq`k_ddcck*@=:?L_mciepjpfubo*A=:TJvirktntqzswm*B;:SNUOTRzuyvvvSQ*C=:QKrkviwmzstqtn*D;:SNUOTRzuyvvv*;=:PCrhojpfnjlimfEB*B=:SNsoylxr*D=:SNsoylxr*@;:@REONTOSKPloiogp@O*@:<@RFNNS"),
        r:unpackRigMessage("HM1nm`jwdkp_hwffmbHG0HM0kj^>D0bma?J0>D0bmc?J0RI0vpeSM0RI0vpgSM0"),
        a:unpackAnimation("*run*L^]]S]WV^^f**ZC**C*SC*cC*]C*`C*eC*VC*]C*gethit*F]]]]]]]]]]]*U=*Z=_B**H=XB*U=OB*T=aB*U=RB*a=[B*g=bB*n=^B*_=iB*fall*RbZ]YZlSQ]W]*]CbK*[CUK*]K*QCWK*^K*kCiK*[C[K*NCRK*kCaK*LC[K*jC`K*nothing*R]\\]Z]Y]Z_[^**_E**]E*VE*\\E*WE*****shooting*F]]]]]_[]]]]*[<*X<**W<*L<*U<*T<*_<*[<*_<*"),
        c:["rgba(254,255,247,0.0)","rgba(0,0,0,1.0)","rgba(255,154,33,1.0)","rgba(53,77,230,1.0)","rgba(240,112,0,1.0)"]
    }
    function loadModelData(){
      /*
      playerModel = new CoolPath(0,0,
        ":;:CEhbnemiIIBI*:<:JFOGIH*:=:FEifkfkh*;>:ACcfcgdg*<<:IIIKOI*=;:JOodgcfgdicrdr*><:JMiojmnnlnknnolokomp*>;:IGltilij*?<:FIeleiijgjgjikgkgkil*?;:EDhhfpeg*@;:OGntgjji*A;:BHfdd`bk*B;:DCeocnee*C;:EQhlfkft*D;:FAjmhigd",
          "EG0jb^lk_@>0JJ0EO0he]fgdlhfGH0DE0JI1nj`kmapnbBA0ckeBC0DK0gtgEA0",
          "*walking*R]]]]dW]^]\\Z*Z;^>^D*_=]@*]HbL]O*\\D*[?fEYKgR*`?VEaKXR**`?`E_M*bEZM*Z?YE[M*XE^M*still*Z]]]]]]]]]]]*\\@_L[T**]@`C]K*\\@**]@\\P**`@`E]P*a@bE*X@XE\\P*X@YE",
          ["rgba(197,119,0,0.0)","rgba(58,0,121,1.0)","rgba(255,127,62,1.0)","#ffff","rgba(2,0,4,1.0)"]);
          */

          playerModel = new CoolPath(0,0,pdata );
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

      goLeft(){
        this.movingRight = false;
        this.movingLeft = true;
        this.facing="left";
      }

      goRight(){
        this.movingRight = true;
        this.movingLeft = false;
        this.facing="right";
      }

      display(){

        this.moveLeftRight();
        this.applyPhysics();
        this.position();
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

      position(){

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
    class Projectile extends MovingObject{

      constructor(x,y,size,fill, speed,targetx,targety){
        super(x,y,size,fill);
        this.destroyed = false;

        this.y-=20;
        this.position();

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

          this.position();
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

              playBlaster(200,6,);
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

    //localStorage.removeItem(saveDataHeader);
      saveData=JSON.parse(localStorage.getItem(saveDataHeader));

      // if there is no save data, setup a save data object
      if(saveData==null){
        newGameSave();
      }
      else console.log("Loaded Save")
    }

    // newgamesave()
    //
    // resets the save game data
    function newGameSave(){

      console.log("new save")
      saveData = {
        levels:[],
      }
    }

    window.onbeforeunload=saveGame;
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

      canvas.c = document.createElement("canvas");
      canvas.c.setAttribute("width",canvas.w);
      canvas.c.setAttribute("height",canvas.h);



      //canvas.c.setAttribute("style",``);
      ctx = canvas.c.getContext("2d");


    }

    window.onresize=resizeCanvas;
    function resizeCanvas(){


    }
    let seedL=100; // seed length: number of chars in a seed string
    let maxchar=100; // maxchar: range of useable charcodes
    let charStart = 128; // start index for charcode assignment
    let ncount=0; // counter to increment 'noise'



    // random()
    //
    // generates a noise-like random number by looking up a table of randomly generated values

    let random=()=>{
      // increment ncount
      ncount+=0.7;
      // store noise value at integer before ncount
      let val = noiz( flo(ncount),currentLevel );

      // return lerp to noise value at integer after ncount
      return (ncount%1)*(noiz( Math.ceil(ncount),currentLevel )-val)+val;
    }

    // noiz()
    //
    // get 'random' value from a given character in a seed string

    let noiz=(val,seed)=>
    ( levelData.seedData.charCodeAt( val % seedL )-charStart )/maxchar;


    // setuprandomseed()
    // create a random strings to be used as seed value for the noiz() function
    // this is called when a new level is discovered

    let setupRandomSeed=(index)=>{

        let r="";
        for(let i=0; i<seedL; i++)
          r+= String.fromCharCode( charStart+randInt(maxchar) );

        return r;
    }
    let constrain=(input,min,max)=> Math.min(Math.max(input, min), max);

    let checkCollision=(bounds1,bounds2)=> (
        oneDintercept(bounds1.left,bounds1.right,bounds2.left,bounds2.right)
      &&  oneDintercept(bounds1.top,bounds1.bottom,bounds2.top,bounds2.bottom)
    );


    let oneDintercept=(l1,r1,l2,r2)=> ( r1>=l2 && r1<=r2 ) || ( l1>=l2 && l1<=r2 ) || ( l1<=l2 && r1>=r2 );

    let getScreenPos=(input)=> {
      return {
          x: canvas.w2 + input.x-camera.target.x - input.w2,
          y: canvas.h2 + input.y-camera.target.y - input.h2
        }
    }

    let distance=(x1,y1,x2,y2)=>{
      let adj=x2-x1;
      let opp=y2-y1;
      return{
        d:Math.sqrt( adj*adj+opp*opp ),
        adj:adj,
        opp:opp
      }
    }

    let getBounds=(el)=> {
      return {
          left:el.x-el.w2,
          right:el.x+el.w2,
          top:el.y-el.h2,
          bottom:el.y+el.h2
        }
    }


    let div=(box,color)=>{
      let result = document.createElement("div");
      document.body.appendChild(result);
      if(box!=undefined) setStyle(result,box,color);
      return result;
    }

    let setStyle=(el,box,color)=>
      el.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${color};`);


    let rad=(angle)=>angle*Math.PI/180;

    let l=(i)=> i.length;

    let randInt=(max)=>flo(Math.random()*max);

    let flo=(i)=> Math.floor(i);


    // reach()
    //
    // move an object obj{x,y} towards target tar{x,y} at speed vel

    let reach=(obj,tar,vel)=>{
      if(obj.x+vel<tar.x) obj.x+=vel;
      else if(obj.x-vel>tar.x) obj.x-=vel;
      else obj.x=tar.x;

      if(obj.y+vel<tar.y) obj.y+=vel;
      else if(obj.y-vel>tar.y) obj.y-=vel;
      else obj.y=tar.y;
    }

    // return the last element in an array
    let last=(arr)=> arr[arr.length-1];


    //islevel()
    //
    // checks if this level is already part of save data
    let isLevel=(name)=>{
      let s=saveData.levels;
      for(let i=0; i<s.length; i++){
        if(s[i].name==name) return i;
      }
      return -1;
    }

    let pointTo=(id)=>document.getElementById(id);


    let cFill=(input)=> {
      ctx.fillStyle=input;
    }
    let cText=(input,x,y)=> {
      ctx.fillText(input,x,y);
    }
    let cFont=(input)=> {
      ctx.font=input;
    }
    let cRect=(x,y,w,h)=> {
      ctx.fillRect(x,y,w,h);
    }
    let aBar = {};
    let aBarFill = 'black';

    function setupActionBar(){

      aBar= {
        x:canvas.x,
        y:canvas.y+canvasElh,
        w: canvas.w,
        h: 20,
      }

        aBar.el = div(aBar,aBarFill);

        aBar.w*=0.2;
        aBar.health = div(aBar,'grey');

        aBar.x+=aBar.w;
        aBar.inventory = div(aBar,'grey');

        aBar.x+=aBar.w;
        aBar.w*=2;
        aBar.research = div(aBar,'grey');

        aBar.x+=aBar.w;
        aBar.w/=2;
        aBar.save = div(aBar,'grey');

    }

    function aBarEl(){
      return div(aBar,'grey');
    }
    let waittime=5;


    // runfadein()
    //
    // called in main loop. handles fading screen from black.

    let runFadeIn=()=>{

      let fact =1;
      if(fadeIn>waittime) fact = 1-(fadeIn-waittime)/30;

      if(fact>0){
        ctx.fillStyle='rgba(0,0,0,'+fact+')';
        ctx.fillRect(0,0,canvas.w,canvas.h);
      }

      fadeIn++;
    }


    // fade()
    //
    // trigger fading screen from black over a given number of frames

    let fade=(time)=>{
      fadeIn =0;
      waittime=time;
    }
    let addbar;
    let textform;
    let listform;
    let levelData;

    let addressbar=()=>{

      addbar = div();
      addbar.style.width=canvas.w+'px';
      addbar.style.backgroundColor='grey'

      updateFavorites();

      document.body.appendChild(canvas.c);
      let b = canvas.c.getBoundingClientRect();
      canvas.x = Math.round(b.x);
      canvas.y = Math.round(b.y);

    }

    // formkeydown()
    //
    // called on keydown in the text input form

    let formKeyDown=()=>{
      // if ENTER is pressed
      if(event.keyCode==13){
        textform.value = textform.value.trim();
        goToLink();
        textform.blur();
      }
    }

    // inpulistchanged()
    //
    // called when item from the select list is chosen

    let inputListChanged=()=>{
      let v = listform.value;
      textform.value=v.substring(0,v.indexOf(" "));
      goToLink();
    }

    // setuplevel()
    //
    // called when a level is loaded.
    // check if level is part of save data. make a new level if not.

    let setupLevel=()=>{

      let islevel=isLevel(currentLevel);

      // if level already exists, point current level to save data
      if(islevel!=-1) levelData = saveData.levels[islevel];

      // if level doesn't exist
      else {

        // setup new level data.
        newLevel(dif);
        // point to this level to load it next
        levelData=last(saveData.levels);
      }
    }


    // newlevel()
    //
    // adds a new level to the game without starting it

    let dif=0;
    function newLevel(name){

      if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0)
      dif = Math.min(enemyDifficulty+1,maxEnemyDifficulty);
      lvlCount++;

      if(name==undefined) name=currentlevel;
      saveData.levels.push({
        name:name,
        seedData:setupRandomSeed(),
        completion:0,
        difficulty:dif,
        unlocked:false,
        cleared:false
      });
    }

    // saveleveldata()
    //
    // save current level progression

    function saveLevelData(){

      console.log('save level data')
      if(currentLevel!='home'&&currentLevel!='start'){
        let i = isLevel(currentLevel);

        console.log("is level result "+ i)
        saveData.levels[i].completion = levelData.completion;
        saveData.levels[i].unlocked = levelData.unlocked;
        saveData.levels[i].cleared = levelData.cleared;
      }
    }

    // gotolink()
    //
    // called when you press go or hit enter in the text box

    function goToLink(){

      let v = listform.value;
      let tv = textform.value;

      if(currentLevel=='start'){
        if(tv=="home"){
          loadHomeLevel();
          return
        }
        if(tv=="new"){
          newGameSave();
          loadHomeLevel();
          return
        }
      }
      else

      if(saveData.levels.length!=0){

        // save current level
        if(levelData!=undefined) saveLevelData();
        // default target link is select form value
        if(v!='home') currentLevel  = v.substring(0,v.indexOf(" "));
        else currentLevel='home';
        // if text form input is different, then chose text form instead.
        if(tv!=v&&tv!="") currentLevel = tv;
        // if user guessed the current research link, get new research link
        if(currentLevel==nextLink) pickNextLinkAward();
        // if target is a start screen command
        if(currentLevel=='home') loadHomeLevel();

        // if target isn't home screen
        else {
          // setup and start level
          fade(24);
          setupLevel();
          createLevel();
          createPlayer();
        }
      }
    }



    let loadHomeLevel=()=>{
      currentLevel='home';
      createLevel();
      createPlayer();
      fade(8);
    }

    let allLinkNames = ["contact","store","gallery","news","events","wormhole","destroy","noob","rekt","acidpool","badfile"];
    let nextLink = "";
    let revealedLink = "";
    let revealedChars =0;
    let dataCost = 10; // cost to uncover url bits


    // processdatastrips()
    //
    // reveal letters from the mystery word

    let processDataStrips=()=>{

      // if next link isn't defined,
      // pick next link award :
      if(nextLink=="") pickNextLinkAward();



      // reveal url:

      // pick a character that isn't revealed yet
      let rl=revealedLink.length;
        let pick = randInt(rl);
        while(revealedLink[pick]!="_"){
          pick = randInt(rl);
        }

        // update revealed link:
        // add a new character in the middle
        if(pick<nextLink.length-1)
          revealedLink = rSub(0,pick)+nextLink[pick]+rSub(pick+1,rl);
          // or at the end
        else revealedLink = rSub(0,pick)+nextLink[pick]

        revealedChars++;

        // if this url is complete, add it to levels list
        if(revealedChars==rl){
          newLevel(nextLink);
          updateFavorites();
          // reset link so that a new award is found next time about
          nextLink="";
        }
    }

    // rSub()
    //
    // returns part of var revealedLink

    let rSub=(i,j)=> revealedLink.substring(i,j);

    // randomlink()
    //
    // returns a random link from the list of all links heck yeah

    let randomlink=()=> allLinkNames[randInt(allLinkNames.length)];


    // picknextlinkaward()
    //
    // setup the next url to research

    let pickNextLinkAward=()=>{

      // pick a url that hasn't been used yet
      let pick = randomlink();
      if( saveData.levels.length<allLinkNames.length )
        while(isLevel( pick )!=-1)
          pick = randomlink();

      // or if no more urls are available make up a random word
      else{
        let wordL = 4+randInt(4);
        pick="";

        for(let i=0; i<wordL; i++)
          pick+= String.fromCharCode(97+randInt(26));
      }

      // setup new mystery url
      nextLink = pick;
      revealedLink = "";
      revealedChars =0;
      for(let i=0; i<nextLink.length; i++){
        revealedLink+="_";
      }
    }

    let displayStartUI=()=>{

      cFill('white');
      cRect(0,0,canvas.w,canvas.h);
      cFill('black');
      cText("sam's js13k game",50,50);
      cText("type 'home' in the address bar above to continue saved game,",50,65);
      cText("or type 'new' to start a new game.",50,80);
    }
    let tFormSelected = false;

    // updatefavorites();
    //
    // populate the Select element that contains the favorites list
    let updateFavorites=()=>{

      // setup options text
      let options = `<option> home </option>`;
      if(currentLevel=='start'&&saveData.levels.length==0) options='';

      for(let i=0; i<saveData.levels.length; i++){
        let j=saveData.levels[i];
        options+=`<option>${j.name} difficulty: ${j.difficulty}</option>`
      }
      // setup favorites text
      let fav = `favorites:<select id="favorites" onchange=inputListChanged()> ${options} </select>`

      // setup address bar
      addbar.innerHTML = ` <span onclick='back()'> < </span> <span onclick='forward()'> > </span>
      www.coolshoes.com/<input type='text' id='tinput' onkeydown='formKeyDown()'></input>
      <span onclick='goToLink()'>go</span>
      ${fav}  `;

      // pointto() is short for getdocbyid() lol
      textform=pointTo("tinput");
      listform=pointTo("favorites");
      // disable player inputs when typing in text form
      textform.onfocus=()=>tFormSelected=true;
      textform.onblur=()=>tFormSelected=false;

      saveGame();
    }

    let back=()=>console.log("back");
    let forward=()=>console.log("forward");
    let level1;

    let sceneW=0;
    let fadeIn =0;
    let enemies = [];
    let lvlCount=0;
    let enemyDifficulty=1;
    let lvlDiffIncreaseInterval = 3;
    let maxEnemyDifficulty =3;
    let platInterval = 65;
    let maxExtraPlatW = 150;
    let minPlatW = 50;
    // a place to setup some platforms and stuff

    let basicLevel=()=>{
      level1=new Level( [
        [50,killLine-100,100],
        [-60,killLine-60,100],
        [0, killLine, canvas.w]
      ], sceneW, 100);
    }

    let randPlat=(x)=> Math.min( minPlatW + random()*maxExtraPlatW , (sceneW-x)/2 );

    // createlevel()
    //
    // create level object design platforms

    let createLevel=()=>{

      // reset level variables
      noiseCounter=0
      enemies = [];
      items = [];

      firstEnemyKilled = false;
      sceneW = canvas.w;
      cantGoDown = false;

      if(currentLevel=='home'){

        basicLevel();
        createFriendlyNPCs();
      }
      else if(currentLevel=='true404'){

        basicLevel();
        let p=last(level1.platforms);
        level1.text404 = new DisplayObject( p.x-10, p.y-10,300,300 );

      }
      else {

        sceneW = 2*canvas.w;
        let plats = [[0,killLine,sceneW]]; // starting platform (bottom)
        let platCount = 5+flo(random()*8); // number of platforms

        // first platform config
        let y = killLine;
        let x = (-sceneW/2+random()*sceneW)*0.6;
        let w = randPlat(x);

        // create platforms :

        for(let i=0; i<platCount-1; i++){

          // alternate platform max width
          if(i%4==2) maxExtraPlatW = 300;
          else maxExtraPlatW = 40;
          // increment platform height
          y-= platInterval;

          // create platform
          plats.push([x,y,w]);

          // pick which x-direction to offset next platform
          let xdir = flo( random()*3 )-1;
          if(x<-50||x>50){
            let x2=sceneW/2-x;
            xdir = Math.abs(x2)/x2;
          }
          // setup next platform coords
          x += xdir*flo( random() * 60 );
          w = randPlat(x);
        }


        let plat = last(plats);
        plat[0] = sceneW/8;
        plat[2] = sceneW*1.2;
        level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));

        plat=last(level1.platforms);

        level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );

      //  let index = saveData.seedIndex.indexOf(currentLevel);
        level1.enemyDifficulty = levelData.difficulty; //difficultyLevels[index];
        //level1.arrayindex=index;
        //level1.completion= levelData.completion; //completions[index];
        level1.cleared = levelData.cleared;//clearedStates[index];

        // check if top platform is already unlocked
        if(levelData.unlocked){
          firstEnemyKilled = true;
          cantGoDown=false;
        }
        else{
          cantGoDown = true;
          plat.fill = 'orange'
          enemies.push(new Enemy(plat.x,plat.y-80,level1.platforms.length-1));
          enemies[0].jumpy=false;
        }
      }

      updateFavorites();
    }


    let linestyle=(c,a,w)=>{
      ctx.strokeStyle=c+a;
      ctx.lineWidth = w;
    }

    class Level{

      constructor(plist,w,h){
        let bgurl='index.html';
        if(currentLevel!='home')
          bgurl='js/characters/enemyclass.js';

          fetch(bgurl)
          .then(response => response.text())
          .then(text => this.bgText=text);

        this.unbg = [];
        this.uncorrupting=false;
        this.platforms = [];
        this.bgFill='#ddff';

        for(let i=0; i<plist.length; i++)
          this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2]));

        this.walls=[
          new DisplayObject( - 0.75*w, 0, w/2, 2000 ),
          new DisplayObject( w*0.75, 0, w/2, 2000 ),
          new DisplayObject( 0, killLine+500, 2000, 1000 )
        ];

        this.bgTxt = new DisplayObject(w/2,this.platforms[0].y+h,w*2,h*4);
      }


      displayBackground(){

        cFill(this.bgFill);
        cRect(0,0,canvas.w,canvas.h);
        this.bgTxt.position();

        if(this.bgTxt.screenPos!=false){
          cFont('30px Arial');

          // if uncorrupting is active, add indices to uncorrupted bg array
          if(this.uncorrupting){
            let index=randInt(6000);
            let r=randInt(20);
            for(let i=0; i<r; i++)
              if(!this.unbg.includes(index+i)) this.unbg.push(index+i);
          }

          let counter=0;
          let r = -1+randInt(3);

          for(let i=0; i<50; i++){

            let alphaval = 'f';
            if(i<10) alphaval=i;
            let x=this.bgTxt.screenPos.x;
            let txtcontent=this.bgText.substring(i*120,(i+1)*120);

            for(let j=0; j<120; j++){
              // if uncorrupted
              if(currentLevel=='home'||this.unbg.includes(counter))
                lineStyle('#bbb',alphaval,2);
                // if corrupted
              else lineStyle('#bdb',alphaval,12+r)

              ctx.strokeText(txtcontent[j],(x),(this.bgTxt.screenPos.y+i*50)/2);
              counter++;
              x+=ctx.measureText(txtcontent[j]).width*1.2;
            }
          }
          ctx.lineWidth = 1;
        }
      }

      display404Background(){
        this.text404.position();
        cFont('100px Georgia');
        cFill('black');
        cText("404",this.text404.screenPos.x,this.text404.screenPos.y);
        cFont('30px Georgia');
        cText("return to last page...",this.text404.screenPos.x,this.text404.screenPos.y+50);
      }

      displayPlatforms(){

        for(let i=0; i<this.platforms.length; i++)
          this.platforms[i].display();

        cFill('black');
        for(let i=0; i<this.walls.length; i++){
          let w = this.walls[i];
          w.position();
          let p = w.screenPos;
          if(p!=false)
           ctx.fillRect(p.x,p.y,w.w,w.h);
        }
      }

      displayCompletion(){
        let t = levelData.completion+"% complete";
        cFont("40px bold");
        cFill('black');
        cText( t, 10,30 );
        cFill('white');
        cText( t, 12,32 );
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

        this.position();
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
      addressbar();

      setupActionBar();
      resizeCanvas();

      // buffer models
      loadModelData();

      startSound();

      // start main loop
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

        updateEnemies();
        updatePlayer();
        updateProjectiles();
        runDialog();

        updateItems();

        runFadeIn();

        //runProcessUI();

        if(!h) level1.displayCompletion();

      }
      else displayStartUI();

    }
