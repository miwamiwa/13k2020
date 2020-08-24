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



  //canvas.canvas.setAttribute("style",``);
  ctx = canvas.canvas.getContext("2d");


}

window.onresize=resizeCanvas;
function resizeCanvas(){


}
