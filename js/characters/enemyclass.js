let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;

function updateEnemies(){

  // if this is a level with enemies
  if(currentLevel!='home'&&currentLevel!='start'){
    // UPDATE ENEMIES:

    for(let i=enemies.length-1; i>=0; i--){
      // move and display enemy
      enemies[i].update();

      // if enemy killed:
      if(enemies[i].hitPoints<=0){

        // generate loot at enemy position and remove enemy
        generateLoot(enemies[i]);
        enemies.splice(i,1);

        // update level completion
        level1.completion=Math.min(level1.completion+5,100);
        completions[level1.arrayindex]=level1.completion;

        // start cleasing background
        level1.uncorrupting=true;
        // if level isn't complete yet, set timeout to stop cleansing
        // ( if level is complete, cleasing continues until done )
        if(level1.completion<100)
          setTimeout(function(){level1.uncorrupting=false;},2000);
      }
    }


    // SPAWN ENEMIES:

    // phase 1,
    // when first enemy is killed:
    if(enemies.length==0&&!firstEnemyKilled){

      // update top platform, enable going down
      cantGoDown = false;
      level1.platforms[level1.platforms.length-1].fill = platformFill;

      // start level phase 2
      firstEnemyKilled = true;
      let index=saveData.seedIndex.indexOf(currentLevel);
      favoritesStatus[index] = "Unlocked. Difficulty: "+level1.enemyDifficulty;
    }


    // phase 2,
    // while level isn't cleared
    if(firstEnemyKilled&&!level1.cleared){
      // if level isn't complete and there are less than the max number of enemies
      if(enemies.length<maxEnemies && level1.completion<100){

        // spawn new enemy every 100 frames
        enemyUpdateCounter++;
        if(enemyUpdateCounter%100==0){
          // pick a random platform
          let pick=Math.floor(Math.random()*level1.platforms.length);
          let plat = level1.platforms[pick];
          // spawn enemy
          enemies.push(new Enemy(plat.x,plat.y-80,pick));
        }
      }
    }
  }
}

class Enemy extends MovingObject {

  constructor(x,y,p){
    let fill = '#cc30';
    let size = 40;

    super(x,y,size,fill);
    this.currentPlatform=p;
    this.newTarget();
    this.targetReachDistance=10;
    this.targetCounter=0;
    this.roaming = true;
    this.goalReachedAction='none';
    this.jumpy=true;
    this.roamPauseLength=1600;
    this.attackCounter=0;
    this.nextAttack=0;
    this.attackInterval=25;
    this.facing;
    this.attackPower = 20;
    this.dashInterval = 20;
    this.nextDash=0;
    this.dashCount=15;
    this.facing='left';
    this.lastRoamingState=false;
    this.attackAnimOverTimeout;
    this.model = new CoolPath(0,0,
      ":=:=Febqfmnnqlsht`y^o`i*;<:HGsgn_j`a`cmkj*<<:JBW@v]j^ld*=<:JBW@vmnklg*>::JFGI^^^_`_*?=:TPwororsrxwvws*@=:OUrrwtvw*@<:STzxzzvyozrzrx*A=:OProwowsvwrxrs*B=:STwtrrrx*B<:STzxzzvyozrzrx*<<:NAPDRATCV@*;;:H@mhfifefbiakc*;=:ECfgfchcjbkghf",
      "CK1iiagtbctdEB0I@0IC0FF0lc_lf`he^QN0tucQR0QN0tueQR0",
      "*still*Z]]]]Y]]]]*****\\I*XI*YIaQ***walk*F]]]]`Qh]]*****\\@*c@*W@*N@**attack*Fa]]]]RdXa*c<e>**S<]>*`<]>*W<^>*N<S>*d<_>*X<d>*o<j>*dash*R`]]]]PeQs*`F*^L*TL\\N*jL\\N*c@\\FWL^N*a@PF^L*k@fF*S@QFOL*c@sF^L",
      ["rgba(142,203,0,0.0)","rgba(255,232,200,1.0)","rgba(177,91,0,1.0)","rgba(247,141,0,1.0)"]);
    }

