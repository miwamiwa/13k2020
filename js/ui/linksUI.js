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

let tFormSelected = false;

// updatefavorites();
//
// populate the Select element that contains the favorites list
function updateFavorites(){

  let options = `<option> home </option>`;

  for(let i=0; i<saveData.levels.length; i++){
    let j=saveData.levels[i];
    options+=`<option>${j.name} difficulty: ${j.difficulty}</option>`
  }

  let fav = `favorites:<select id="favorites"> ${options} </select>`

  linksUIel.innerHTML = ` <span onclick=''> < </span> <span onclick=''> > </span>
  www.coolshoes.com/<input type='text' id='tinput' onkeydown='formKeyDown()'></input>
  ${fav} <span onclick='inputListChanged()'>go</span> `;

  textform=pointTo("tinput");
  listform=pointTo("favorites");
  textform.onfocus=function(){tFormSelected=true;};
  textform.onblur=function(){tFormSelected=false;};
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
//  console.log("inputlistchanged()")
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

    // increment enemy difficulty



    // setup new level data.
    newLevel(dif);

    // point to level data
    levelData=last(saveData.levels);
  }

  console.log("new level data: ",levelData)
}
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

function goToLink(){
  console.log("goToLink()");

  // get target url:
  if(levelData!=undefined) saveLevelData();
  // default target link is select list value
  if(listform.value!='home'){
    currentLevel  = listform.value.substring(0,listform.value.indexOf(" "));
    if(textform.value!=listform.value) currentLevel = textform.value;
  }
  else currentLevel='home';
  // if text form input is different, then chose text form instead.

  console.log('new current level: ', currentLevel);

  // if target is a start screen command
  if(currentLevel=='home') loadHomeLevel();
  else if (currentLevel=='continue') getSavedGameAndStart();

  // if target isn't home screen
  else {

    console.log("load a level")
    // reset fade-in
    fadeIn =0;
    waittime=24;

    //getLinkSeed(result);
  //  console.log(currentLevel)
    //currentLevel =0;
    setupLevel();

    createLevel();
    createPlayer();

  }


}
