let directorylevels = ['submit','entries','partners','experts','prizes','rules','blog']
let allLinkNames = ['submit','blog','entries','partners','experts','prizes','rules','evilbot','invaderz'];
let nextLink = "";
let revealedLink = "";
let revealedChars =0;
let dataCost = 10; // cost to uncover url bits


// processdatastrips()
//
// reveal letters from the mystery word

let processDataStrips=()=>{

  // pick a character that isn't revealed yet
  let rl=revealedLink.length;
    let pick = randInt(rl);
    while(revealedLink[pick]!="_")
      pick = randInt(rl);


    // update revealed link:
    // add a new character in the middle
    if(pick<nextLink.length-1)
      revealedLink = rSub(0,pick)+nextLink[pick]+rSub(pick+1,rl);
      // or at the end
    else revealedLink = rSub(0,pick)+nextLink[pick]

    revealedChars++;

    // if this url is complete, add it to levels list
    if(revealedChars==rl){
      newLevel(nextLink);

      // mark level as cleared
      enemies[0].unlocked=true;
      level1.clearLevel2();
      levelData.cleared2=true;
      saveData.directoryProgress++;
      textSpawnerGuy.doneSpawning=true;

      updateFavorites();
    }
}

// rSub()
//
// returns part of var revealedLink

let rSub=(i,j)=> revealedLink.substring(i,j);

// randomlink()
//
// returns a random link from the list of all links heck yeah

let randomlink=()=> allLinkNames[randInt(allLinkNames.length)];
let linkCounter=1;

// picknextlinkaward()
//
// setup the next url to research

let pickNextLinkAward=()=>{


      /*
  // or if no more urls are available make up a random word
  else{
    let wordL = 4+randInt(4);
    pick="";

    for(let i=0; i<wordL; i++)
      pick+= String.fromCharCode(97+randInt(26));
  }
  */

  // setup new mystery url
  nextLink = allLinkNames[linkCounter]
  linkCounter++;
  revealedLink = "";
  revealedChars =0;
  for(let i=0; i<nextLink.length; i++){
    revealedLink+="_";
  }
}
