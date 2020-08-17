let saveData = null;
function loadSave(){

  saveData=localStorage.getItem(saveDataHeader);
  // if there is no save data, setup a save data object
  if(saveData==null){
    newGameSave();
  }
}

// newgamesave()
//
// resets the save game data
function newGameSave(){
  saveData = {
    seedIndex:[],
    seedData:[],
    linkNames:[]
  }
}
