let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;

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
    let index=saveData.seedIndex.indexOf(currentLevel);
    favoritesStatus[index] = "Unlocked. Difficulty: "+level1.enemyDifficulty;
  }
  if(firstEnemyKilled&&currentLevel!='home'&&!level1.cleared){

    if(enemies.length<maxEnemies){
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
    this.dashInterval = 60;
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

        this.animate(2);
        this.nextAttack = this.attackCounter+this.attackInterval;
        this.attackAnimOverTimeout=setTimeout(function(enemy){if(enemy.roaming)enemy.animate(1); else enemy.animate(0);},400,this);
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
        clearTimeout(this.attackAnimOverTimeout);
        this.animate(3);
      }
      else if(!this.lastRoamingState) this.animate(1);

      if(this.dashCount<15){
        this.dashCount++;
        if(this.dashCount==15) this.animate(1);
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
      this.animate(0);
        setTimeout(function(target){
          target.roaming = true;
          target.newTarget();
          //target.goalReachedAction='none';
        },this.roamPauseLength, this)
      }
    }
  

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
