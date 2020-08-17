let waittime=5;
function runFadeIn(){

  let fact =1;
  if(fadeIn>waittime){
    fact = 1-(fadeIn-waittime)/30;

  }

  if(fact>0){
    ctx.fillStyle='rgba(0,0,0,'+fact+')';
    ctx.fillRect(0,0,canvas.w,canvas.h);
  }

  fadeIn++;
}
