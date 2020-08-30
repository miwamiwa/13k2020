let player;

let createPlayer=()=>{

  let pos = level1.platforms[level1.platforms.length-1];
  if(currentLevel=='home') pos=level1.platforms[0]
  else pos.x-= 130;
  player=new MovingObject(pos.x,pos.y-100,40,'#2a20');
  //player.initJumpForce=40;
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
  else if(player.jumpForce>0) player.jumpForce-=2;
  else player.jumpForce=0;
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



 aBar.health.innerHTML='health: '+Math.floor( player.hitPoints );

 if(player.hitPoints<=0){
   loadHomeLevel();
   fade(60,'ouchies');
 }

 player.gunPower = Math.min( player.gunPower+4, 100 );
 player.jetFuel = Math.min( player.jetFuel+4, 100 );
}

let resetPlayerAnimation=()=>{
  if(playerMoving) playerModel.fullRig.selectAnimation(0);
  else playerModel.fullRig.selectAnimation(3);
}

let damagePlayer=(damage)=>{
  //console.log("player hit!");
  player.hitPoints -= damage;
  playDamageFX();

  playerModel.selectAnimation(1);
  setTimeout(function(){
    resetPlayerAnimation();
  },400)
}
