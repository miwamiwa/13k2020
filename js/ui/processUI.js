let displayProcessUI = false;
let allLinkNames = ["home","contact","store","gallery","news","events","wormhole","destroy","noob","rekt","acidpool","badfile"];
let favorites = ["home"];
let favoritesStatus = ["safe"];
let clearedStates = [false,false,false];
//let completions = [0,0,0];
let nextLink = "";



let dataCost = 10; // cost to uncover url bits

function processDataStrips(){

  console.log("start process ")
  if(nextLink=="") pickNextLinkAward();
  console.log("we got here")

    let pick = Math.floor(Math.random()*revealedLink.length);
    while(revealedLink[pick]!="_"){
      pick = Math.floor(Math.random()*revealedLink.length);
    }

  //  console.log(pick,nextLink)
    if(pick<nextLink.length-1)
    revealedLink = revealedLink.substring(0,pick)+nextLink[pick]+revealedLink.substring(pick+1,revealedLink.length);
    else revealedLink = revealedLink.substring(0,pick)+nextLink[pick]
    //pUI.dataButton.innerHTML=revealedLink;
    console.log(revealedLink)
    revealedChars++;
    if(revealedChars==revealedLink.length){

      newLevel(nextLink);

      updateFavorites();
      console.log("done")
      nextLink="";
    }





}

let revealedLink = "";
let revealedChars =0;


function pickNextLinkAward(){
  console.log("pick next link")
  let pick = randomlink();
  if( favorites.length<allLinkNames.length-1 ){
    while(favorites.includes(pick)){
      pick = randomlink();
    }
  }
  else{
    let wordL = 4+Math.floor(Math.random()*4);
    pick="";
    for(let i=0; i<wordL; i++){
      pick+= String.fromCharCode(Math.floor(97+Math.random()*26));
    }
  }

  nextLink = pick;
  revealedLink = "";
  revealedChars =0;
  for(let i=0; i<nextLink.length; i++){
    revealedLink+="_";
  }
}

function randomlink(){
  return allLinkNames[Math.floor(Math.random()*allLinkNames.length)];
}
