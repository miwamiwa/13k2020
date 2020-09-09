let addbar;
let textform;
let listform;
let levelData;

let addressbar=()=>{

  addbar = div();
  addbar.style.width=canvas.w+'px';
  addbar.style.backgroundColor='grey'

  updateFavorites();

  document.body.appendChild(canvas.c);
  let b = canvas.c.getBoundingClientRect();
  canvas.x = Math.round(b.x);
  canvas.y = Math.round(b.y);

}


// setuplevel()
//
// called when a level is loaded.
// check if level is part of save data. make a new level if not.

let setupLevel=()=>{

  let islevel=isLevel(currentLevel);
  console.log(islevel,currentLevel)
  // if level already exists, point current level to save data
  if(islevel!=-1) levelData = saveData.levels[islevel];

  // if level doesn't exist
  else {
    console.log("new level data")
    // setup new level data.
    newLevel(dif);
    // point to this level to load it next
    levelData=last(saveData.levels);
  }
}


// newlevel()
//
// adds a new level to the game without starting it

let dif=0;
let newLevel=(name)=>{

  // setup level difficulty
  if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0)
  dif = Math.min(enemyDifficulty+1,maxEnemyDifficulty);
  lvlCount++;

  if(name==undefined) name=currentlevel;
  saveData.levels.push({
    name:name,
    seedData:setupRandomSeed(),
    difficulty:1+flo(lvlCount/2),
    cleared:false,
    cleared2:false,
    sections:0
  });
}

// saveleveldata()
//
// save current level progression

let saveLevelData=()=>{
  if(currentLevel!='home'&&currentLevel!='start'){
    let i = isLevel(currentLevel);
    saveData.levels[i].cleared = levelData.cleared;
    saveData.levels[i].cleared2 = levelData.cleared2;
    saveData.levels[i].sections = levelData.sections;
  }
}

// gotolink()
//
// called when you press go or hit enter in the text box

let goToLink=()=>{

  // get favorites selection
  let v = listform.value;

  // if user selected home
  if(v=="home"){
    loadHomeLevel();
    updateFavorites();
    return
  }
  // if this is start page and user selects new game
  else if(currentLevel=='start'&&v=="new"){
    newGameSave();
    loadHomeLevel();
    updateFavorites();
    return
  }
  // otherwise if this is a level
  else if(saveData.levels.length!=0){
    // save current level
    if(levelData!=undefined) saveLevelData();
    currentLevel  = v.substring(0,v.indexOf(" "));
    // setup and start level
    fade(24);
    setupLevel();
    createLevel();
    createPlayer();
  }
}



let loadHomeLevel=()=>{
  currentLevel='home';
  createLevel();
  createPlayer();
  fade(8);
}
