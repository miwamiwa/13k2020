let start=()=>{

  loadSave();
  //pickNextLinkAward()
  fadeIn =0;
  createCanvas();
  addressbar();

  setupActionBar();

  // buffer models
  loadModelData();

  startSound();

  // start main loop
  setInterval( run, 33 );
}


window.onload = start;
let currentLevel='start';




let run=()=>{

  if(currentLevel!='start'){
    let h = currentLevel=='home';
    cameraFollow(player.x,player.y);
    level1.displayBackground();
    if(!h) level1.display404Background();
    level1.displayPlatforms();
    if(h){
      runFriendlyNPCs();
    }
    updateEnemies();
    updatePlayer();
    updateProjectiles();
    runDialog();
    updateItems();
    runFadeIn();
    progressBar( 10, canvas.h-40, 100, 30, player.gunPower, "orange","grey" );
    progressBar( canvas.w-110, canvas.h-40, 100, 30, player.jetFuel, "blue","grey" );
  }
  else displayStartUI();

}
