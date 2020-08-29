let waittime=5;


// runfadein()
//
// called in main loop. handles fading screen from black.

let runFadeIn=()=>{

  let fact =1;
  if(fadeIn>waittime) fact = 1-(fadeIn-waittime)/30;

  if(fact>0){
    cFill('rgba(0,0,0,'+fact+')');
    cRect(0,0,canvas.w,canvas.h);
    cFill('white');
    cFont('20px Courier New')
    cText(fadetxt,canvas.w/2-30,canvas.h/2-2);
  }

  fadeIn++;
}

let fadetxt='';
// fade()
//
// trigger fading screen from black over a given number of frames

let fade=(time,text)=>{
  fadeIn =0;
  waittime=time;
  if(text!=undefined) fadetxt=text;
  else fadetx='';
}
