let noiseSeed =0;

let seedStorageHeader="sams404gameseed";
let randomSeeds = [];
let seedData = [];
let seedDataLength=100;
let maxCharVal=100;
let charStartVal = 128; // start index for charcode assignments

// setuprandomseed()
// stores random strings to be used as noise generator seeds
// or retrieves already stored random strings

function setupRandomSeed(index){

  if(!randomSeeds.includes(index)){
    let storedval=localStorage.getItem(seedStorageHeader+index);
    if(storedval!=null){
      //console.log("got storage item "+index);
      seedData.push(storedval);
    }
    else {
      let result="";
      for(let i=0; i<seedDataLength; i++){
        result+= String.fromCharCode( charStartVal+Math.floor(Math.random()*maxCharVal) );
      }
      seedData.push(result);
      //console.log("set storage item "+index);
      localStorage.setItem( seedStorageHeader+index, result );
    }
    randomSeeds.push(index);
  }
}

let noiseCounter=0;

function random(){
  let seed = noiseSeed;
   localStorage.removeItem(seedStorageHeader+"0")
  //console.log(random(0),random(0),random(0),random(0),random(0),random(0),random(0));
  setupRandomSeed(seed);
  let val1 = getNoiseVal(Math.floor(noiseCounter),seed);
  let val2 = getNoiseVal(Math.ceil(noiseCounter),seed);
  noiseCounter+=0.7;

  return (noiseCounter%1)*(val2-val1)+val1;
}

function getNoiseVal(val,seed){
  val = val % seedDataLength;
  return ( seedData[randomSeeds.indexOf(seed)].charCodeAt(val)-charStartVal )/maxCharVal;
}
