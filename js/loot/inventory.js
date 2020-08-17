let inventoryDisplayed = false;

function addToInventory(name,quantity){

  let alreadyHave = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name){
      alreadyHave = true;
      inventory[i].quantity+=quantity;
    }
  }
  if(!alreadyHave) inventory.push({name:name,quantity:quantity});
}

function removeItem(name,quantity){
  let have = haveItem(name);
  if(have!=false){
    inventory[i].quantity-=quantity;
    if(inventory[i].quantity==0) inventory.splice(i,1);
  }
}

function haveItem(name,quantity){
  let result = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name&&inventory[i].quantity>=quantity) result = i;
  }
  return result;
}

function findAndRemoveItem(name,quantity){
  if(haveItem(name,quantity)) removeItem(name,quantity);
}
