let tFormSelected = false;

// updatefavorites();
//
// populate the Select element that contains the favorites list
let updateFavorites=()=>{

  // setup options text
  let options = `<option> home </option>`;
  if(currentLevel=='start') options='<option> home </option><option> new </option>';
  else
  for(let i=0; i<saveData.levels.length; i++){
    let j=saveData.levels[i];
    options+=`<option>${j.name} difficulty: ${j.difficulty}</option>`
  }
  // setup favorites text
  let fav = `favorites:<select id="favorites" style='cursor:pointer;'> ${options} </select>`

  // setup address bar
  addbar.innerHTML = `<span> <span class='hov abel'> < </span> <span class='hov abel'> > </span> </span>
  <span class='abel'> www.coolsite.com/${currentLevel} </span>
          <span  class='abel' id='favs'> ${fav} <span class='hov abel' onclick='goToLink()'>go</span> </span>`;

  // pointto() is short for getdocbyid() lol
  //textform=pointTo("tinput");
  listform=pointTo("favorites");
  fav = pointTo("favs");
  // disable player inputs when typing in text form
  //textform.onfocus=()=>tFormSelected=true;
  //textform.onblur=()=>tFormSelected=false;

  saveGame();
}


let back=()=>console.log("back");
let forward=()=>console.log("forward");
let favblinginterval;
let favBling =0;
let fav;
let blinging=false;
let blingFavorites=()=>{
  if(!blinging){

    blinging=true;
    // trigger sfx
    playCash();
    // trigger visuals
    favblinginterval=setInterval(function(){

      fav = pointTo("favs");
      if(favBling%2==0){
        fav.style.backgroundColor='blue'
      }
      else {
        fav.style.backgroundColor='white'
      }
      favBling++;
    }, 400);
    setTimeout(function(){
      fav.style.backgroundColor='white';
      clearInterval(favblinginterval);
      blinging=false;
    }, 5000)
  }

}
