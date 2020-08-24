function checkCollision(bounds1,bounds2){
  return (
    oneDintercept(bounds1.left,bounds1.right,bounds2.left,bounds2.right)
  &&  oneDintercept(bounds1.top,bounds1.bottom,bounds2.top,bounds2.bottom)
)
}

function oneDintercept(l1,r1,l2,r2){
return  ( r1>=l2 && r1<=r2 )
|| ( l1>=l2 && l1<=r2 )
|| ( l1<=l2 && r1>=r2 )
}

function getScreenPos(input){
  return {
    x: canvas.w2 + input.x-camera.target.x - input.w2,
    y: canvas.h2 + input.y-camera.target.y - input.h2
  }
}

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
  if(box!=undefined) setStyle(result,box,fill);
  return result;
}

function setStyle(el,box,fill){
  el.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${fill};`);
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

function rad(angle){
  return angle*Math.PI/180;
}

function l(i){
  return i.length;
}

function randInt(max){
  return flo(Math.random()*max);
}

function flo(inp){
  return Math.floor(inp);
}
