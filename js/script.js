window.onload = start;
let currentLevel='start';
let killLine = 500;

function start(){

  loadSave();
  //pickNextLinkAward()
  fadeIn =0;
  createCanvas();
  createLinksUI();

  setupActionBar();
  resizeCanvas();

  //createLevel();
  //createPlayer();
  //setupCamera();
  loadModelData();

  startSound();
  setInterval( run, 33 );
}

function run(){

  if(currentLevel!='start'){
    let h = currentLevel=='home';
    cameraFollow(player.x,player.y);
    level1.displayBackground();
    if(!h) level1.display404Background();
    level1.displayPlatforms();
    if(h){
      runFriendlyNPCs();
    }
    else runExitDoor();

    updateEnemies();
    updatePlayer();
    updateProjectiles();
    runDialog();

    updateItems();

    runFadeIn();

    //runProcessUI();

    if(!h) level1.displayCompletion();

  }
  else displayStartUI();

}


function runExitDoor(){
  exitdoor.display();
  enableInteraction(exitdoor,"press E to return home",exitDoorRange);

}
