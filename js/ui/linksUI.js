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
  let options = "";
  for(let i=0; i<favorites.length; i++){
    options+=`<option>${favorites[i]} status: ${favoritesStatus[i]}</option>`
  }

  let fav = `favorites:<select id="favorites"> ${options} </select>`

  linksUIel.innerHTML = ` <span onclick=''> < </span> <span onclick=''> > </span>
  www.coolshoes.com/<input type='text' id='tinput' onkeydown='formKeyDown()'></input>
  ${fav} <span onclick='inputListChanged()'>go</span> `;

  textform=document.getElementById("tinput");
  listform=document.getElementById("favorites");
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

function goToLink(){

  //let tinput = textform.value;
  //  let linput =

  let result  = listform.value.substring(0,listform.value.indexOf(" "));
  if(textform.value!=listform.value) result = textform.value;
    console.log('result',result);
  if(result=='home') loadHomeLevel();
  else if (result=='continue') getSavedGameAndStart();
  else {
    //linksUIel.innerHTML = "loading "+result+"!";
    console.log("load dat")
    fadeIn =0;
    waittime=24;

    getLinkSeed(result);
    console.log(currentLevel)
    //currentLevel =0;
    noiseCounter=0
    createLevel();
    createPlayer();

    setTimeout(function(){
      displayLinksUI = false;

    },linkLoadTime);
  }


}

let difficultyLevels = [];
// convert level/link name to seed index from the save data array
function getLinkSeed(name){

  let index = saveData.linkNames.indexOf(name);

  console.log("linknames index: ",index)

  // if level has already been visited
  if(index!=-1){
    currentLevel = saveData.seedIndex[index];
    console.log(saveData.seedIndex)
  }

  // otherwise if it's the first visit
  else {

    // if this is a level (not a true 404)
    if(allLinkNames.includes(name)){

      // increase difficulty every 3 levels
      if(lvlCount!=0&&lvlCount%lvlDiffIncreaseInterval==0)
        enemyDifficulty = Math.min(enemyDifficulty+1,maxEnemyDifficulty);

      difficultyLevels.push(enemyDifficulty);
      let favindex= favorites.indexOf(name);
      let statustext="Locked. Difficulty: "+enemyDifficulty;
      //  console.log("favindex",favindex)
      if(favindex!=-1){
        favoritesStatus[favindex]=statustext;
      }
      else{
        favorites.push(name);
        favoritesStatus.push(statustext);
      }
      lvlCount++;
      //  console.log('difficulty',enemyDifficulty)
      let newSeedIndex = Math.floor(Math.random()*100);
      while(saveData.seedIndex.includes(newSeedIndex)){
        newSeedIndex = Math.floor(Math.random()*100);
      }


      saveData.linkNames.push(name);
      console.log("pushed",name)
      currentLevel =newSeedIndex;
    }
    else {
      currentLevel ='true404';
    }

  }
}
