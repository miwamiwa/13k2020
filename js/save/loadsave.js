let saveData = null;
let loadSave=()=>{

//localStorage.removeItem(saveDataHeader);
  saveData=JSON.parse(localStorage.getItem(saveDataHeader));

  // if there is no save data, setup a save data object
  if(saveData==null){
    newGameSave();
  }
  else console.log("Loaded Save")
}

// newgamesave()
//
// resets the save game data
let newGameSave=()=>{

  console.log("new save")
  saveData = {
    levels:[],
    textProgress:0
  }
}

window.onbeforeunload=saveGame;
