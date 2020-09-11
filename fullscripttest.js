
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

let preloadSound=(f,envelope,cycles,func,sliding)=>{

  let result = [];

  let length = samprate * ( envelope.a+envelope.d+envelope.r );
  let freq = samprate / f;
  let preBuffL = flo(freq)*cycles; // length of prebuffer in samples
  let dividor = freq / twoPI;

  // preload a cycle
  let prebuffer = [];
  if(sliding==undefined){
    for(let i=0; i<preBuffL; i++)
      prebuffer.push( func(i,dividor) );

    // load full sound
    for (let i = 0; i < length; i++)
      result[i] = 0.4* envelope.level(i) * prebuffer[i%preBuffL];
  }
  else {
    for (let i = 0; i < length; i++)
      result[i] = 0.4* envelope.level(i) * func(i,dividor+i*sliding);
  }


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
//  {vals:' x x',beatval:4,f:playCash,p:true}
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
else{
  beatinput[4].vals=""
  beatinput[3].vals=""
}




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
    let t = .15;
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
  let textSpawnerGuy;
  let enemyShooterDamage = 10;

  let updateEnemies=()=>{

    // if this is a level with enemies
    if(currentLevel!='home'&&currentLevel!='start'){
      // UPDATE ENEMIES:

      for(let i=enemies.length-1; i>=0; i--){
        // move and display enemy
        enemies[i].update();
        enemies[i].limitX();

        // if enemy killed:
        if(enemies[i].hitPoints<=0){

          // if this is a regular level
          if(directorylevels.includes(currentLevel)){
            if(enemies.length==1){

              // if level isn't cleared yet, add a new section
              if(levelData.sections<levelData.difficulty){
                levelData.sections++;
                continueLevel(true);
              }

              else if(!level1.cleared){
                // if level is "cleared"
                levelData.cleared=true;
                level1.clearLevel();
                // add the text spawner thingy
                level1.addSpawner2();
                updateFavorites();
              }

            }
            // if enemy is killed while spawner2 is out and active
            else if(level1.cleared&&!level1.cleared2)
              generateLoot(enemies[i]);
          }
          // if this is a boss level
          else{
            level1.clearLevel();
            levelData.cleared=true;
            saveData.bossProgress++;
            updateFavorites();
          }

          poof(enemies[i].x,enemies[i].y,[enemies[i].model.colors[0]]);
          enemies.splice(i,1);
        }
      }
    }
  }


  let poof=(x,y,colors)=>
    generateLoot({x:x,y:y},true, colors);



  class Enemy extends MovingObject {

    constructor(x,y,p,sIndex,type){
      let mratio = 1.4;
      let size = 60;
      if(type=="boss"){
        mratio = 3;
        size = 100;
      }
      super(x,y,size,"#cc30");
      this.type=type;
      this.lrMaxSpeed=3;

      this.roamCount=0;
      this.dashing=false;

      this.currentPlatform=p;
      this.attackCounter=0;
      this.nextAttack=0;

      // shooting interval
      this.attackInterval=25;
      if(type=='boss') this.attackInterval=12;

      this.facing;
      this.attackPower = 20;

      this.facing='left';
      this.attackAnimOverTimeout;
      this.doneSpawning=false;

      if(type=='spawner2')  pickNextLinkAward();

      if(type=='spawner'||type=='spawner2'){
        this.model = new CoolPath(0,0, s1data, 2);
        this.model.fullRig.selectAnimation(0);
      }
      else   this.model = new CoolPath(0,0, edata, mratio);

        if(type=='shooter') this.model.colors[0] = "#8a8f";
        if(type=='fighter') this.model.colors[0] = "#88af";

      // spawner variables

      this.sIndex=sIndex;
      this.spawnInterval=200;
      this.spawnCounter=0;
      this.enemyCount=0;

      this.nextSpawn=0;

      this.unlockdist=0;
      this.unlocked=false;
      this.spawner2interval=150;
      this.spawner2text="";
    }

    updateSpawner(){
    let p=  this.display();
    if(p!=false){
      this.model.x=this.screenPos.x+20;
      this.model.y=this.screenPos.y+20;
      this.model.update(ctx,false);
    }
     this.spawnCounter++;

    }

    updateSpawner2(){
    let p=  this.display();
    let t,c;
    if(p!=false){

      if(this.unlocked&&this.unlockdist<20) this.unlockdist+=2;
      ctx.save();
      ctx.strokeStyle='black'
      ctx.lineWidth='10'

      ctx.translate(p.x,p.y);


      ctx.beginPath();
      ctx.fillRect(0,0,10,-this.unlockdist)
      ctx.arc(30, 0-this.unlockdist, 25, Math.PI,0);
      ctx.stroke();


      cRect(0,0,60,40,'blue');
      cRect(3,12,54,20,'white');

      for(let i=0; i<revealedLink.length; i++){
        t=revealedLink[i];
        c='black';
        if(t=="_"){
          t = String.fromCharCode( 48+ randInt( 74 ) );
          c='grey'
        }

      //  cRect(p.x + i*10,p.y,40,'blue');
        cText( t,i*6+4,25,c,12);
      }

      for(let i=0; i<dataCost; i++){
        if(i<datastrip%dataCost) cFill("white");
        else cFill('grey');
        cRect(i*5,35,4,4);
      }
      ctx.restore();
    }
     this.spawnAtInterval();
    }



    spawnAtInterval(){
      this.spawnCounter++;
      if(!this.doneSpawning
        &&this.spawnCounter%this.spawner2interval==0) this.spawnOne();
    }

    spawnMore(){
      for(let i=0; i<3; i++)
        this.spawnOne();
    }

    spawnOne(){
      let choice='fighter'
      if(Math.random()>0.5) choice='shooter';

      enemies.push(new Enemy(
        this.x - 100 + randInt(200),
        this.y-80,this.currentPlatform,
        this.sIndex,
        choice
      ));
    }



    update(){

      if(this.type=='spawner'){
        this.updateSpawner();
        return
      }
      else if(this.type=='spawner2'){
        console.log('eyy')
        this.updateSpawner2();
        return
      }

      this.display();


      if(this.screenPos!=false){


        // count frames
        this.attackCounter++;
        // get distance to player
        let d = distance(player.x,player.y,this.x,this.y);
        this.roam(d);

        if(this.type=='fighter'){
          // trigger attack when player is at a certain distance
          this.fight(d);
          // move randomly on a platform or up/down towards player
          //this.roam(d);
        }

        else if(this.type=='shooter'){
          this.enemyShooter(d);

        }
        else if(this.type=='boss'){
          this.fight(d);
          this.enemyShooter(d);
        }


        // regen health
        if(this.hitPoints<100) this.hitPoints+= 0.2;

        //display model
        this.model.x=this.screenPos.x+20;
        this.model.y=this.screenPos.y+20;
        this.model.update(ctx,(this.facing=='left'));

      }
    }



    enemyShooter(d){

      if(this.nextAttack<this.attackCounter){
        // if player is in range
        if(d.d<200&&player.y>this.y-100&&player.y<this.y+100){

          playBlaster(800,1);
          this.shoot(player.screenPos.x,player.screenPos.y,10,true);
          // start attack animation
          this.animate(1);
          // set cooldown
          this.nextAttack = this.attackCounter+this.attackInterval;
          // reset enemy animation
          this.resetEnemyAnim();
        }
      }

    }

    resetEnemyAnim(){
      this.attackAnimOverTimeout=setTimeout(function(enemy){enemy.animate(0);},400,this);
    }

    fight(d){
      // ATTACK
      // when attack cooldown is over
      if(this.nextAttack<this.attackCounter){
        // if player is in range
        if(d.d<30&&player.y>this.y-50&&player.y<this.y+50){
          // damage player
          damagePlayer(this.attackPower);
          // start attack animation
          this.animate(1);
          // set cooldown
          this.nextAttack = this.attackCounter+this.attackInterval;
          // reset enemy animation
          this.resetEnemyAnim();
        }
      }
    }

    dash(){

      this.dashing=true;
      this.lrMaxSpeed=6;
      setTimeout(function(tar){ tar.lrMaxSpeed=3; }, 2000, this );
      setTimeout(function(tar){ tar.dashing=false; }, 4000, this );
    }

    roam(d){

      if(this.roamCount%50==0){
        if(player.x<this.x) this.goLeft();
        else this.goRight();
    //    console.log(d)
        if(player.y<this.y)
          if(d.d<150) this.jump();
        else if(!this.dashing&&d.d<200) this.dash();
      }
      this.roamCount++;
    }

    animate(index){
      clearTimeout(this.attackAnimOverTimeout);
      this.model.selectAnimation(index);
    }



  }
  let aboutguy;

  let createFriendlyNPCs=()=>{

    let pos = level1.platforms[level1.platforms.length-1];
    aboutguy=new MovingObject(pos.x+150,pos.y-30,20,nocolor);
  }

  let lastaboutstate=false;
  let aboutguytalking=false;
  let runFriendlyNPCs=()=>{

    aboutguy.display();
    enableInteraction(aboutguy,"press E",80);
    if(aboutguy.screenPos!=false){
    //  edata.fullRig.
    aboutModel.x=aboutguy.screenPos.x+8;
    aboutModel.y=aboutguy.screenPos.y-4;
      aboutModel.update(ctx,false);

      if(!dUI.open&&lastaboutstate){

        aboutguytalking = false;
      }
      else if(dUI.open&&!lastaboutstate){

        aboutguytalking=true;

        aboutGuyTalk();
      }
    }

    lastaboutstate=dUI.open;
  }

  let agTalkTimeout;
  let agTalkCounter=8;
  let aboutGuyTalk=()=>{

    let l = 60+randInt(140)
    let t = undefined;
    let filt = 1200;
    let freq = 400+randInt(50);
    //if(Math.random()<0.3&&agTalkCounter==1) l*=4;
    if(Math.random()<0.8){
      t = -0.0001*randInt(50);
      filt = 200;
    }


    if(Math.random()<0.8)
    play(freq,0.01*randInt(3),0.11,0.3,l/1100,10,constSine3,4,'highpass',filt,3,t);
  //  else aboutModel.fullRig.selectAnimation(0);
    agTalkCounter--;

    if(aboutguytalking&&agTalkCounter>0){
      aboutModel.fullRig.selectAnimation(1);
      agTalkTimeout=setTimeout(aboutGuyTalk, l);
    }
    else aboutModel.fullRig.selectAnimation(0);

  }


  let enableInteraction=(npc, text, range)=>{

    if(npc.screenPos!=false){
      let d = distance(player.x,player.y,npc.x,npc.y);
      if(d.d<range){

        npc.interactible = true;

        let p = npc.screenPos;
        ctx.fillText(text,p.x+25,p.y-40,'black',10);
      }
      else npc.interactible = false;

    }
    else npc.interactible = false;
  }
  let player;


  let createPlayer=()=>{

    let pos = level1.platforms[level1.platforms.length-1];
    if(currentLevel=='home') pos=level1.platforms[0]
    else pos.x-= 130;
    player=new MovingObject(pos.x,pos.y-100,50,'#2a20');
    player.initJumpForce=40;
    player.facing='left';
    player.jetFuel=100;
    player.gunPower=100;
    setupCamera();
    player.display();
  }

  let  playerMoving;
  let lastPlayerMovingState=false;
  let playerJumping=false;
  let fuelcost=7;
  let shotcost=38;
  let mcounter=0;
  let wcounter=0;
  let dY=0;

  let fuelregen;
  let amnoregen;

  let updatePlayer=()=>{

    player.limitX();

    // add jetpack force
    if(player.jetpacks&&player.jumpForce<10){
      if(player.jetFuel>=fuelcost){
        player.jetFuel-= fuelcost;
        player.jumpForce=10;
      }
      else{
        cantjetpack=true;
        setTimeout(function(){cantjetpack=false;},500);
        player.jetpacks=false;
      //  player.jumpForce=0;
      }
    }


    // damp jetpack force
    else if(player.jumpForce>0) player.jumpForce-=4;
    else player.jumpForce=0;
    player.display();


    playerMoving=false;

    if(player.movingLeft||player.movingRight) playerMoving=true;
    dY = 0;
    if(playerMoving&&player.jumpForce==0&&player.fallSpeed==0){
      let d = Math.cos(mcounter);
      dY = 2+d*d*7;
      mcounter+=  0.2*Math.PI

      wcounter++;
    }
    if(playerMoving||wcounter%5!=0){
      wcounter++;
      if(wcounter%5==0&&player.jumpForce==0&&player.fallSpeed==0) playHop2();
    }



    playerModel.x=player.screenPos.x+20;
    playerModel.y=player.screenPos.y+14-dY;

    if((player.jumpForce>0||player.fallSpeed>0)&&!playerJumping){

      playerJumping=true;
      playerModel.fullRig.selectAnimation(5);

      //console.log("jump")
    }
    else if(player.jumpForce==0&&player.fallSpeed==0&&playerJumping){
    //  console.log('jump over')
      playerJumping=false;
      resetPlayerAnimation();
    }
    else if(playerMoving&&!lastPlayerMovingState) resetPlayerAnimation();
    else if(!playerMoving&&lastPlayerMovingState){
      resetPlayerAnimation();
      playHop2();
    }
    lastPlayerMovingState=playerMoving;

    playerModel.update(ctx,(player.facing=='left'));
    if(player.hitPoints<100) player.hitPoints+=0.1;



   //aBar.health.innerHTML='health: '+Math.floor( player.hitPoints );

   if(player.hitPoints<=0){
     loadHomeLevel();
     fade(60,'ouchies');
   }


   if(awarded('r3')) amnoregen =3;
   else amnoregen=2;

   player.gunPower = Math.min( player.gunPower+amnoregen, 100 );

   if(awarded('r2')) fuelregen =3;
   else fuelregen=2;

   if(!cantjetpack)
    player.jetFuel = Math.min( player.jetFuel+fuelregen, 100 );
  }

  let resetPlayerAnimation=()=>{
    if(player.jumpForce>0||player.fallSpeed>0) playerModel.fullRig.selectAnimation(4);
    else if(playerMoving) playerModel.fullRig.selectAnimation(2);
    else playerModel.fullRig.selectAnimation(0);
  }

  let damagePlayer=(damage)=>{
    //console.log("player hit!");

    if(awarded('r4')) damage*=0.6;

    player.hitPoints -= damage;
    playDamageFX();

    playerModel.selectAnimation(4);
    setTimeout(function(){
      resetPlayerAnimation();
    },400)
  }
  let texts = [

    "Hmm? # Oh! You must be from the cleaning service. # Thank goodness you're here. # Our web page is being attacked by a mysterious virus! # Our pages have been replaced by fake 404s full of monsters. # Yuck! It's revolting! Here, let me add our directory to your favorites.",
    "what's up ",  //1
    "hey", //2
    "dope",  //3

  "wee! you cleared a page, good job. see how it was added to your favorites. now go clean more!",

    "that's 2 pages! nice job dude. here's a boost for your *****",//5
    "that's 4 pages! nice job dude. here's a boost for your *****",//6
    "that's 6 pages! nice job dude. here's a boost for your *****",//7
    "almost there guy! go to those boss files and rek whatever creature you might find!", //7

  "wow you killed a boss dude heres yourd reward",//9\
  "wow thats the second and last boss gj dude u done", //10
  "thanks for playing sam thanks you now play more", //11

  "haha yaa go champ", //12
  "you want a tip # ... # get a job", //\13
  "sup"  //14
    ];
    let dUI = {
      open: false,
      t: 0,
      counter:0,
      line:[],
      lineI:0,
      displayedText:""
    };

    let dialogDone = false;
    let maxCharsPerLine = 20;


    // rundialog()
    //
    //

    let runDialog=()=>{

      if(dUI.open){

        if(dUI.t!=0){
          let p = getScreenPos({x:dUI.t.x,y:dUI.t.y,w2:50,h2:50});
          dUI.x = p.x - 50;
          dUI.y = p.y - 110;
        }

        cFill('white');
        cRect(dUI.x,dUI.y,250,50);
        cFill('black');
        cFont(20)
        cText(dUI.displayedText[0],dUI.x+5,dUI.y+20)
        cText(dUI.displayedText[1],dUI.x+5,dUI.y+40)
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
        let p = saveData.gameProgress;
        // trigger action.. so far there is only one.. should this be an if()?


        switch(saveData.textProgress){
          case 0:
          for(let i=0; i<2; i++)
            newLevel(allLinkNames[i]);
          updateFavorites();
          p.push('start');
          break;
        }



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

            pickDialog();
            dUI.line = texts[saveData.textProgress].split(" ");

            if(!revealedLink.includes('_'))
              pickNextLinkAward();


            cutDialog();
          }
          else continueDialog();

          agTalkCounter=6+randInt(9);
          clearTimeout(agTalkTimeout);
          aboutGuyTalk();
      }
    }

    let pickDialog=()=>{
      let p = saveData.gameProgress;
      let d = saveData.directoryProgress;
      let b = saveData.bossProgress;
      let notdone=false;
      let r = 0;
      if(awarded('start')) {
        if(b==0&&b==0)
          r = 1+randInt(3);

        else if(b>0){
          if(!awarded('r4')){
            p.push('r4');
           r=9;
          }
          else if(b>1)
            r=10;

          else {
            if(b==1) notdone=true;
            else r=11;
          }
        }

        if(d>0||notdone){

          if(d==1){
            r=4;
          }
          else if(d>1&&!awarded('r1')){
            p.push('r1')
            r=5;
          }

          else if(d>3&&!awarded('r2')){
            p.push('r2')
            r=6;
          }

          else if(d>5&&!awarded('r3')){
            p.push('r3')
          r=7
          }
          else if(d==7)
            r = 8;

          else
           r = 12+randInt(3);





        }
      }

      saveData.textProgress=r;
    }

    let awarded=(name)=> saveData.gameProgress.includes(name)
    let cantGoDown = false;
    let cantjetpack=false;
    let jetkeypressed=false;

    let keypress=()=>{
      if(!tFormSelected){
        switch(event.keyCode){

           //a
          case 65: player.goLeft(); break;

          //d
          case 68: player.goRight(); break;

          case 32: //space
          if(!jetkeypressed){
            jetkeypressed=true;

            if(!player.jetpacks&&player.jumpForce<8&&player.fallSpeed<4){
              playHop(300);
              player.jump();
            }
            if(!cantjetpack)
              player.jetpacks=true;
          }


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


    let keyrelease=()=>{
      if(!tFormSelected){
        switch(event.keyCode){
          case 65: //a
            player.movingLeft=false;
          break;

          case 68: //d
            player.movingRight=false;
          break;

          case 32:
          player.jetpacks=false;
          jetkeypressed=false;
           break;
        }
      }

    }
    let mouseIsPressed = false;
    let mouseX =0;
    let mouseY =0;
    let cantShoot=false;


    // mousepressed()
    //
    // triggered once when mouse is pressed

    let mousePressed=()=>{

      // get mouse data
      mouseIsPressed = true;
      mouseX = event.clientX-canvas.x;
      mouseY = event.clientY-canvas.y;

      // shoot
      if(currentLevel!='start'&&!cantShoot&&player.gunPower>=shotcost){

        player.gunPower-=shotcost;
        // trigger sfx
        playBlaster(1800,3);
        // create projectile
        player.shoot(mouseX,mouseY,25,false);
        // trigger player animation
        if(player.movingRight||player.movingLeft) playerModel.selectAnimation(3);
        else playerModel.selectAnimation(1);

        // trigger cooldown and animation reset
        cantShoot=true;
        setTimeout(function(){
          resetPlayerAnimation();
          cantShoot=false;
        }, 250);


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

      if(!textSpawnerGuy.doneSpawning){
        // add data strip
        datastrip++;
        updateInv(datastrip);
        playCash();
        // if we have enough data strips, trigger research
        if(datastrip>dataCost){
          datastrip-=dataCost
          processDataStrips();
          updateInv(datastrip);
        }
      }

    }


    // updateInv()
    //
    // updates inventory display

    let updateInv=(input)=>{

    //  aBar.inventory.innerHTML='data strips: '+input+' / '+dataCost;
    //  aBar.research.innerHTML=t;
      textSpawnerGuy.spawner2text = revealedLink;
    }
    let items = [];

    let generateLoot=(target,poofy,colors)=>{

      let res = 5+randInt(15);
      let fill = 'grey';

      //console.log("poof!", colors,i)

      //console.log(color)
      for(let i=0; i<res; i++){

        if(colors!=undefined) fill= colors[ randInt(colors.length) ];

        if(poofy!=undefined) items.push(new Item(target.x,target.y-50,8,fill,true));
        else items.push(new Item(target.x,target.y-50,10,fill));


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
        if(items[i].looted||(items[i].poofy && items[i].pfact>30)) items.splice(i,1);

      }
    }

    class Item extends MovingObject {

      constructor(x,y,size,fill,poofy){
        super(x,y,size,fill);
        this.size=size;
        this.looted = false;
        this.v=1;
        if(poofy!=undefined){
          this.poofy=true;
          this.pfact=0;
        }
      }

      update(){
        if(this.poofy){
          this.pfact++;
        }
        else if(!this.looted){
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

        }
        let p=this.display();
        if(p!=false) cRect(p.x,p.y,this.size,this.size,this.fill);
      }
    }
    let ns1 = 58;
    let ns2 = 93;

    class CoolPath{
      constructor(x,y,data,scale){
        this.x=x;
        this.y=y;
        this.cmess;
        this.scale = 1.5;
        if(scale!=undefined) this.scale*=scale;
        this.colors = [];
        for(let i=0; i<data.c.length; i++){
          this.colors[i] = data.c[i];
        }
        this.model=data.m;
        this.rig=data.r;
        this.animations=data.a;

        for(let i=0; i<this.rig.length; i++){
          if(this.rig[i].isRoot) this.fullRig = new RigShape(i,this.scale,this.model,this.rig,this.animations,this.colors);
        }
        this.selectAnimation(1);
        this.counter=0;


      }

      selectAnimation(index){
        this.pose=index;
        this.fullRig.selectAnimation(index);
      }

      update(context,flipped){

        this.fullRig.updateRotationValues();
        ctx.translate(this.x,this.y);
        if(flipped) ctx.scale(-1,1);
        this.fullRig.display(ctx);
        ctx.resetTransform();

        this.counter++;
        if(this.counter>this.animations[this.pose].animLength) this.counter=0;
      }

    }

    class RigShape{

      constructor(index,scale,m,r,a,c){
        //  // console.log(animShapes[index])
        // get origin from animShape index
        this.colors=c;
        this.rig = r;
        this.animations=a;
        this.sIndex=index;
        this.origin={ x:r[index].origin.x*scale, y:r[index].origin.y*scale };
        this.rotation =0;
        this.paths = [];

        this.counter=0;

        for(let i=0; i<m.length; i++){
          // create path from model save data
          if(m[i].shape==index){

            let o=m[i].origin;
            let x=o.x*scale;
            let y=o.y*scale;
            let path = `M ${x} ${y} `;
            let s = m[i].segments;

            for(let j=0; j<s.length; j++){

              path+=s[j].type+" ";
              let p = s[j].points;

              for(let k=0; k<p.length; k++){
                x=p[k].x*scale;
                y=p[k].y*scale;
                path+=`${x} ${y} `;
              }
            }
            this.paths.push({path:new Path2D(path),stroke: m[i].stroke, fill: m[i].fill});
          }

        }

        // create pins from animshape index
        this.pins=[];
        for(let i=0; i<r[index].pins.length; i++){
          let p = r[index].pins[i];
          this.pins.push({
            shape:new RigShape( p.shape,scale,m,r,a,c),
            x: p.x*scale,
            y: p.y*scale
          });
        }
      }

      selectAnimation(index){
        this.pose=index;
        for(let i=0; i<this.pins.length; i++)
          this.pins[i].shape.selectAnimation(index);
      }
      updateRotationValues(){
        // if time is 0, rotations = initial values
        if(this.counter==0) this.rotation= this.animations[this.pose].initVals[this.sIndex];
        else this.rotation = this.getRotFromTimeStamps();

        for(let i=0; i<this.pins.length; i++)
          this.pins[i].shape.updateRotationValues();

        this.counter++;
        if(this.counter>this.animations[this.pose].animLength) this.counter=0;
      }

      // context must be specified since this is used in both
      // the rig editor's and the anim editor's canvas.
      display(c){
        c.save();
        c.rotate(rad(this.rotation));
        c.translate(-this.origin.x,-this.origin.y)

        // display all paths in this shape
        for(let i=0; i<this.paths.length; i++){
          // set style
        //  cFill(this.colors[this.paths[i].fill]);
        //  c.fill(this.paths[i].path);

          // draw stroke if there is stroke
        //  let s=this.colors[this.paths[i].stroke];
        //  if(s!=nocolor){
      //  c.strokeWeight='4px'
            c.strokeStyle=this.colors[this.paths[i].stroke];
            c.lineWidth='2'
            c.stroke(this.paths[i].path);
        //  }
        }

        // + display any pins
        for(let i=0; i<this.pins.length; i++){
          c.save();
          c.translate(this.pins[i].x,this.pins[i].y);
          this.pins[i].shape.display(c);
          c.restore();
        }
        c.restore();
      }

      // getgotfromtimestamps()
      //
      // calculates this rig shape's rotation value according to time stamps

      getRotFromTimeStamps(){


        // get list of time stamps for this shape
        let p=this.animations[this.pose];
        let stamps = p.timeStamps[this.sIndex];

        // if this shape has time stamps
        if(stamps.length>0){

          // check each time stamp related to this shape
          for(let i=0; i<stamps.length; i++){
            // if current time is less than this stamp's time,
            // then stamps[j] is the stamp we are working towards.
            if(this.counter<=stamps[i].time){
              setlast(0,0)
              let s = stamps[i-1]
              // get time between last stamp and this next stamp:
              if(i>0) setlast(s.time,s.rot);
              else setlast(0,p.initVals[this.sIndex]); //if last stamp was the initval
              // calculate rotation:
              return this.lerprot(stamps[i].time,stamps[i].rot);
            }
          }
            // case in which there are no more stamps ahead (work back to initval)
            let s = last(stamps);
            setlast(s.time,s.rot);
            return this.lerprot(p.animLength,p.initVals[this.sIndex]);
        }
        else return this.animations[this.pose].initVals[this.sIndex];
      }

      lerprot(t,r){
        return lastp.r + (this.counter-lastp.t)/(t-lastp.t) * (r - lastp.r);
      }
    }

    let lastp;
    let setlast=(t,r)=> lastp={t:t,r:r};

    let cmess="";
    let segments = [];
    let riglength;

    let newSeg=(t,charindex,ns)=>
      segments.push({type:t,points:[{x:toNum(charindex,ns),y:toNum(charindex+1,ns)}]});


    let toNum=(character,startnum)=>
      cmess.charCodeAt(character)-startnum;


    let isns1=(message,charindex)=>
      (message.charCodeAt(charindex)<ns2);

    let toAngle=(i)=>
      180*toNum(i,ns2)/30;





    let unpackModelMessage=(modeldata)=>{

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
              let p = s.points;
              // if they were part of a line, start a new curve
              if(s.type=="L") newSeg('C',j,ns2);
              // if instead we already have a curve going
              else {
                // if it's not full, add a point
                if(p.length<3) p.push({x:toNum(j,ns2),y:toNum(j+1,ns2)});
                else newSeg('C',j,ns2); // if it is full start a new curve
              }
            }
            // lastly if there was nothing in the list, add new curve entry
            else newSeg('C',j,ns2);

          }
        }

        let  stroke = toNum(2,ns1);
        if(stroke>99) stroke/=100;
        model.push({
          shape:toNum(0,ns1),
          fill:toNum(1,ns1),
          stroke:stroke,
          origin:{x:toNum(3,ns1),y:toNum(4,ns1)},
          segments:segments
        });
      }

      return model;
    }

    let unpackRigMessage=(rigdata)=>{

      let rig=[];

      let m = rigdata;
      cmess=m;
      let counter=0;

      for(let i=0; i<m.length; i++){

        let r = rig[rig.length-1];

        if(counter==0) rig.push({origin:{x:toNum(i,ns1)},pins:[],isRoot:false});
        else if(counter==1) r.origin.y=toNum(i,ns1);
        else if (counter>2){

          let c = r.pins[r.pins.length-1];
          if(counter%3==0) r.pins.push({x:toNum(i,ns2)});
          else if(counter%3==1) r.pins[r.pins.length-1].y=toNum(i,ns2);
          else c.shape=toNum(i,ns2);

        }
        else if(counter==2&&m[i]=='1') r.isRoot=true;

        counter++;
        if(counter>2&&isns1(m,i+1)) counter=0;

      }
      riglength=rig.length;
      return rig;
    }

    let unpackAnimation=(anim)=>{

      let animations = [];
      cmess = anim;
      let m = anim;
      let done = false;
      let lastEnd=0;

      while(!done){

        let nameEnd = m.indexOf('*',lastEnd+1);
        let a={ name: m.substring(lastEnd+1,nameEnd) };
        a.animLength = toNum(nameEnd+1,ns1);
      //  console.log(a.animLength)
        let x = nameEnd+1+riglength;
        a.initVals = [];
        a.timeStamps = [];

        for(let i=nameEnd+2; i<x+1; i++){
          a.initVals.push( toAngle(i) );
        //  if(cmess[i]=='\\') i++;
        }

        lastEnd = x+1;
        for(let i=0; i<riglength; i++){

          a.timeStamps.push([]);
          let nextEnd = m.indexOf('*',lastEnd+1);
          if(nextEnd==-1){
            nextEnd=m.length;
            done=true;
          }
          let counter=0;

          for(let j=lastEnd+1; j<nextEnd; j++){
            let ts=a.timeStamps[ a.timeStamps.length-1];
            if(counter%2==0) ts.push( {rot: toAngle(j) } );
            else ts[ ts.length-1 ].time=toNum(j,ns1);
            counter++;
          }

          lastEnd = nextEnd;

        }
        animations.push(a);
      }

      return animations;
    }
    let playerModel;
    let monsterModel;
    let aboutModel;
    let nocolor="#0000"
    //let enemyhead=":=:=Febqfmnnqlsht`y^o`i*;<:HGsgn_j`a`cmkj*<<:JBW@v]j^ld*=<:JBW@vmnklg*>::JFGI^^^_`_*";
    // enemy data
    let edata={
      m:unpackModelMessage(":;:HVDOhgkaskooniqikklinf*;;:AETMQOQL*<;:AGOMOKML*=;:FAHJEOIP*>;:FAHJEOIP"),
      r:unpackRigMessage("GQ1im^in_jx`kxaAE0AG0FA0FA0"),
      a:unpackAnimation("*run*F^]]hQ*\\@*[@*[@*R@*j@*eat*F]]]iS*W<\\@*X<]@TB*c<]@eB*Q@*j@*fall*PbZ^QP*_C*YC*ZC*QC*TC"),
      c:["#eccf",nocolor]
    }

    let abdata={
      m:unpackModelMessage(":;:GRKPCI*;;:LAJEJIHI*<;:LAJEJIHI*=;:AOLK*>;:BBMI*?;:OHBDechdghidkeji*@;:BEOI"),
      r:unpackRigMessage("GR1ku^iu_fl`LA0LA0AO0onaMI0eebeecBD0BD0"),
      a:unpackAnimation("*still*PVcgd]WX*[D*]D*dD*YD*eD*QD*YD*talk*FZadcZXX*XC*aC*fC*a>c@eC*]>Z@\\C*R>W@SC*\\>W@[C"),
      c:["#ada",nocolor]
    }

    //abdata.a[0].animLength=32;
    let s1data = {
      m:unpackModelMessage(":;:SDH<>CHKSDSPHX>P>JHRSKNNNGC?M@CGCT>P>C*;;:HDHL*<;:KJFE*<;<GDibbhhi*<;<LItmosmn"),
      r:unpackRigMessage("HL0HE1ki]kg_HH0"),
      a:unpackAnimation("*ya*J]]]*[D**yB*"),
      c:["#dcd",nocolor,"rgba(174,44,0,1.0)"]
    }


    let pdata = {
      m:unpackModelMessage(":;ŦBALDnjijlfhifhhe*;;<FGJH*<;<FHJI*:;>GJfoblfe*=;>GOFJGB*>;>EFH@*?;ĂEFGM*@;>EFH@*A;ĂEFGM*B;ĂHEJLIOMO*C;ĂHEJLIOMO*D;ŦFNJLHNHKNS"),
      r:unpackRigMessage("DH0ij^ik_FG0FH0FJ1kc]geamfchpekpfH@0hibEF0H@0hidEF0jpgHE0HE0GM0"),
      a:unpackAnimation("*still*PZ]]]X]XS]]W*]E*YH*^H**ZE*YE*ZE*****shoot*B]]]]a[N_]]`*_<*W>*`>*[<*j<*]<*N<*[<*e<*`<*V<*run*D\\]]]e]TPhW_*Y?***^?*O?*T?*e?*`?*T?*i?*R?*runshot*D]]]]h]LdiU]****Y?*N?**P?*S?*W?*m?**gethit*JS]]bd^mdmH]*I=*W=*b=**M=*Y=*@=WA*U=JA*p=MA*a=_A**jump*V]]]`_a`V[Z]*[?***c?*M?*W?*G?**M?*L?*\\?"),
      c:["rgba(0,0,0,1.0)",nocolor,"rgba(249,79,0,1.0)","rgba(138,131,248,1.0)","rgba(247,185,0,1.0)"]
    }
    let loadModelData=()=>{
      /*
      playerModel = new CoolPath(0,0,
      ":;:CEhbnemiIIBI*:<:JFOGIH*:=:FEifkfkh*;>:ACcfcgdg*<<:IIIKOI*=;:JOodgcfgdicrdr*><:JMiojmnnlnknnolokomp*>;:IGltilij*?<:FIeleiijgjgjikgkgkil*?;:EDhhfpeg*@;:OGntgjji*A;:BHfdd`bk*B;:DCeocnee*C;:EQhlfkft*D;:FAjmhigd",
      "EG0jb^lk_@>0JJ0EO0he]fgdlhfGH0DE0JI1nj`kmapnbBA0ckeBC0DK0gtgEA0",
      "*walking*R]]]]dW]^]\\Z*Z;^>^D*_=]@*]HbL]O*\\D*[?fEYKgR*`?VEaKXR**`?`E_M*bEZM*Z?YE[M*XE^M*still*Z]]]]]]]]]]]*\\@_L[T**]@`C]K*\\@**]@\\P**`@`E]P*a@bE*X@XE\\P*X@YE",
      ["rgba(197,119,0,0.0)","rgba(58,0,121,1.0)","rgba(255,127,62,1.0)","#ffff","rgba(2,0,4,1.0)"]);
      */

      playerModel = new CoolPath(0,0,pdata,1.5);
      playerModel.selectAnimation(1);

      aboutModel=new CoolPath(0,0,abdata,2);

      aboutModel.selectAnimation(0);
    }
    const friction=2;

    class MovingObject extends DisplayObject {// extends display object class
      constructor(x,y,size,fill){
        super(x,y,size,size);
        this.fill=fill;
        // parameters
        this.hasGravity=true; // object falls if true
        this.fallAcc=2; // fall acceleration
        this.lrMaxSpeed=12; // max horizontal speed
        this.lrAcc=1; // horizontal acceleration
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
        this.jetpacks=false;

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
        let p=this.position();
        if(this.hitPoints<100)
            this.displayHealthBar();

        return p;
      }

      displayHealthBar(){
        progressBar(
          this.screenPos.x,this.screenPos.y-35,30,10,
          this.hitPoints,'red','white' );
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
            if(this.lrSpeed+friction<0) this.lrSpeed+=friction;
            else if(this.lrSpeed-friction>0) this.lrSpeed -= friction;
            else this.lrSpeed=0;
          }

          // handle knockback
          if(this.impactForce.x-1>0) this.impactForce.x--;
          else if(this.impactForce.x+1<0) this.impactForce.x++;
          else this.impactForce.x=0;

          this.x += this.lrSpeed + this.impactForce.x;

        }



      applyPhysics(){

        // check if falling
        this.updateFallSpeed();

        if(this.jumpForce-this.jumpDecel>0) this.jumpForce-=this.jumpDecel;
        else this.jumpForce=0;
        // update player position
        if(this.jetpacks) this.fallSpeed=0;
        this.y+= this.fallSpeed - this.jumpForce;
      }

      updateFallSpeed(){

        let p=level1.platforms;
        let nearestPlatform =killLine;

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
          this.fallSpeed = 0;
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
        // if object is on screen, then update screen pos.
        if( checkCollision(getBounds(this),camera) ) this.screenPos = getScreenPos(this);
        // if it is offscreen screenpos is false.
        else this.screenPos = false;
        return this.screenPos;
      }

      limitX(){
        this.x = Math.min(Math.max(this.x,-sceneW/2),sceneW/2);
      }

      shoot(targetx,targety,speed,hitsplayer){

        if(targetx<this.screenPos.x) this.facing='left';
        else this.facing='right';
        projectiles.push(new Projectile(this.x,this.y,6,"green",speed,targetx,targety,hitsplayer));
      }
    }
    class Projectile extends MovingObject{

      constructor(x,y,size,fill, speed,targetx,targety,hitsplayer){
        super(x,y,size,fill);

        this.hitsplayer=hitsplayer;
        this.destroyed = false;

        this.y-=20;


        let p = this.position();
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
          cFill('#4a8f');
          let p=this.position();
          this.size=10;
          if(p!=false){


              if(!this.hitsplayer){
                this.checkForCollisions(level1.platforms,false);
                this.checkForCollisions(enemies,25);
                cFill(this.fill);
                this.size=4;
              }

              else
                if(checkCollision(getBounds(this),getBounds(player))){
                  this.stopProjectile();
                  this.bump(player,8)
                  playDamageFX();
                  damagePlayer(enemyShooterDamage);
                }

            this.checkWallCollisions();
            let i = this.lifeTimer%6;
            cRect(p.x-i,p.y-i,this.size+2*i,this.size+2*i);
            cFill('white');
            cRect(p.x,p.y,this.size,this.size);

          }
        }
        else{
          let p=this.display();
          if(p!=false) cRect(p.x,p.y,this.size,this.size,'white');
        }

      }

      checkWallCollisions(){
        if(this.x<-sceneW/2
        || this.x>sceneW/2){
          this.stopProjectile();
        }
      }

      checkForCollisions(input,damage){
        for(let i=0; i<input.length; i++){


          if( checkCollision(getBounds(input[i]),getBounds(this)) ){

            this.stopProjectile();

            // if an enemy is hit
            if(damage!=false){
              // apply damage boost
              if(awarded('r1')) damage*=2;

              if(input[i].type=='spawner'){
                input[i].hitPoints =0;
                input[i].spawnMore();
              }
              else if(input[i].type!='spawner2'){
                this.bump(input[i],4);
                input[i].hitPoints -= damage;
              }

              playBlaster(200,6,);

            }
          }
        }
      }

      bump(input,d){
        input.impactForce.x+=Math.min(Math.max(input.x-this.x,-d),d);
      }

      stopProjectile(){
        this.speedVect.x=0;
        this.speedVect.y=0;
        this.destroyed = true;
      }
    }
    let projectiles = [];

    let updateProjectiles=()=>{

      for(let i=projectiles.length-1; i>=0; i--){
        projectiles[i].updateProjectile();
        if(projectiles[i].lifeTimer>50){
          projectiles.splice(i,1);
        //  console.log("projectile ded")
        }
      }
    }
    let saveData = null;
    let loadSave=()=>{

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
    let newGameSave=()=>{

      console.log("new save")
      saveData = {
        levels:[],
        textProgress:0,
        directoryProgress:0,
        bossProgress:0,
        gameProgress:[]
      }
    }

    window.onbeforeunload=saveGame;
    let saveDataHeader='sams404gameforjs13kof2020';


    let saveGame=()=>
      localStorage.setItem(saveDataHeader, JSON.stringify(saveData));
      let canvasElw;
      let canvasElh;

      let createCanvas=()=>{
        canvas.w = 800;
        canvas.h = 600;
        canvas.w2=canvas.w/2;
        canvas.h2=canvas.h/2;

        canvas.c = document.createElement("canvas");
        canvas.c.setAttribute("width",canvas.w);
        canvas.c.setAttribute("height",canvas.h);



        //canvas.c.setAttribute("style",``);
        ctx = canvas.c.getContext("2d");

        ctx.filter = 'contrast(1.5) drop-shadow(1px 1px 2px #000)';
      }
      /*
      window.onresize=resizeCanvas;
      function resizeCanvas(){


      }
      */
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

      let progressBar=(x,y,w,h,val,c,c2)=>{
        cFill(c2)
        cRect(x,y,w,h);
        cFill(c)
        cRect(x,y,w*val/100,h);
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
        let xReached=false;
        let yReached=false;
        if(obj.x+vel<tar.x) obj.x+=vel;
        else if(obj.x-vel>tar.x) obj.x-=vel;
        else{
          obj.x=tar.x;
          xReached=true;
        }

        if(obj.y+vel<tar.y) obj.y+=vel;
        else if(obj.y-vel>tar.y) obj.y-=vel;
        else{
          obj.y=tar.y;
          yReached=true;
        }
        if(xReached&&yReached) return true;
        return false;
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
      let cText=(input,x,y,c,f)=> {
        if(c) cFill(c);
        if(f) cFont(f);
        ctx.fillText(input,x,y);

      }
      let cFont=(input)=> {
        ctx.font=input+'px Courier New';
      }
      let cRect=(x,y,w,h,c)=> {
        if(c) cFill(c);
        ctx.fillRect(x,y,w,h);
      }
      let waittime=5;


      // runfadein()
      //
      // called in main loop. handles fading screen from black.

      let runFadeIn=()=>{

        let fact =1;
        if(fadeIn>waittime) fact = 1-(fadeIn-waittime)/30;

        if(fact>0){
          cRect(0,0,canvas.w,canvas.h,'rgba(0,0,0,'+fact+')');
          cText(fadetxt,canvas.w/2-30,canvas.h/2-2,'white',20);
        }

        fadeIn++;
      }

      let fadetxt='';
      // fade()
      //
      // trigger fading screen from black over a given number of frames

      let fade=(time,text)=>{
        fadeIn =0;
        waittime=time;
        if(text!=undefined) fadetxt=text;
        else fadetxt='';
      }
      let addbar;
      let textform;
      let listform;
      let levelData;

      let addressbar=()=>{

        addbar = div();
        let t = addbar.style;
        t.width=canvas.w+'px';
        //t.height='50px'
        t.backgroundColor='grey'
        t.display='flex';
        t.flexDirection='row';
        t.justifyContent='space-around'

        updateFavorites();

        document.body.appendChild(canvas.c);
        let b = canvas.c.getBoundingClientRect();
        canvas.x = Math.round(b.x);
        canvas.y = Math.round(b.y);

      }


      // setuplevel()
      //
      // called when a level is loaded.
      // check if level is part of save data. make a new level if not.

      let setupLevel=()=>{

        let islevel=isLevel(currentLevel);
        console.log(islevel,currentLevel)
        // if level already exists, point current level to save data
        if(islevel!=-1) levelData = saveData.levels[islevel];

        // if level doesn't exist
        else {
          console.log("new level data")
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
      let newLevel=(name)=>{

        blingFavorites();
        // setup level difficulty
        if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0)
        dif = Math.min(enemyDifficulty+1,maxEnemyDifficulty);
        lvlCount++;

        if(name==undefined) name=currentlevel;
        saveData.levels.push({
          name:name,
          seedData:setupRandomSeed(),
          difficulty:1+flo(lvlCount/2),
          cleared:false,
          cleared2:false,
          sections:0
        });
      }

      // saveleveldata()
      //
      // save current level progression

      let saveLevelData=()=>{
        if(currentLevel!='home'&&currentLevel!='start'){
          let i = isLevel(currentLevel);
          saveData.levels[i].cleared = levelData.cleared;
          saveData.levels[i].cleared2 = levelData.cleared2;
          saveData.levels[i].sections = levelData.sections;
        }
      }

      // gotolink()
      //
      // called when you press go or hit enter in the text box

      let goToLink=()=>{

        // get favorites selection
        let v = listform.value;

        // if user selected home
        if(v=="home"){
          loadHomeLevel();
          updateFavorites();
          return
        }
        // if this is start page and user selects new game
        else if(currentLevel=='start'&&v=="new"){
          newGameSave();
          loadHomeLevel();
          updateFavorites();
          return
        }
        // otherwise if this is a level
        else if(saveData.levels.length!=0){
          // save current level
          if(levelData!=undefined) saveLevelData();
          currentLevel  = v.substring(0,v.indexOf(" "));
          // setup and start level
          fade(24);
          setupLevel();
          createLevel();
          createPlayer();
        }
      }



      let loadHomeLevel=()=>{
        currentLevel='home';
        createLevel();
        createPlayer();
        fade(8);
      }
      let directorylevels = ['submit','entries','partners','experts','prizes','rules','blog']
      let allLinkNames = ['submit','blog','entries','partners','experts','prizes','rules','evilbot','invaderz'];
      let nextLink = "";
      let revealedLink = "";
      let revealedChars =0;
      let dataCost = 10; // cost to uncover url bits


      // processdatastrips()
      //
      // reveal letters from the mystery word

      let processDataStrips=()=>{

        // pick a character that isn't revealed yet
        let rl=revealedLink.length;
          let pick = randInt(rl);
          while(revealedLink[pick]!="_")
            pick = randInt(rl);


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

            // mark level as cleared
            enemies[0].unlocked=true;
            level1.clearLevel2();
            levelData.cleared2=true;
            saveData.directoryProgress++;
            textSpawnerGuy.doneSpawning=true;

            updateFavorites();
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
      let linkCounter=1;

      // picknextlinkaward()
      //
      // setup the next url to research

      let pickNextLinkAward=()=>{


            /*
        // or if no more urls are available make up a random word
        else{
          let wordL = 4+randInt(4);
          pick="";

          for(let i=0; i<wordL; i++)
            pick+= String.fromCharCode(97+randInt(26));
        }
        */

        // setup new mystery url
        nextLink = allLinkNames[linkCounter]
        linkCounter++;
        revealedLink = "";
        revealedChars =0;
        for(let i=0; i<nextLink.length; i++){
          revealedLink+="_";
        }
      }

      let displayStartUI=()=>{

        cRect(0,0,canvas.w,canvas.h,'#aab');
        cFill('black');
        cText("sam's js13k game",50,50);
        cText("pick 'home' in the select tool above to continue last save,",50,65);
        cText("or pick 'new' to start a new game.",50,80);

        cText("CONTROLS",50,120);
        cText("Left: A. Right: D. Down: S. Jump: Space.",50,135);
        cText("Shoot: Click. ",50,150);
        cText("Talk to the home page guy: E.",50,165);
      }
      let tFormSelected = false;

      // updatefavorites();
      //
      // populate the Select element that contains the favorites list
      let updateFavorites=()=>{

        // setup options text
        let options = `<option> home </option>`;
        if(currentLevel=='start') options='<option> home </option><option> new </option>';
        else
        for(let i=0; i<saveData.levels.length; i++){
          let j=saveData.levels[i];
          options+=`<option>${j.name} difficulty: ${j.difficulty}</option>`
        }
        // setup favorites text
        let fav = `favorites:<select id="favorites" style='cursor:pointer;'> ${options} </select>`

        // setup address bar
        addbar.innerHTML = `<span> <span class='hov abel'> < </span> <span class='hov abel'> > </span> </span>
        <span class='abel'> www.coolsite.com/${currentLevel} </span>
                <span  class='abel' id='favs'> ${fav} <span class='hov abel' onclick='goToLink()'>go</span> </span>`;

        // pointto() is short for getdocbyid() lol
        //textform=pointTo("tinput");
        listform=pointTo("favorites");
        fav = pointTo("favs");
        // disable player inputs when typing in text form
        //textform.onfocus=()=>tFormSelected=true;
        //textform.onblur=()=>tFormSelected=false;

        saveGame();
      }


      let back=()=>console.log("back");
      let forward=()=>console.log("forward");
      let favblinginterval;
      let favBling =0;
      let fav;
      let blinging=false;
      let blingFavorites=()=>{
        if(!blinging){

          blinging=true;
          // trigger sfx
          playCash();
          // trigger visuals
          favblinginterval=setInterval(function(){

            fav = pointTo("favs");
            if(favBling%2==0){
              fav.style.backgroundColor='blue'
            }
            else {
              fav.style.backgroundColor='white'
            }
            favBling++;
          }, 400);
          setTimeout(function(){
            fav.style.backgroundColor='white';
            clearInterval(favblinginterval);
            blinging=false;
          }, 5000)
        }

      }
      let level1;
      let killLine = 500;
      let sceneW=0;
      let fadeIn =0;
      let enemies = [];
      let lvlCount=0;
      let enemyDifficulty=1;
      let lvlDiffIncreaseInterval = 3;
      let maxEnemyDifficulty =3;
      let bgurl='js/characters/enemyclass.js';



      // a place to setup some platforms and stuff

      let basicLevel=(has404)=>{
        sceneW = canvas.w;

        level1=new Level( [
          [50,killLine-100,100],
          [-60,killLine-60,100],
          [0, killLine, canvas.w]
        ], sceneW, 100,has404);
      }


      let continueLevel=(spawn)=>{

        // extend kill line
        killLine+= 500;
        let plats = [[0,killLine,sceneW]]
        let stairs = flo(3+random()*3);
        let stairCount = flo(1+random()*3);


        // create stair formations
        for(let j=0; j< stairCount; j++){

          let x = -(stairCount/3)*canvas.w  + (j)* sceneW/stairCount + 75;
          let y = killLine;
          for(let i=0; i<stairs; i++){

            let w = 50;
            y-= 60;
            if(i==stairs-1){
              w = 250;
              if(spawn)
                enemies.push(new Enemy(x,y-80,0,0,'spawner'));
            }
            plats.push([x,y,w+random()*50])
            x+= -40+random()*80;
          }
        }

        // create new platform objects
        for(let i=0; i<plats.length; i++){
          let t = level1.getplatformtext(plats[i][2]);

          level1.platforms.push(new Platform(plats[i][0],plats[i][1],plats[i][2],t))
        }

        // update walls
        level1.moreClouds(2);
        level1.newWalls(sceneW);
      }





      // createlevel()
      //
      // create level object design platforms

      let createLevel=()=>{

        // reset level variables
      //  noiseCounter=0
        enemies = [];
        items = [];
        killLine = 500;
        ncount=0;
        // close dialog window
        dUI.open=false;
      //  console.log(directorylevels,currentLevel)
        // if target page is home page
        if(currentLevel=='home'){
          basicLevel();
          createFriendlyNPCs();
        }
        // if this is a boss level
        else if(!directorylevels.includes(currentLevel)){
          //console.log("yoyo")
          basicLevel(true);
          let p=level1.platforms[0];
          if(!levelData.cleared)
            enemies.push(new Enemy(p.x,p.y-80,0,0,'boss'));
          else level1.clearLevel();
        }


        // if target page is a level:
        else {

          sceneW = 2*canvas.w;
          level1 = new Level([[0,killLine,sceneW]],sceneW, 400, true );

          let p=level1.platforms[0];
          let j=levelData.sections;
          if(levelData.cleared) level1.clearLevel();
          // if level isn't cleared, load enemies

            // if there is no progress on this level yet, create first spawner
            if(j==0)
              enemies.push(new Enemy(p.x,p.y-80,0,0,'spawner'));
              // if there is progress made on this level, add platforms below
            else for(let k=0; k<j; k++){

                if(k==j-1) continueLevel(!levelData.cleared); // add a spawner to the last section (unless level is cleared??)
                else continueLevel(false)
              }


              if(levelData.cleared2) level1.clearLevel2();
              else if(levelData.cleared) level1.addSpawner2();



            // save game/update favorites
          updateFavorites();
        }
      }


      class Level{

        constructor(plist,w,h,has404txt){


          if(has404txt!=undefined){
            let p = plist[0];
            this.text404 = new DisplayObject( p[0]-10,p[1]-10,300,300 );
          }

          this.platforms = [];
          this.bgFill='#333F';

          this.txtCounter=0;
          for(let i=0; i<plist.length; i++){
            let t = this.getplatformtext(plist[i][2]);
            this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2],t));
          }

          //let cloudCount=4;
          this.clouds = [];
          this.moreClouds(3);

          this.newWalls(sceneW);
          this.bgTxt = new DisplayObject(w/2,this.platforms[0].y+h,w*2,h*4);

          this.bgcounter=0;
          this.thunder=100;

          this.drops = [];
          this.cleared=false;
          this.cleared2=false;
        }

        moreClouds(cloudCount){
          for(let i=0; i<cloudCount; i++){

            let rows = 3+randInt(4);
            let t = [];
            for(let j=0; j<rows; j++){
              t.push(this.getplatformtext(30+randInt(100)))
            }
            let d = 1;
            if(i%2==0) d=-1;
            //let p= this.platforms[0];
            this.clouds.push({
              o: new DisplayObject(
                0+  i*200 + randInt(100),
                killLine+randInt(450),
                1000,1000
              ),

              t:t,
              n: randInt(200),
              dir: d
            })
          }
        }

        getplatformtext(l){
          let t="";
          for(let j=0; j<l/3; j++){

            t += bgText[this.txtCounter];
            this.txtCounter++;
            if(this.txtCounter==bgText.length) this.txtCounter=0;
          }
          return t;
        }

        addSpawner2(){
          let p = this.platforms[1+randInt(this.platforms.length-1)];
          //console.log("cleared")
          enemies.push(new Enemy(p.x,p.y-80,0,0,'spawner2'));
          textSpawnerGuy = last(enemies);
        }

        clearLevel(){
          this.cleared=true;
          this.bgFill="#666"
        }

        clearLevel2(){
          this.cleared2=true;
          this.bgFill="#ccc"
        }

        newWalls(w){
          this.walls=[
            new DisplayObject( - 0.75*w, 0, w/2, 2000 ),
            new DisplayObject( w*0.75, 0, w/2, 2000 ),
            new DisplayObject( 0, killLine+520, 2000, 1000 )
          ];
        }

        displayBackground(){


          cRect(0,0,canvas.w,canvas.h,this.bgFill);

          // run thunder
          if(this.bgcounter>this.thunder&&!level1.cleared2){
            let val = 10-(this.bgcounter-this.thunder);
            if(val>=0)
              cRect(0,0,canvas.w,canvas.h, '#FFF'+val);

            else if(Math.random()<0.3){
              this.thunder+=50+randInt(100);

              playThunder();
            }
            else{
              let i=200;
              if(level1.cleared) i = 20;
              this.thunder+=i+randInt(i);

              playThunder();
            }
          }

          // draw clouds

          for(let i=0; i<this.clouds.length; i++){
            let c = this.clouds[i]
            c.o.position();

            if(c.o.screenPos!=false){
              for(let j=0; j<c.t.length; j++)
                cText(c.t[j],c.o.screenPos.x*(0.7+0.03*j),c.o.screenPos.y*0.8+j*15,'#bbb3', 30);
            }



            c.o.x += c.dir*.2;


            if(this.bgcounter%150==0&&Math.random()>0.5)
              c.dir *= -1;

          }

          // draw rain drops
          let p=this.bgTxt.position();

          // update rain drops
          for(let i=this.drops.length-1; i>=0; i--){

            let j=this.drops[i];
            // update position
            j.y += 20;
            // draw rain drop
            cText( bgText[j.c], p.x+j.x, p.y+j.y, '#bbba', 12 );
            // remove drop once it hits the killLine
            if(j.y>player.y) this.drops.splice(i,1);
            }

            // add rain drops
            if(this.bgcounter%4==0)
              this.drops.push({x:player.x+randInt(canvas.w),y:player.y-800,c:randInt(400)});
            this.bgcounter++;
          }

          display404Background(){
            let p=this.text404.position();
            cText("404", p.x, p.y, 'black', 100);
            cText("return to last page...", p.x, p.y+50, 'black', 30);
          }

          displayPlatforms(){

            // display platforms

            for(let i=0; i<this.platforms.length; i++)
              this.platforms[i].display();

            // display walls
            cFill('black');
            for(let i=0; i<this.walls.length; i++){
              let w = this.walls[i];
              let p = w.position();
              if(p!=false)
              ctx.fillRect(p.x,p.y,w.w,w.h);
            }
          }



        }
        let platformHeight = 10;
        let platformFill='#a43f';

        class Platform extends DisplayObject { // extends display object class

          constructor(x,y,l,t){

            super(x,y,l,platformHeight);
            this.fill=platformFill;
            this.ptext = t;
            console.log(t);
          }

          display(){

            let p=this.position();
            if(this.screenPos!=false){

              // draw platform:
              ctx.strokeStyle='#a438';
              ctx.strokeRect(p.x,p.y,this.w,20);
              let pl = this.ptext.length;
              cText(this.ptext.substring(0,pl/2),p.x,p.y+8, this.fill,10);
              cText(this.ptext.substring(pl/2,pl),p.x,p.y+18, this.fill,10);

            }
          }
        }
        let start=()=>{

          loadSave();
          //pickNextLinkAward()
          fadeIn =0;
          createCanvas();
          addressbar();

          // buffer models
          loadModelData();

          startSound();

          fetch(bgurl)
          .then(response => response.text())
          .then(text => bgText=text.replace(" ",""));

          // start main loop
          setInterval( run, 33 );
        }

        let bgText;
        window.onload = start;
        let currentLevel='start';




        let run=()=>{

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
            progressBar( 10, canvas.h-40, 100, 30, player.gunPower, "orange","grey" );
            progressBar( canvas.w-110, canvas.h-40, 100, 30, player.jetFuel, "blue","grey" );
          }
          else displayStartUI();

        }
