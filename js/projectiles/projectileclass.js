class Projectile extends MovingObject{

  constructor(x,y,size,fill, speed,targetx,targety){
    super(x,y,size,fill);
    this.destroyed = false;

    this.y-=20;
    this.updateOnScreenPosition();

    let p = this.screenPos;
    let d = distance(p.x,p.y,targetx,targety);
    let ratio = speed/d.d;
    this.speedVect = {
      y: ratio*d.opp,
      x: ratio*d.adj
    }
    //console.log(this.speedVect)
    this.hasGravity=false;
    this.lifeTimer=0;
  }

  updateProjectile(){
    this.lifeTimer++;
    if(!this.destroyed){


      this.x+=this.speedVect.x;
      this.y+=this.speedVect.y;

      this.updateOnScreenPosition();
      if(this.screenPos!=false){

        this.checkForCollisions(level1.platforms,false);
        this.checkForCollisions(enemies,10);
        this.checkWallCollisions();

        ctx.fillStyle=this.fill;
        ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);
      }
    }
    else this.display();

  }

  checkWallCollisions(){
    if(this.x<-sceneW/2
    || this.x>sceneW/2){
      this.stopProjectile();
    }
  }

  checkForCollisions(input,damage){
    for(let i=0; i<input.length; i++){
      if(
        checkCollision(getBounds(input[i]),getBounds(this))

  ){
        this.stopProjectile();

        if(damage!=false){
          input[i].hitPoints -= damage;

          playBlaster(200,6,);
          let d2 = damage/2;
          input[i].impactForce.x+=Math.min(Math.max(input[i].x-this.x,-d2),d2);
        }
      }
    }
  }

  stopProjectile(){
    this.speedVect.x=0;
    this.speedVect.y=0;
    this.destroyed = true;
  }
}
