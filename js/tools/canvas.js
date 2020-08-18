let canvasElw;
let canvasElh;

function createCanvas(){
  canvas.w = 600;
  canvas.h = 400;
  canvas.w2=canvas.w/2;
  canvas.h2=canvas.h/2;

  canvas.canvas = document.createElement("canvas");
  canvas.canvas.setAttribute("width",canvas.w);
  canvas.canvas.setAttribute("height",canvas.h);


  document.body.appendChild(canvas.canvas);
  //canvas.canvas.setAttribute("style",``);
  ctx = canvas.canvas.getContext("2d");

  let bounds = canvas.canvas.getBoundingClientRect();
  canvas.x = Math.round(bounds.x);
  canvas.y = Math.round(bounds.y);
}

window.onresize=resizeCanvas;
function resizeCanvas(){


  let pos= {
    x:canvas.x,
    y:canvas.y+canvas.h,
    w: canvas.w,
    h: 50,
  }
  setStyle( actionBar.el,pos,actionBarFill );

  pos.w=pos.w*0.9;
  setStyle( actionBar.inventory,pos,'grey');

  pos.x+=pos.w;
  pos.w=pos.w*0.1/0.9;
  setStyle( actionBar.right,pos,'blue');
}
