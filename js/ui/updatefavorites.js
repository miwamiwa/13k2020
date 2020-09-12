let tFormSelected = false;
let haClass = 'class="hov abel"';
let aClass = "class='abel'";
// updatefavorites();
//
// populate the Select element that contains the favorites list
let updateFavorites=()=>{

  eType='option';
  let s = saveData.levels;
  let f = 'favorites'
  let options = el('home');

  // setup favorites options
  if(isStart()) options+=el('new');
  else for(let i=0; i<s.length; i++)
          options+= el(`${s[i].name} difficulty: ${s[i].difficulty}`);

  // setup address bar
  eType='span'
  addbar.innerHTML = el( el('<',haClass)+el('>',haClass) )
  + el(`www.js13kgames.com/${currentLevel}`,aClass)
  + el( `${f}:<select id="${f}" style='cursor:pointer;'> ${options} </select>`
  + el( 'go', haClass+" onclick='goToLink()'" ), aClass+" id='favs'");

  listform=pointTo(f);
  fav = pointTo("favs");

  saveGame();
}

let eType='option';

// el()
//
// returns the html for an element of type given by var eType.

let el=(input,atts)=>{
  if(atts==undefined) atts="";
  return `<${eType} ${atts}>${input}</${eType}>`;
}

let blingInt;
let favBling =0;
let fav;
let blinging=false;

let blingFavorites=()=>{
  if(!blinging){

    blinging=true;
    // trigger sfx
    playCash();
    // trigger visuals
    blingInt=setInterval(function(){

      fav = pointTo("favs");
      if(favBling%2==0) favBG('blue');
      else favBG('white');

      favBling++;
    }, 400);


    setTimeout(function(){
      favBG('white');
      clearInterval(blingInt);
      blinging=false;
    }, 5000)
  }
}

let favBG=(c)=> fav.style.backgroundColor=c;
