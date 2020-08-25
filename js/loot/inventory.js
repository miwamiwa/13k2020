let inventoryDisplayed = false;
let carriedDataStrips =0;


function addLoot(){

  carriedDataStrips++;
  updateInv(carriedDataStrips);


  if(carriedDataStrips>dataCost){

    carriedDataStrips-=dataCost
    let t = carriedDataStrips;

    setTimeout(function(input){

      processDataStrips();
      updateInv(input);


    },300,t);

  }


}

function updateInv(input){
  let t = "";
  if(revealedLink!="") t=". Next url: "+revealedLink;
  aBar.inventory.innerHTML='data strips: '+input+' / '+dataCost+t;
}













function addToInventory(name,quantity){

  let alreadyHave = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name){
      alreadyHave = true;
      inventory[i].quantity+=quantity;
    }
  }
  if(!alreadyHave) inventory.push({name:name,quantity:quantity});
  updateInventoryDisplay();
}

function removeItem(name,quantity){
  let have = haveItem(name,quantity);
  console.log(have)
  if(have!=-1){
    inventory[have].quantity-=quantity;
    if(inventory[have].quantity==0) inventory.splice(have,1);
  }

  updateInventoryDisplay();
}

function haveItem(name,quantity){
  let result = -1;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name&&inventory[i].quantity>=quantity) result = i;
  }
  return result;
}

function findAndRemoveItem(name,quantity){
  let result = haveItem(name,quantity);
  //console.log(result,name)
  if(result!=-1) removeItem(name,quantity);
//  console.log(result);

//  updateInventoryDisplay();


  return result;
}

let slotSize=40;
let slotmargin=5;


function updateInventoryDisplay(){

  let items = document.getElementsByClassName("invitem");
  for(let i=0; i<items.length; i++){
    items[i].remove();
  }
  let bounds = {
    x:canvas.x+slotmargin,
    y:aBar.y+slotmargin,
    w:slotSize,
    h:slotSize
  }
  for(let i=0; i<inventory.length; i++){

    let fill = "white";
    let index=0;
    for(let j=0; j<enemyLootTable.length; j++){
      if(enemyLootTable[j].name==inventory[i].name) fill = enemyLootTable[j].fill;
    }

    let el = div(bounds,fill);
    el.setAttribute("class","invitem");
    bounds.x+=slotSize+5;
    el.style.fontSize='10px';
    el.setAttribute("onclick","useItem('"+inventory[i].name+"')");
    el.innerHTML = inventory[i].name+" ("+inventory[i].quantity+")";
  }
}

function useItem(name){
//  console.log("use "+name)
  if(name==enemyLootTable[3].name){
  //  console.log("health uppp!")
    player.hitPoints = Math.min(player.hitPoints+20, 100);
    removeItem(name,1);
  }
  else if(name==cleaningitem&&currentLevel!='home'&&currentLevel!='true404'){
    cleanLevel();
    removeItem(name,1);
  }
}

function cleanLevel(){
  console.log("level cleaned!");
  let index = saveData.seedIndex.indexOf(currentLevel);
  clearedStates[index]=true;
  level1.cleared = true;
  favoritesStatus[index]='Cleared!';
}
