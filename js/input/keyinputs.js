let cantGoDown = false;
let cantjetpack=false;


let keypress=()=>{
  if(!tFormSelected){
    switch(event.keyCode){

       //a
      case 65: player.goLeft(); break;

      //d
      case 68: player.goRight(); break;

      case 32: //space
      if(!player.jetpacks&&player.jumpForce<8) player.jump();
      if(!cantjetpack)
        player.jetpacks=true;

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

       break;
    }
  }

}
