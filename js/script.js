let start=()=>{

  loadSave();
  fadeIn =0;
  createCanvas();
  addressbar();

  // buffer models
  loadModelData();


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

    cameraFollow(player.x,player.y);
    level1.displayBackground();
    level1.displayPlatforms();
    level1.display404Background();

    if(currentLevel=='home') 
      runFriendlyNPCs();

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
