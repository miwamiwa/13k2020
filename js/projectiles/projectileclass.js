class Projectile extends MovingObject{

  constructor(x,y,size,fill, speed,targetx,targety,hitsplayer){
    super(x,y,size,fill);
    this.hitsplayer=hitsplayer;
    this.destroyed = false;

    this.y-=20;


    let p = this.position();
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
      cFill('#4a8f');
      let p=this.position();
      this.size=10;
      if(p!=false){


          if(!this.hitsplayer){
            this.checkForCollisions(level1.platforms,false);
            this.checkForCollisions(enemies,25);
            cFill(this.fill);
            this.size=3;
          }

          else
            if(checkCollision(getBounds(this),getBounds(player))){
              this.stopProjectile();
              this.bump(player,8)
              playDamageFX();
              damagePlayer(enemyShooterDamage);
            }

        this.checkWallCollisions();


        cRect(p.x,p.y,this.size,this.size);
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
      if( checkCollision(getBounds(input[i]),getBounds(this)) ){

        this.stopProjectile();

        // if an emey is hit
        if(damage!=false){
          if(input[i].type=='spawner'){
            damage = 5;
            input[i].spawnMore();
          }
          else this.bump(input[i],4);

          playBlaster(200,6,);
          input[i].hitPoints -= damage;
        }
      }
    }
  }

  bump(input,d){
    input.impactForce.x+=Math.min(Math.max(input.x-this.x,-d),d);
  }

  stopProjectile(){
    this.speedVect.x=0;
    this.speedVect.y=0;
    this.destroyed = true;
  }
}
