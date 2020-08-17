function createCanvas(){
  canvas.w = 500;
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
