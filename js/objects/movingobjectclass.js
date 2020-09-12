

class MovingObject extends DisplayObject {// extends display object class
  constructor(x,y,size,fill){
    super(x,y,size,size);
    this.fill=fill;
    // parameters
    this.hasGravity=true; // object falls if true
    this.fallAcc=2; // fall acceleration
    this.lrMaxSpeed=12; // max horizontal speed
    this.lrAcc=1; // horizontal acceleration
    this.initJumpForce=25;
    this.friction=2;
    // variables
    this.movingLeft=false;
    this.movingRight=false;

    this.jumpForce=0;
    this.jumpDecel = 2.2;
    this.fallSpeed=0;
    this.lrSpeed=0;
    this.impactForce={x:0,y:0};
    this.hitPoints = 100;
    this.jetpacks=false;

  }

  goLeft(){
    this.movingRight = false;
    this.movingLeft = true;
    this.facing="left";
  }

  goRight(){
    this.movingRight = true;
    this.movingLeft = false;
    this.facing="right";
  }

  display(){

    this.moveLeftRight();

    this.applyPhysics();
    let p=this.position();
    if(this.hitPoints<100)
        this.displayHealthBar();

    return p;
  }

  displayHealthBar(){
    progressBar(
      this.screenPos.x,this.screenPos.y-35,30,10,
      this.hitPoints,'red','white' );
  }

  jump(){


    this.jumpForce = this.initJumpForce;
  }

  moveLeftRight(){

      if(this.movingLeft&&!this.movingRight){
        this.lrSpeed -= this.lrAcc;
        this.lrSpeed = Math.max( this.lrSpeed, - this.lrMaxSpeed );
      }
      else if(this.movingRight&&!this.movingLeft){
        this.lrSpeed += this.lrAcc;
        this.lrSpeed = Math.min( this.lrSpeed, this.lrMaxSpeed );
      }
      else {
        if(this.lrSpeed+this.friction<0) this.lrSpeed+=this.friction;
        else if(this.lrSpeed-this.friction>0) this.lrSpeed -= this.friction;
        else this.lrSpeed=0;
      }

      // handle knockback
      if(this.impactForce.x-1>0) this.impactForce.x--;
      else if(this.impactForce.x+1<0) this.impactForce.x++;
      else this.impactForce.x=0;

      this.x += this.lrSpeed + this.impactForce.x;

    }



  applyPhysics(){

    // check if falling
    this.updateFallSpeed();

    if(this.jumpForce-this.jumpDecel>0) this.jumpForce-=this.jumpDecel;
    else this.jumpForce=0;
    // update player position
    if(this.jetpacks) this.fallSpeed=0;
    this.y+= this.fallSpeed - this.jumpForce;
  }

  updateFallSpeed(){

    let p=level1.platforms;
    let nearestPlatform =killLine;

    for(let i=0; i<p.length; i++){
      if(
        // if platform overlaps on x axis
        this.x>p[i].x-p[i].w2
        &&this.x<p[i].x+p[i].w2
        // and is below player
        &&p[i].y>=this.y+this.h/2
        &&p[i].y<nearestPlatform
      ){
        nearestPlatform = p[i].y;
        this.currentPlatform =i;
      }
    }

    // update falling speed
    if(this.y+this.h/2+this.fallSpeed<nearestPlatform){
      this.fallSpeed+=this.fallAcc;
    }
    else{
      this.y=nearestPlatform-this.h/2;
      this.impactForce.y = this.fallSpeed;
      this.fallSpeed = 0;
    }
  }
}
