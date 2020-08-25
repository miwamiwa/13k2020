//let noiseSeed =0;

let seedStorageHeader="sams404gameseed";

let seedDataLength=100;
let maxCharVal=100;
let charStartVal = 128; // start index for charcode assignments

// setuprandomseed()
// stores random strings to be used as noise generator seeds

let setupRandomSeed=(index)=>{

    let result="";

    for(let i=0; i<seedDataLength; i++){
      result+= String.fromCharCode( charStartVal+randInt(maxCharVal) );
    }

    return result;
}

let noiseCounter=0;




function random(){
  let seed = currentLevel;
  //localStorage.removeItem(seedStorageHeader+"0")
  //console.log(random(0),random(0),random(0),random(0),random(0),random(0),random(0));
//  setupRandomSeed(seed);
  let val1 = getNoiseVal(Math.floor(noiseCounter),seed);
  let val2 = getNoiseVal(Math.ceil(noiseCounter),seed);
  noiseCounter+=0.7;

  return (noiseCounter%1)*(val2-val1)+val1;
}

let getNoiseVal=(val,seed)=>
( levelData.seedData.charCodeAt( val % seedDataLength )-charStartVal )/maxCharVal;
