let canvasElw;
let canvasElh;

let createCanvas=()=>{
  canvas.w = 800;
  canvas.h = 600;
  canvas.w2=canvas.w/2;
  canvas.h2=canvas.h/2;

  canvas.c = document.createElement("canvas");
  canvas.c.setAttribute("width",canvas.w);
  canvas.c.setAttribute("height",canvas.h);



  //canvas.c.setAttribute("style",``);
  ctx = canvas.c.getContext("2d");

  ctx.filter = 'contrast(1.5) drop-shadow(1px 1px 2px #000)';
}
/*
window.onresize=resizeCanvas;
function resizeCanvas(){


}
*/
