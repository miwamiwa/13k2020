let mouseIsPressed = false;
let mouseX =0;
let mouseY =0;
let shootStopTimeout;
let shotCooldown=false;
// mousepressed()
//
// triggered once when mouse is pressed

function mousePressed(){
  //console.log("mouse press");
  mouseIsPressed = true;
  mouseX = event.clientX-canvas.x;
  mouseY = event.clientY-canvas.y;
  //console.log(mouseX,mouseY);
  if(!displayLinksUI&&!displayProcessUI&&currentLevel!='start'&&!shotCooldown){
    playBlaster(1800,3);
    player.shoot(mouseX,mouseY,15);
    playerModel.selectAnimation(4);
    clearTimeout(shootStopTimeout);
    shotCooldown=true;
    shootStopTimeout = setTimeout(function(){
      resetPlayerAnimation();
      shotCooldown=false;
    },200);
  }



}


// mouseReleased()
//
// called once when mouse is released

function mouseReleased(){
  //console.log("mouse released")
  mouseIsPressed = false;
}
