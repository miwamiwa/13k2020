let saveDataHeader='sams404gameforjs13kof2020';


let saveGame=()=>
  localStorage.setItem(saveDataHeader, JSON.stringify(saveData));
