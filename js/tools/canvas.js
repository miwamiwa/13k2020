let canvasElw;
let canvasElh;

function createCanvas(){
  canvas.w = 800;
  canvas.h = 600;
  canvas.w2=canvas.w/2;
  canvas.h2=canvas.h/2;

  canvas.c = document.createElement("canvas");
  canvas.c.setAttribute("width",canvas.w);
  canvas.c.setAttribute("height",canvas.h);



  //canvas.c.setAttribute("style",``);
  ctx = canvas.c.getContext("2d");


}
/*
window.onresize=resizeCanvas;
function resizeCanvas(){


}
*/
