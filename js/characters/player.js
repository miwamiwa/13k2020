let player;

function createPlayer(){

  let pos = level1.platforms[level1.platforms.length-1];
  if(currentLevel=='home') pos=level1.platforms[0]
  else pos.x-= 130;
  player=new MovingObject(pos.x,pos.y-100,20,'#2a20');
  player.facing='left';


}

let  playerMoving;
let lastPlayerMovingState=false;
let playerJumping=false;
function updatePlayer(){
  player.limitX();
  player.display();
  playerModel.x=player.screenPos.x+10;
  playerModel.y=player.screenPos.y-10;

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