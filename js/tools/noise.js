let seedL=100; // seed length: number of chars in a seed string
let maxchar=100; // maxchar: range of useable charcodes
let charStart = 128; // start index for charcode assignment
let ncount=0; // counter to increment 'noise'



// random()
//
// generates a noise-like random number by looking up a table of randomly generated values

let random=()=>{
  // increment ncount
  ncount+=0.7;
  // store noise value at integer before ncount
  let val = noiz( flo(ncount),currentLevel );

  // return lerp to noise value at integer after ncount
  return (ncount%1)*(noiz( Math.ceil(ncount),currentLevel )-val)+val;
}

// noiz()
//
// get 'random' value from a given character in a seed string

let noiz=(val,seed)=>
( levelData.seedData.charCodeAt( val % seedL )-charStart )/maxchar;


// setuprandomseed()
// create a random strings to be used as seed value for the noiz() function
// this is called when a new level is discovered

let setupRandomSeed=(index)=>{

    let r="";
    for(let i=0; i<seedL; i++)
      r+= String.fromCharCode( charStart+randInt(maxchar) );

    return r;
}
