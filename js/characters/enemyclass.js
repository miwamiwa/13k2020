let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;

let enemyShooterDamage = 10;

let updateEnemies=()=>{

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



        if(enemies.length==1){
          console.log("all enemies ded");

          // if level isn't cleared yet, add a new section
          if(levelData.sections<levelData.difficulty){
            levelData.sections++;
            continueLevel(true);
          }

          else{
            // if level is cleared
            levelData.cleared=true;
          }

        }

        enemies.splice(i,1);
        // update level completion

        //completions[level1.arrayindex]=levelData.completion;

        // start cleasing background
        level1.uncorrupting=true;
        // if level isn't complete yet, set timeout to stop cleansing
        // ( if level is complete, cleasing continues until done )
        if(levelData.completion<100)
        setTimeout(function(){level1.uncorrupting=false;},2000);
      }
    }


}
}

class Enemy extends MovingObject {

  constructor(x,y,p,sIndex,type){
    let fill='#cc30';
    if(type=='spawner') fill='#cc3f';
    super(x,y,40,fill);
    this.type=type;
    //  this.sIndex=sIndex;
    this.currentPlatform=p;
    this.newTarget();
    this.targetReachDistance=10;
    this.targetCounter=0;
    this.roaming = true;
    this.goalReachedAction='none';
    this.jumpy=true;
    this.roamPauseLength=200;
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


    if(type=='flyer'){
      this.model=new CoolPath(0,0,fedata);
      this.model.colors[2] = "rgba(147,141,220,1.0)";
    }
    else{
      this.model = new CoolPath(0,0, edata);
      if(type=='shooter') this.model.colors[2] = "rgba(147,241,5,1.0)";
    }
    // spawner variables

    this.sIndex=sIndex;
    this.spawnInterval=200;
    this.spawnCounter=0;
    this.enemyCount=0;
    this.flightTargets =[];
    this.flightVel=4;
    this.flightDir=1;
    if(Math.random()>.5) this.flightDir=-1;
    this.nextSpawn=0;
  }

  updateSpawner(){
  let p=  this.display();
  if(p!=false) cRect(p.x,p.y,40,40,'gold');
   this.spawnCounter++;

  }

  spawnMore(){

//this.nextSpawn--;
    for(let i=0; i<3; i++){
      let choice='fighter'
      if(Math.random()>0.5) choice='shooter';
//else if(pick>0.33) choice='shooter';

    //  this.enemyCount++;
    //  this.nextSpawn=this.spawnCounter+50;
      enemies.push(new Enemy(this.x - 100 + randInt(200),this.y-80,this.currentPlatform,this.sIndex,choice));
    }
  }



  update(){

    if(this.type=='spawner'){
      this.updateSpawner();
      return
    }

    this.display();


    if(this.screenPos!=false){


      // count frames
      this.attackCounter++;
      // get distance to player
      let d = distance(player.x,player.y,this.x,this.y);

      if(this.type=='fighter'){
        // trigger attack when player is at a certain distance
        this.fight(d);
        // move randomly on a platform or up/down towards player
        this.roam(d);
      }
      else if(this.type=='flyer'){
        this.fallSpeed=0;
        this.enemyShooter(d);
        this.fly(d);
      }
      else if(this.type=='shooter'){
        this.enemyShooter(d);
        this.roam(d);
      }


      // regen health
      if(this.hitPoints<100) this.hitPoints+= 0.2;

      //display model
      this.model.x=this.screenPos.x+20;
      this.model.y=this.screenPos.y+20;
      this.model.update(ctx,(this.facing=='left'));

    }
  }

  flyBy(){
    let t = {x:this.x,y:player.y-60-10+randInt(20) };
    if(this.flightTargets.length>0){
      t = this.flightTargets[0];
      t.y+=-60-10+randInt(20);
    }

    let pmargin=200;
    if(this.x<player.x-pmargin) this.flightDir=1;
    else if(this.x>player.x+pmargin) this.flightDir=-1;

  //  //console.log(this.flightDir)
    t.x+= this.flightDir*randInt(100);


    //console.log("added target ",t)
    this.flightTargets.push(t);
  }

  fly(d){

    if(this.flightTargets.length==0){
      // if need new target
      if(d.d<130){
        //console.log("go to player")
        this.flightTargets.push({x:player.x,y:player.y});
        this.flyBy();

      }
      else this.flyBy();

    }
    else {
      // if have a target, move to target
    //  //console.log("flying")
      let d2 = distance(this.flightTargets[0].x,this.flightTargets[0].y,this.x,this.y);

        let reached=reach(this,this.flightTargets[0],this.flightVel);
        if(reached) this.flightTargets.shift();

        //console.log(this.x,this.y)
    }
  }

  enemyShooter(d){

    if(this.nextAttack<this.attackCounter){
      // if player is in range
      if(d.d<200&&player.y>this.y-100&&player.y<this.y+100){

        playBlaster(800,1);
        this.shoot(player.screenPos.x,player.screenPos.y,10,true);
        // start attack animation
        this.animate(2);
        // set cooldown
        this.nextAttack = this.attackCounter+this.attackInterval;
        // reset enemy animation
        this.resetEnemyAnim();
      }
    }

  }

  resetEnemyAnim(){
    this.attackAnimOverTimeout=setTimeout(function(enemy){if(enemy.roaming)enemy.animate(1); else enemy.animate(0);},400,this);
  }

  fight(d){
    // ATTACK
    // when attack cooldown is over
    if(this.nextAttack<this.attackCounter){
      // if player is in range
      if(d.d<30&&player.y>this.y-50&&player.y<this.y+50){
        // damage player
        damagePlayer(this.attackPower);
        // start attack animation
        this.animate(2);
        // set cooldown
        this.nextAttack = this.attackCounter+this.attackInterval;
        // reset enemy animation
        this.resetEnemyAnim();
      }
    }
  }

  roam(d){
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

    // if enemy and player platforms are at same height
    if(player.y==this.y)
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
          if(this.y<player.y && diff>0 && diff < 150){
            //console.log('moving down')
            tarfound=true;
            this.target = x+randInt(r);
            this.goalReachedAction='down'
          }
          else if(this.y>player.y && diff<0 && diff > -100){
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
