let canvas = {};
let ctx;
let camera = {};

// setupcamera()
//
// setup canvas since that is the "camera"
// initialize camera target position

function setupCamera(){

  camera.target = {x:player.x,y:player.y};
  camera.w = canvas.w2;
  camera.h = canvas.h2;
  camera.speed = 24;
}

function cameraFollow(x,y){

  y-=50;
  if(camera.target.x+camera.speed<x) camera.target.x+=camera.speed;
  else if(camera.target.x-camera.speed>x) camera.target.x-=camera.speed;
  else camera.target.x=x;

  if(camera.target.y+camera.speed<y) camera.target.y+=camera.speed;
  else if(camera.target.y-camera.speed>y) camera.target.y-=camera.speed;
  else camera.target.y=y;

  camera.left = camera.target.x-camera.w;
  camera.right = camera.target.x+camera.w;
  camera.top = camera.target.y-camera.h;
  camera.bottom = camera.target.y+camera.h;
}
