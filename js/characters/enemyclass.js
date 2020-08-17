let firstEnemyKilled = false;
let enemyUpdateCounter=0;

function updateEnemies(){
  for(let i=enemies.length-1; i>=0; i--){
    enemies[i].update();
    if(enemies[i].hitPoints<=0){
      // ENEMY KILLED
      generateLoot(enemies[i]);
      enemies.splice(i,1);

    }
  }
//cantGoDown=false;
  if(enemies.length==0&&!firstEnemyKilled){
    firstEnemyKilled = true;
    cantGoDown = false;
    level1.platforms[level1.platforms.length-1].fill = platformFill;
  }
  if(firstEnemyKilled&&currentLevel!='home'){

    if(enemies.length<2){
      enemyUpdateCounter++;

      if(enemyUpdateCounter%100==0){
        let pick=Math.floor(Math.random()*level1.platforms.length);
        let plat = level1.platforms[pick];
        enemies.push(new Enemy(plat.x,plat.y-80,pick));
      }
    }
  }
}

class Enemy extends MovingObject {

  constructor(x,y,p){
    let fill = '#cc3f';
    let size = 30;

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
    this.dashInterval = 60;
    this.nextDash=0;
    this.dashCount=15;
  }

  update(){

    //attack
    this.attackCounter++;
    let d = distance(player.x,player.y,this.x,this.y);

      if(this.nextAttack<this.attackCounter){

        if(d.d<30){
        let hit = false;
        if(this.facing=="right"&&player.x>this.x) hit=true;
        else if(this.facing=="left"&&player.x<this.x) hit = true;

        if(hit){
          //console.log("player hit!");
          player.hitPoints -= this.attackPower;
        }
        this.nextAttack = this.attackCounter+this.attackInterval;
      }
    }



    // health regen
    if(this.hitPoints<100) this.hitPoints+= 0.2;
    this.display();

    // moving left-right
    if(this.roaming){

      // dash
      if(player.currentPlatform==this.currentPlatform&&this.nextDash<this.attackCounter&&d.d<120){
      //  console.log("dash!")
        this.nextDash = this.attackCounter+this.dashInterval;
        this.target = player.x - 30 + Math.random()*60;
        this.dashCount=0;
      }

      if(this.dashCount<15){
        this.dashCount++;
        this.lrMaxSpeed=5;
      }
      else this.lrMaxSpeed=2;

      if(this.x+this.targetReachDistance<this.target){
        this.movingRight = true;
        this.movingLeft = false;
        this.facing="right";
      }
      else if(this.x-this.targetReachDistance>this.target){
        this.movingRight = false;
        this.movingLeft = true;
        this.facing="left";
      }
      else {
        this.roaming = false;
        this.movingRight = false;
        this.movingLeft = false;
        //console.log("new target",this.target,this.targetCounter)
        if(this.targetCounter%3==0){
        if(this.goalReachedAction=='up'){
          this.jump();
          console.log("going up")
        }
        else if(this.goalReachedAction=='down'){
          this.y+=4;
          console.log("going down ")
        }
      }

        setTimeout(function(target){
          target.roaming = true;
          target.newTarget();
          //target.goalReachedAction='none';
        },this.roamPauseLength, this)
      }
    }

  }

  newTarget(){

    this.targetCounter++;
    //console.log("new target")
    let p = level1.platforms[this.currentPlatform];
    this.target = (p.x-p.w2 + Math.random()*p.w)*0.4;

    if(this.targetCounter%3==0&&this.jumpy){
      let possibleTargets = [];
      if( this.currentPlatform>0 ){
        possibleTargets.push(this.currentPlatform-1);
      }
      if( this.currentPlatform+1 < level1.platforms.length ){
        possibleTargets.push(this.currentPlatform+1);
      }
      let pick = possibleTargets[Math.floor(Math.random()*possibleTargets.length)];
      p = level1.platforms[pick];
      this.target = p.x;

      if(pick>this.currentPlatform) this.goalReachedAction='up';
      else this.goalReachedAction='down';

    //  console.log("platchange coming ",this.currentPlatform,pick,p.x)
      this.currentPlatform = pick;
    }

  }


}
