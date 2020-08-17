window.onload = start;

let killLine = 500;

function start(){

  loadSave();
  //pickNextLinkAward()
  fadeIn =0;
  createCanvas();
  setupActionBar();
  createLevel();
  createPlayer();
  setupCamera();

  setInterval( run, 33 );
}

function run(){

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
  player.limitX();
  player.display();

  if(player.hitPoints<100) player.hitPoints+=0.1;
  updateProjectiles();
  runDialog();

  updateItems();

  runFadeIn();

  runProcessUI();
  runLinksUI();


}


function runExitDoor(){
  exitdoor.display();
  enableInteraction(exitdoor,"press E to return home",exitDoorRange);

}
