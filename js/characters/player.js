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

  if(player.hitPoints<40){
    player.lrMaxSpeed=7;
    player.initJumpForce=29;
  }
  else {
    player.lrMaxSpeed=12;
    player.initJumpForce=40;
  }
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
