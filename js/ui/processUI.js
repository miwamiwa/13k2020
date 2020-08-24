let displayProcessUI = false;
let allLinkNames = ["home","contact","store","gallery","news","events","wormhole","destroy","noob","rekt","acidpool","badfile"];
let favorites = ["home"];
let favoritesStatus = ["safe"];
let clearedStates = [false,false,false];
let completions = [0,0,0];
let nextLink = "";

let pUI = {
  w:200,
  h:200,
  last:false,
  el:0
}

function runProcessUI(){

  if(displayProcessUI&&!pUI.last){

    // create process UI
    pUI.x = canvasElw/2-pUI.w/2;
    pUI.y = canvasElh/2-pUI.h/2;

    dialogUI.open=false;
    pUI.el = div(pUI,'white');
    pUI.el.innerHTML='spend '+dataCost+' data strips towards discovering a new page';
    let bsize = {x:pUI.x,y:pUI.y+pUI.h/4,w:pUI.w,h:pUI.h/4};
    pUI.dataButton = button(bsize,'yellow','but1','processDataStrips');
    bsize.y+=pUI.h/4;
    pUI.el2 = div(bsize,'white');
    pUI.el2.innerHTML='spend '+htmlCost+' html bits towards clearing an html page';
    bsize.y+=pUI.h/4;
    pUI.htmlButton = button(bsize,'orange','but2','processHTMLBits');
  }
  else if(!displayProcessUI&&pUI.last){

    // remove process UI
    pUI.el.remove();
    pUI.el2.remove();
    pUI.dataButton.remove();
    pUI.htmlButton.remove();
  }

  pUI.last=displayProcessUI;
}

let dataCost = 10; // cost to uncover url bits

function processDataStrips(){
console.log("data strps")
let have = findAndRemoveItem(enemyLootTable[0].name,dataCost);
console.log(have)
if(have!=-1){

  console.log("have!")
  if(nextLink=="") pickNextLinkAward();


    let pick = Math.floor(Math.random()*revealedLink.length);
    while(revealedLink[pick]!="_"){
      pick = Math.floor(Math.random()*revealedLink.length);
    }

    console.log(pick,nextLink)
    if(pick<nextLink.length-1)
    revealedLink = revealedLink.substring(0,pick)+nextLink[pick]+revealedLink.substring(pick+1,revealedLink.length);
    else revealedLink = revealedLink.substring(0,pick)+nextLink[pick]
    //pUI.dataButton.innerHTML=revealedLink;
    console.log(revealedLink)
    revealedChars++;
    if(revealedChars==revealedLink.length){
      favorites.push(nextLink);
      favoritesStatus.push("unknown");
      completions.push(0);
      clearedStates.push(false);

      updateFavorites();
      console.log("done")
    }


}


}

let revealedLink = "";
let revealedChars =0;


function pickNextLinkAward(){
  console.log("reset reward")
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


let htmlCost = 500;
function processHTMLBits(){
console.log("html bits");
let have =findAndRemoveItem(enemyLootTable[2].name,htmlCost);
if(have!=-1){
  addToInventory(cleaningitem,'1');
}
}
