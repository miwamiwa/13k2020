let displayLinksUI = false;
let lastdisplayState = false;
let linksUI = {
  w:260,
  h:80
};
let linkLoadTime=800;
let linksUIel;
let textform;
let listform;


function createLinksUI(){


  linksUIel = div();
  linksUIel.style.width=canvas.w+'px';
  linksUIel.style.backgroundColor='grey'

  updateFavorites();

  // append canvas below the address bar
  document.body.appendChild(canvas.canvas);
  let bounds = canvas.canvas.getBoundingClientRect();
  canvas.x = Math.round(bounds.x);
  canvas.y = Math.round(bounds.y);



}






function formKeyDown(){

  if(event.keyCode==13){
    textform.value = textform.value.trim();
    goToLink();
    textform.blur();
  }
}

function inputListChanged(){

  textform.value=listform.value.substring(0,listform.value.indexOf(" "));
  goToLink();
}

let levelData;

function setupLevel(){


  let islevel=isLevel(currentLevel);

  // if level already exists
  if(islevel!=-1){
    console.log("level already exists",islevel)
    // point to level data
    levelData = saveData.levels[islevel];
  }

  // if level doesn't exist
  else {

    console.log("add this level")
    // setup new level data.
    newLevel(dif);
    // point to this level to load it next
    levelData=last(saveData.levels);
  }

  console.log("new level data: ",levelData)
}


// newlevel()
//
// adds a new level to the game without starting it

let dif=0;
function newLevel(name){

  if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0)
    dif = Math.min(enemyDifficulty+1,maxEnemyDifficulty);
  lvlCount++;

  if(name==undefined) name=currentlevel;
  saveData.levels.push({
    name:name,
    seedData:setupRandomSeed(),
    completion:0,
    difficulty:dif,
    unlocked:false,
    cleared:false
  });
}

// saveleveldata()
//
// save current level progression

function saveLevelData(){

  console.log('save level data')
  if(currentLevel!='home'&&currentLevel!='start'){
    let i = isLevel(currentLevel);

    console.log("is level result "+ i)
    saveData.levels[i].completion = levelData.completion;
    saveData.levels[i].unlocked = levelData.unlocked;
    saveData.levels[i].cleared = levelData.cleared;
  }
}

// gotolink()
//
// called when you press go or hit enter in the text box

function goToLink(){

  if(currentLevel=='start'){
    if(textform.value=="home"){
      loadHomeLevel();
      return
    }
    if(textform.value=="new"){
      newGameSave();
      loadHomeLevel();
      return
    }
  }
  else 

  if(saveData.levels.length!=0){
    console.log("gooo")
    // get target url:
    if(levelData!=undefined) saveLevelData();

    if(listform.value!='home')
      // default target link is select form value
      currentLevel  = listform.value.substring(0,listform.value.indexOf(" "));
      else currentLevel='home';
      // if text form input is different, then chose text form instead.
      if(textform.value!=listform.value&&textform.value!="") currentLevel = textform.value;


    // if target is a start screen command
    if(currentLevel=='home') loadHomeLevel();
    else if (currentLevel=='continue') getSavedGameAndStart();

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
