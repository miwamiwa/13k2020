function distance(x1,y1,x2,y2){
  let adj=x2-x1;
  let opp=y2-y1;
  return{
    d:Math.sqrt( adj*adj+opp*opp ),
    adj:adj,
    opp:opp
  }
}

function getBounds(el){
  return {
    left:el.x-el.w2,
    right:el.x+el.w2,
    top:el.y-el.h2,
    bottom:el.y+el.h2
  }
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
