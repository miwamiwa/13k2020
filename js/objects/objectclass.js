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
    if(targetx<this.screenPos.x) this.facing='left';
    else this.facing='right';
    projectiles.push(new Projectile(this.x,this.y,4,"black",speed,targetx,targety));
  }
}
