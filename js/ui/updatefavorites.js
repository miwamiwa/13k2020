let tFormSelected = false;

// updatefavorites();
//
// populate the Select element that contains the favorites list
let updateFavorites=()=>{

  // setup options text
  let options = `<option> home </option>`;
  if(currentLevel=='start'&&saveData.levels.length==0) options='';

  for(let i=0; i<saveData.levels.length; i++){
    let j=saveData.levels[i];
    options+=`<option>${j.name} difficulty: ${j.difficulty}</option>`
  }
  // setup favorites text
  let fav = `favorites:<select id="favorites" onchange=inputListChanged()> ${options} </select>`

  // setup address bar
  linksUIel.innerHTML = ` <span onclick='back()'> < </span> <span onclick='forward()'> > </span>
  www.coolshoes.com/<input type='text' id='tinput' onkeydown='formKeyDown()'></input>
  <span onclick='goToLink()'>go</span>
  ${fav}  `;

  // pointto() is short for getdocbyid() lol
  textform=pointTo("tinput");
  listform=pointTo("favorites");
  // disable player inputs when typing in text form
  textform.onfocus=()=>tFormSelected=true;
  textform.onblur=()=>tFormSelected=false;

  saveGame();
}

let back=()=>console.log("back");
let forward=()=>console.log("forward");
