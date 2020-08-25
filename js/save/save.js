let saveDataHeader='sams404gameforjs13kof2020';


function saveGame(){


  localStorage.setItem(saveDataHeader, JSON.stringify(saveData));
}
