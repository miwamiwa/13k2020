let displayLinksUI = false;
let lastdisplayState = false;
let linksUI = {
  w:260,
  h:80
};
let linkLoadTime=800;
let linksUIel;
let textform;
let listform;

function runLinksUI(){

  if(displayLinksUI){
    if(!lastdisplayState){
      lastdisplayState =true;
      dialogUI.open=false;

      linksUI.x = canvas.w2-linksUI.w/2 + canvas.x;
      linksUI.y = canvas.h2-linksUI.h/2 + canvas.y;

      linksUIel = document.createElement('div');
      linksUIel.setAttribute("style",`padding:10px;position:fixed;left:${linksUI.x}px;top:${linksUI.y}px;width:${linksUI.w}px;height:${linksUI.h}px;background-color:white;font-size:14px;`);

      let options = "";
      for(let i=0; i<favorites.length; i++){
        options+=`<option value="${favorites[i]}">status: unknown</option>`
      }

      linksUIel.innerHTML = `Choose from favorites:<br><input list="browsers" name="browser" id="browser" onchange='inputListChanged()'>
      <datalist id="browsers">
      ${options}
      </datalist></input>
      <br>Or type url name:<br>
      <input type="text" id="fname" name="fname" value="custom url" onkeydown='formKeyDown()' onclick='formclick()'>
      <div style='font-size:12px;position:absolute; right:26px;top:10px;'><br>select a list<br>item, or type<br>url name and <br>press enter</div>
      `;
      document.body.appendChild(linksUIel);

      textform=document.getElementById("fname");
      listform=document.getElementById("browser");
    }


  }
  else{
    if(lastdisplayState) linksUIel.remove();
    lastdisplayState = false;

  }
}

function formclick(){
  textform.value="";
}

function formKeyDown(){

  if(event.keyCode==13){
    textform.value = textform.value.trim();
    goToLink();
  }
}

function inputListChanged(){

  textform.value=listform.value;
  goToLink();
}

function goToLink(){

  let tinput = textform.value;
  let linput = listform.value;
  let result = linput;
  if(tinput!=linput) result = tinput;
  linksUIel.innerHTML = "loading "+result+"!";
  fadeIn =0;
  waittime=24;

  setTimeout(function(){
    displayLinksUI = false;
    currentLevel =0;
    createLevel();
    createPlayer();
  },linkLoadTime);

}
