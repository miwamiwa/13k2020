let mouseIsPressed = false;
let mouseX =0;
let mouseY =0;

// mousepressed()
//
// triggered once when mouse is pressed

function mousePressed(){
  //console.log("mouse press");
  mouseIsPressed = true;
  mouseX = event.clientX-canvas.x;
  mouseY = event.clientY-canvas.y;
  //console.log(mouseX,mouseY);
  if(!displayLinksUI&&!displayProcessUI)
    player.shoot(mouseX,mouseY,15);
}


// mouseReleased()
//
// called once when mouse is released

function mouseReleased(){
  //console.log("mouse released")
  mouseIsPressed = false;
}
