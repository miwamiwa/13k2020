
let carriedDataStrips =0;

// addloot()
//
// loot carried data and update word research

let addLoot=()=>{

  // add data strip
  carriedDataStrips++;
  updateInv(carriedDataStrips);

  // if we have enough data strips, trigger research
  if(carriedDataStrips>dataCost){
    carriedDataStrips-=dataCost
    processDataStrips();
    updateInv(carriedDataStrips);
  }
}


// updateInv()
//
// updates inventory display

let updateInv=(input)=>{
  let t = "";
  if(revealedLink!="") t=". Next url: "+revealedLink;
  aBar.inventory.innerHTML='data strips: '+input+' / '+dataCost;
  aBar.research.innerHTML=t;
}