    update(){

      // ATTACK :

      // count frames
      this.attackCounter++;
      // get distance to player
      let d = distance(player.x,player.y,this.x,this.y);
      // when attack cooldown is over
      if(this.nextAttack<this.attackCounter){
        // if player is in range
        if(d.d<30&&player.currentPlatform==this.currentPlatform){
          // damage player
          damagePlayer(this.attackPower);
          // start attack animation
          this.animate(2);
          // set cooldown
          this.nextAttack = this.attackCounter+this.attackInterval;
          // reset enemy animation
          this.attackAnimOverTimeout=setTimeout(function(enemy){if(enemy.roaming)enemy.animate(1); else enemy.animate(0);},400,this);
        }
      }



      // UPDATE HEALTH :

      // regen health
      if(this.hitPoints<100) this.hitPoints+= 0.2;
      this.display();



      // MOVE :

      if(this.roaming){


        // DASH:

        // start dash
        if(
          player.currentPlatform==this.currentPlatform // player is on same platform
          &&this.nextDash<this.attackCounter // dash cooldown is over
          &&d.d<220 // player is in rangge
        ){
          // reset dash cooldown & counter
          this.nextDash = this.attackCounter+this.dashInterval;
          this.dashCount=0;

          // set target
          this.target = player.x - 30 + Math.random()*60;

          // start dash animation
          clearTimeout(this.attackAnimOverTimeout); // clear animation reset if active
          this.animate(3);
        }

        // start still animation if not moving
        else if(!this.lastRoamingState) this.animate(1);

        // if dashing
        if(this.dashCount<15){
          this.dashCount++;
          // update max speed
          this.lrMaxSpeed=7;
          // on dash end set animatino
          if(this.dashCount==15) this.animate(1);
        }
        // if not dashing, update max speed
        else this.lrMaxSpeed=2;

        // update position:

        // if target not reached, move right/left
        if(this.x+this.targetReachDistance<this.target) this.goRight();
        else if(this.x-this.targetReachDistance>this.target) this.goLeft();


        // if target reached :
        else {

          this.roaming = false;
          this.movingRight = false;
          this.movingLeft = false;

          // move up or down
          if(this.targetCounter%3==0){
            if(this.goalReachedAction=='up') this.jump();
            else if(this.goalReachedAction=='down') this.y+=4;
          }

          // start still animatino
          this.animate(0);

          // set new target and start roaming after a pause
          setTimeout(function(target){
            target.roaming = true;
            target.newTarget();
          },this.roamPauseLength, this)
        }
      }

      // if this guy is on screen, display model
      if(this.screenPos!=false){
        this.model.x=this.screenPos.x+20;
        this.model.y=this.screenPos.y+20;
        this.model.update(ctx,(this.facing=='left'));
      }


      this.lastRoamingState = this.roaming;
    }

    animate(index){
      clearTimeout(this.attackAnimOverTimeout);
      this.model.selectAnimation(index);
    }

    newTarget(){

      this.targetCounter++;
      // get this enemy's current platform and player's current platform
      let p = level1.platforms[this.currentPlatform];
      let pp = level1.platforms[player.currentPlatform];

      // if enemy and player are on same platform
      if(p.y==pp.y)
        this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;

      else{
        // if this platform is lower

          let p1 = getBounds(p);
          let tarfound=false;
          for(let i=0; i<level1.platforms.length; i++){

            if(tarfound) return;
            let p2 = getBounds(level1.platforms[i]);
            let x=-1;
            let r=-1;

            if(p1.left>=p2.left&&p1.right<=p2.right){
              x=p1.left;
              r=p.w;
            }
            else if(p1.left<=p2.left&&p1.right>=p2.right){
              x=p2.left;
              r=level1.platforms[i].w;
            }
            else if(p2.right>=p1.left&&p2.right<=p1.right){
              x=p1.left;
              r=p2.left+level1.platforms[i].w - p1.left;
            }
            else if(p2.left>=p1.left&&p2.left<=p1.right){
              x=p2.left;
              r=p1.left+p.w-p2.left;
            }

            if(x!=-1){
              let diff = level1.platforms[i].y - p.y;
              if(p.y<pp.y && diff>0 && diff < 150){
                console.log('moving down')
                tarfound=true;
                this.target = x+randInt(r);
                this.goalReachedAction='down'
              }
              else if(p.y>pp.y && diff<0 && diff > -100){
                tarfound=true;
                this.target = x+randInt(r);
                this.goalReachedAction='up';
              }

            }

          }

          if(!tarfound) this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;
      }
    }


  }
