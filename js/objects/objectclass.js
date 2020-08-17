class DisplayObject{

  constructor(x,y,w,h){

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.w2=this.w/2;
    this.h2=this.h/2;
  }

  updateOnScreenPosition(){

    let bounds = getBounds(this);

    // if object is on screen, then update screen pos.
    if( checkCollision(bounds,camera) ) this.screenPos = getScreenPos(this);
    // if it is offscreen screenpos is false.
    else this.screenPos = false;
  }

  limitX(){
    this.x = Math.min(Math.max(this.x,-sceneW/2),sceneW/2);
  }

  shoot(targetx,targety,speed){

    projectiles.push(new Projectile(this.x,this.y,4,"black",speed,targetx,targety));
  }
}

function checkCollision(bounds1,bounds2){
  return (
    ( bounds1.right>=bounds2.left && bounds1.right<=bounds2.right )
    || ( bounds1.left>=bounds2.left && bounds1.left<=bounds2.right )
    || ( bounds1.left<=bounds2.left && bounds1.right>=bounds2.right )
  )
  &&(
    ( bounds1.bottom>=bounds2.top && bounds1.bottom<=bounds2.bottom)
    || ( bounds1.top>=bounds2.top && bounds1.top<=bounds2.bottom )
    || ( bounds1.top<=bounds2.top && bounds1.bottom>=bounds2.bottom )
  )
}

function getScreenPos(input){
  return {
    x: canvas.w2 + input.x-camera.target.x - input.w2,
    y: canvas.h2 + input.y-camera.target.y - input.h2
  }
}
