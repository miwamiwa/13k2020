let saveData = null;


// loadsave()
//
//

let loadSave=()=>{

  saveData=JSON.parse(localStorage.getItem(saveDataHeader));
  // if there is no save data, setup a save data object
  if(saveData==null)
    newGameSave();
}

// newgamesave()
//
// resets the save game data
let newGameSave=()=>{

  saveData = {
    levels:[],
    textProgress:0,
    directoryProgress:0,
    bossProgress:0,
    gameProgress:[],
    lvlCount:0
  }
}

window.onbeforeunload=saveGame;
