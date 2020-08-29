class Projectile extends MovingObject{

  constructor(x,y,size,fill, speed,targetx,targety,hitsplayer){
    super(x,y,size,fill);
    this.hitsplayer=hitsplayer;
    this.destroyed = false;

    this.y-=20;
    this.position();

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
      ctx.fillStyle='#4a8f';
      this.position();
      this.size=10;
      if(this.screenPos!=false){


          if(!this.hitsplayer){
            this.checkForCollisions(level1.platforms,false);
            this.checkForCollisions(enemies,25);
            ctx.fillStyle=this.fill;
            this.size=3;
          }

          else
            if(checkCollision(getBounds(this),getBounds(player))){
              this.stopProjectile();
              playDamageFX();
              damagePlayer(enemyShooterDamage);
            }

        this.checkWallCollisions();


        ctx.fillRect(this.screenPos.x,this.screenPos.y,this.size,this.size);
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

          let d2 = damage/2;
          if(input[i].type=='spawner'){
            damage = 5;
            input[i].spawnMore();
          }
          else input[i].impactForce.x+=Math.min(Math.max(input[i].x-this.x,-d2),d2);

          playBlaster(200,6,);
          input[i].hitPoints -= damage;
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
