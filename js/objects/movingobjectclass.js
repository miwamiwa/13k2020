class MovingObject extends DisplayObject {// extends display object class
  constructor(x,y,size,fill){
    super(x,y,size,size);
    this.fill=fill;
    // parameters
    this.hasGravity=true; // object falls if true
    this.fallAcc=2; // fall acceleration
    this.lrMaxSpeed=10; // max horizontal speed
    this.lrAcc=1; // horizontal acceleration
    this.lrFriction=2; // deceleration while not moving
    this.initJumpForce=25;
    // variables
    this.movingLeft=false;
    this.movingRight=false;

    this.jumpForce=0;
    this.jumpDecel = 2.2;
    this.fallSpeed=0;
    this.lrSpeed=0;
    this.impactForce={x:0,y:0};
    this.hitPoints = 100;
  }

  display(){

    this.moveLeftRight();
    this.applyPhysics();
    this.updateOnScreenPosition();
    if(this.screenPos!=false){

      ctx.fillStyle=this.fill;
      ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);

      if(this.hitPoints<100){
        this.displayHealthBar();
      }
    }
  }

  displayHealthBar(){

    let w = 30;
    let h = 10;
    let y = this.screenPos.y-25;
    let x = this.screenPos.x;
    ctx.fillStyle = "white";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "red";
    ctx.fillRect(x,y,w*this.hitPoints/100,h);
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
        if(this.lrSpeed+this.lrFriction<0) this.lrSpeed+=this.lrFriction;
        else if(this.lrSpeed-this.lrFriction>0) this.lrSpeed -= this.lrFriction;
        else this.lrSpeed=0;
      }

      if(this.impactForce.x>0) this.impactForce.x--;
      else if(this.impactForce.x<0) this.impactForce.x++;

      this.x += this.lrSpeed + this.impactForce.x;

    }



  applyPhysics(){

    // check if falling
    this.updateFallSpeed();


    // do something with impact force:
    if(this.impactForce.y>0) console.log(this.impactForce.y);
    if(this.jumpForce-this.jumpDecel>0) this.jumpForce-=this.jumpDecel;
    else this.jumpForce=0;
    // update player position
    this.y+= this.fallSpeed - this.jumpForce;
  }

  updateFallSpeed(){

    let p=level1.platforms;
    let nearestPlatform =killLine;
    //console.log("chck "+this.speedVect)
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
      if(this.impactForce.y>36) this.hitPoints -= this.impactForce.y/2;
      this.fallSpeed = 0;

    //  console.log("bang")
    }
  }
}
