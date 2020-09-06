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

// formkeydown()
//
// called on keydown in the text input form

let formKeyDown=()=>{
  // if ENTER is pressed
  if(event.keyCode==13){
    textform.value = textform.value.trim();
    goToLink();
    textform.blur();
  }
}

// inpulistchanged()
//
// called when item from the select list is chosen

let inputListChanged=()=>{
  let v = listform.value;
  textform.value=v.substring(0,v.indexOf(" "));
  goToLink();
}

// setuplevel()
//
// called when a level is loaded.
// check if level is part of save data. make a new level if not.

let setupLevel=()=>{

  let islevel=isLevel(currentLevel);

  // if level already exists, point current level to save data
  if(islevel!=-1) levelData = saveData.levels[islevel];

  // if level doesn't exist
  else {

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
    saveData.levels[i].sections = levelData.sections;
  }
}

// gotolink()
//
// called when you press go or hit enter in the text box

let goToLink=()=>{

  let v = listform.value;
  let tv = textform.value;

  if(currentLevel=='start'){
    if(tv=="home"){
      loadHomeLevel();
      return
    }
    if(tv=="new"){
      newGameSave();
      loadHomeLevel();
      return
    }
  }
  else

  if(saveData.levels.length!=0){

    // save current level
    if(levelData!=undefined) saveLevelData();
    // default target link is select form value
    if(v!='home') currentLevel  = v.substring(0,v.indexOf(" "));
    else currentLevel='home';
    // if text form input is different, then chose text form instead.
    if(tv!=v&&tv!="") currentLevel = tv;
    // if user guessed the current research link, get new research link
    if(currentLevel==nextLink) pickNextLinkAward();
    // if target is a start screen command
    if(currentLevel=='home') loadHomeLevel();

    // if target isn't home screen
    else {
      // setup and start level
      fade(24);
      setupLevel();
      createLevel();
      createPlayer();
    }
  }
}



let loadHomeLevel=()=>{
  currentLevel='home';
  createLevel();
  createPlayer();
  fade(8);
}
