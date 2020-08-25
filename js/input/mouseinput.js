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
