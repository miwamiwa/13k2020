
let allLinkNames = ["contact","store","evilfile","badvirus","maliciousstuff","dontclickhere"];
let nextLink = "";
let revealedLink = "";
let revealedChars =0;
let dataCost = 10; // cost to uncover url bits


// processdatastrips()
//
// reveal letters from the mystery word

let processDataStrips=()=>{

  // if next link isn't defined,
  // pick next link award :
  if(nextLink=="") pickNextLinkAward();



  // reveal url:

  // pick a character that isn't revealed yet
  let rl=revealedLink.length;
    let pick = randInt(rl);
    while(revealedLink[pick]!="_"){
      pick = randInt(rl);
    }

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
      updateFavorites();
      // reset link so that a new award is found next time about
      nextLink="";
      level1.clearLevel2();
      levelData.cleared2=true;
      textSpawnerGuy.doneSpawning=true;
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


// picknextlinkaward()
//
// setup the next url to research

let pickNextLinkAward=()=>{

  // pick a url that hasn't been used yet
  let pick = randomlink();
  if( saveData.levels.length<allLinkNames.length )
    while(isLevel( pick )!=-1)
      pick = randomlink();

  // or if no more urls are available make up a random word
  else{
    let wordL = 4+randInt(4);
    pick="";

    for(let i=0; i<wordL; i++)
      pick+= String.fromCharCode(97+randInt(26));
  }

  // setup new mystery url
  nextLink = pick;
  revealedLink = "";
  revealedChars =0;
  for(let i=0; i<nextLink.length; i++){
    revealedLink+="_";
  }
}
