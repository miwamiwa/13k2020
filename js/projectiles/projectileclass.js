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

    this.hasGravity=false;
    this.lifeTimer=0;
  }

  updateProjectile(){
    this.lifeTimer++;
    if(!this.destroyed){

      // update position
      this.x+=this.speedVect.x;
      this.y+=this.speedVect.y;

      // if projectile is on screen
      let p=this.position();
      if(p!=false){

        // if this is a player projectile
        if(!this.hitsplayer){
          // check collisions with walls
          this.checkForCollisions(level1.platforms,false);
          // check collisions with enemies
          this.checkForCollisions(enemies,25);
          // set fill & size
          if(saveData.gameProgress.includes('r1')) this.fs('#bb1', 10);
          else this.fs(this.fill,4);
        }

        // if this is an enemy projectile
        else{
          this.fs('#b66f',10);
          // check collision with player
          if(checkCollision(getBounds(this),getBounds(player))){
            this.stopProjectile();
            this.bump(player,8);
            poof(player.x,player.y,['orange']);
            playDamageFX();
            damagePlayer(enemyShooterDamage);
          }
        }

        // check collision with level boundaries
        this.checkWallCollisions();
        let i = this.lifeTimer%6; // pulsate
        cRect(p.x-i,p.y-i,this.size+2*i,this.size+2*i);
        cRect(p.x,p.y,this.size,this.size,'white');
      }
    }
    // if projectile is stopped:
    else{
      // apply gravity
      let p=this.display();
      // display
      if(p!=false) cRect(p.x,p.y,this.size,this.size,'white');
    }
  }

  // fs()
  //
  // set projectile fill and size

  fs(f,s){
    cFill(f);
    this.size=s;
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

          // if an enemy is hit
          if(damage!=false){
            // apply damage boost
            if(awarded('r1')) damage*=2;
            damage -= 2*(levelData.difficulty-1)
            // do different things to different enemies:
            if(input[i].type=='spawner') input[i].spawnMore();
            else if(input[i].type=='minispawner') input[i].popspawner();
            else if(input[i].type=='boss') input[i].hitPoints -= damage/6;
            else if(input[i].type!='spawner2'){
              this.bump(input[i],4);
              input[i].hitPoints -= damage;
            }

            playBlaster(200,6,);

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
