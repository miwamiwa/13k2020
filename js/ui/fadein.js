let waittime=5;


// runfadein()
//
// called in main loop. handles fading screen from black.

let runFadeIn=()=>{

  let fact =1;
  if(fadeIn>waittime) fact = 1-(fadeIn-waittime)/30;

  if(fact>0){
    ctx.fillStyle='rgba(0,0,0,'+fact+')';
    ctx.fillRect(0,0,canvas.w,canvas.h);
  }

  fadeIn++;
}


// fade()
//
// trigger fading screen from black over a given number of frames

let fade=(time)=>{
  fadeIn =0;
  waittime=time;
}
