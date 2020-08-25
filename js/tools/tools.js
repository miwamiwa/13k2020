let constrain=(input,min,max)=> Math.min(Math.max(input, min), max);

let checkCollision=(bounds1,bounds2)=> (
    oneDintercept(bounds1.left,bounds1.right,bounds2.left,bounds2.right)
  &&  oneDintercept(bounds1.top,bounds1.bottom,bounds2.top,bounds2.bottom)
);


let oneDintercept=(l1,r1,l2,r2)=> ( r1>=l2 && r1<=r2 ) || ( l1>=l2 && l1<=r2 ) || ( l1<=l2 && r1>=r2 );

let getScreenPos=(input)=> {
  return {
      x: canvas.w2 + input.x-camera.target.x - input.w2,
      y: canvas.h2 + input.y-camera.target.y - input.h2
    }
}

let distance=(x1,y1,x2,y2)=>{
  let adj=x2-x1;
  let opp=y2-y1;
  return{
    d:Math.sqrt( adj*adj+opp*opp ),
    adj:adj,
    opp:opp
  }
}

let getBounds=(el)=> {
  return {
      left:el.x-el.w2,
      right:el.x+el.w2,
      top:el.y-el.h2,
      bottom:el.y+el.h2
    }
}


let div=(box,fill)=>{
  let result = document.createElement("div");
  document.body.appendChild(result);
  if(box!=undefined) setStyle(result,box,fill);
  return result;
}

let setStyle=(el,box,fill)=>
  el.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${fill};`);


let button=(bounds,fill,id,action)=>{
  let result = div(bounds,fill);
  result.id=id;
  at(result,'onclick',action+"()");
  at(result,'onmouseenter',`hover("${id}")`);
  at(result,'onmouseleave',`unhover("${id}","${fill}")`);
  return result;
}


let rad=(angle)=>angle*Math.PI/180;

let l=(i)=> i.length;

let randInt=(max)=>flo(Math.random()*max);

let flo=(i)=> Math.floor(i);


// reach()
//
// move an object obj{x,y} towards target tar{x,y} at speed vel

let reach=(obj,tar,vel)=>{
  if(obj.x+vel<tar.x) obj.x+=vel;
  else if(obj.x-vel>tar.x) obj.x-=vel;
  else obj.x=tar.x;

  if(obj.y+vel<tar.y) obj.y+=vel;
  else if(obj.y-vel>tar.y) obj.y-=vel;
  else obj.y=tar.y;
}

// return the last element in an array
let last=(arr)=> arr[arr.length-1];




let isLevel=(name)=>{
  let s=saveData.levels;
  for(let i=0; i<s.length; i++){
    if(s[i].name==name) return i;
  }
  return -1;
}

let pointTo=(id)=>document.getElementById(id);
