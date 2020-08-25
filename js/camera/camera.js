let canvas = {};
let ctx;
let camera = {};

// setupcamera()
//
// setup canvas since that is the "camera"
// initialize camera target position

let setupCamera=()=>{

  camera.target = {x:player.x,y:player.y};
  camera.w = canvas.w2;
  camera.h = canvas.h2;
  camera.speed = 24;
}

// camerafollow()
//
// set viewport target

let cameraFollow=(x,y)=>{

  y-=50;
  // move towards target
  reach(camera.target,{x:x,y:y},camera.speed);

  camera.left = camera.target.x-camera.w;
  camera.right = camera.target.x+camera.w;
  camera.top = camera.target.y-camera.h;
  camera.bottom = camera.target.y+camera.h;
}
