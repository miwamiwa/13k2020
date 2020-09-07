
let datastrip =0;

// addloot()
//
// loot carried data and update word research

let addLoot=()=>{

  if(!textSpawnerGuy.doneSpawning){
    // add data strip
    datastrip++;
    updateInv(datastrip);

    // if we have enough data strips, trigger research
    if(datastrip>dataCost){
      datastrip-=dataCost
      processDataStrips();
      updateInv(datastrip);
    }
  }

}


// updateInv()
//
// updates inventory display

let updateInv=(input)=>{
  
//  aBar.inventory.innerHTML='data strips: '+input+' / '+dataCost;
//  aBar.research.innerHTML=t;
  textSpawnerGuy.spawner2text = "url: "+revealedLink;
}
