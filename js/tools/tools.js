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
