let directorylevels = ['submit','entries','partners','experts','prizes','rules','blog']
let allLinkNames = ['submit','blog','entries','evilbot','partners','experts','prizes','rules','invaderz'];
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
      linkCounter++;
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


let linkCounter=2;

// picknextlinkaward()
//
// setup the next url to research

let pickNextLinkAward=()=>{

  // setup new mystery url
  nextLink = allLinkNames[linkCounter]
  console.log("NEXT LINKE: "+nextLink)
  console.log('link counter',linkCounter)

  revealedLink = "";
  revealedChars =0;
  for(let i=0; i<nextLink.length; i++){
    revealedLink+="_";
  }
}
