let displayProcessUI = false;
let favorites = ["link1","link2","link3","link4"];

let pUI = {
  w:200,
  h:200,
  last:false,
  el:0
}

function runProcessUI(){

  if(displayProcessUI&&!pUI.last){

    pUI.x = canvas.w2-pUI.w/2;
    pUI.y = canvas.h2-pUI.h/2;

    dialogUI.open=false;
    pUI.el = div(pUI,'white');

    let bsize = {x:pUI.x,y:pUI.y,w:pUI.w,h:pUI.h/2};
    pUI.dataButton = button(bsize,'yellow','but1','processDataStrips');
    bsize.y+=pUI.h/2;
    pUI.htmlButton = button(bsize,'orange','but2','processHTMLBits');
  }
  else if(!displayProcessUI&&pUI.last){
    pUI.el.remove();
    pUI.dataButton.remove();
    pUI.htmlButton.remove();
  }

  pUI.last=displayProcessUI;
}

let dataCost = 50;
function processDataStrips(){
console.log("data strps")
findAndRemoveItem(enemyLootTable[0].name,dataCost);

}

let htmlCost = 100;
function processHTMLBits(){
console.log("html bits");
findAndRemoveItem(enemyLootTable[2].name,htmlCost);
}

function div(box,fill){
  let result = document.createElement("div");
  document.body.appendChild(result);
  result.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${fill};`);
  return result;
}

function button(bounds,fill,id,action){
  let result = div(bounds,fill);
  result.id=id;
  at(result,'onclick',action+"()");
  at(result,'onmouseenter',`hover("${id}")`);
  at(result,'onmouseleave',`unhover("${id}","${fill}")`);
  return result;
}

function at(target,attribute,value){
  target.setAttribute(attribute,value);
}

function hover(id,fill){
  document.getElementById(id).style.backgroundColor="grey";
}
function unhover(id,fill){
  document.getElementById(id).style.backgroundColor=fill;
}
