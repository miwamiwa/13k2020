let start=()=>{

  loadSave();
  //pickNextLinkAward()
  fadeIn =0;
  createCanvas();
  addressbar();

  // buffer models
  loadModelData();

  startSound();

  fetch(bgurl)
  .then(response => response.text())
  .then(text => bgText=text.replace(" ",""));

  // start main loop
  setInterval( run, 33 );
}

let bgText;
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
