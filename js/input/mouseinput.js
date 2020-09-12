let mouseIsPressed = false;
let mouseX =0;
let mouseY =0;
let cantShoot=false;


// mousepressed()
//
// triggered once when mouse is pressed

let mousePressed=()=>{

  if(!soundStarted) startSound();
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
