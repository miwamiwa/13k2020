let cantGoDown = false;

function keypress(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=true;
      player.movingRight=false;
      player.facing='left';
    break;

    case 68: //d
      player.movingRight=true;
      player.movingLeft=false;
      player.facing='right';
    break;

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

    case 49: //1
    if(currentLevel=='start'){
      console.log("yo")
      currentLevel='home';

      createLevel();
      createPlayer();

    }
    else  if(currentLevel=='home'&&computer.interactible&&!displayProcessUI) displayLinksUI = true;
      else displayLinksUI = false;
    break;

    case 50: //2
      if(currentLevel=='home'&&computer.interactible&&!displayLinksUI) displayProcessUI = true;
      else displayProcessUI = false;
    break;

    case 82: // r

    break;

    case 27: //escape
    displayProcessUI = false;
    displayLinksUI = false;
    dialogUI.open=false;
    inventoryDisplayed=!inventoryDisplayed;
    break;
  }
}


function keyrelease(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=false;
    break;

    case 68: //d
      player.movingRight=false;
    break;

  }
}
