let firstEnemyKilled = false;
let enemyUpdateCounter=0;
let maxEnemies =3;
let textSpawnerGuy;
let shooterDamage = 10;

let updateEnemies=()=>{

  // if this is a level with enemies
  if(currentLevel!='home'&&currentLevel!='start'){
    // UPDATE ENEMIES:

    for(let i=enemies.length-1; i>=0; i--){
      // move and display enemy
      enemies[i].update();
      enemies[i].limitX();

      // if enemy killed:
      if(enemies[i].hitPoints<=0){

        // if this is a regular level
        if(directorylevels.includes(currentLevel)){
          if(enemies.length==1){

            // if level isn't cleared yet, add a new section
            if(levelData.sections<levelData.difficulty){
              levelData.sections++;
              continueLevel(true);
            }

            else if(!level1.cleared){
              // if level is "cleared"
              levelData.cleared=true;
              level1.clearLevel();
              // add the text spawner thingy
              level1.addSpawner2();
              updateFavorites();
            }

          }
          // if enemy is killed while spawner2 is out and active
          else if(level1.cleared&&!level1.cleared2)
          generateLoot(enemies[i]);
        }
        // if this is a boss level
        else{
          level1.clearLevel();
          levelData.cleared=true;
          saveData.bossProgress++;
          updateFavorites();
        }

        poof(enemies[i].x,enemies[i].y,[enemies[i].model.colors[0]]);
        enemies.splice(i,1);
      }
    }
  }
}


let poof=(x,y,colors)=>
generateLoot({x:x,y:y},true, colors);



class Enemy extends MovingObject {

  constructor(x,y,p,sIndex,type){
    let mratio = 1.4;
    let size = 60;
    if(type=="boss"){
      mratio = 3;
      size = 100;
    }
    super(x,y,size,"#cc30");
    this.type=type;

    this.friction=0.4;

    this.counter=0;
    this.dashing=false;

    this.currentPlatform=p;
    this.nextAttack=0;

    // shooting interval
    this.attackInterval=25;
    if(type=='boss') this.attackInterval=12;

    this.facing;
    this.attackPower = 20;

    this.facing='left';
    this.attackTimeout;
    this.doneSpawning=false;

    if(type=='spawner2')  pickNextLinkAward();

    if(type=='spawner'||type=='spawner2')
    this.model = new CoolPath(0,0, s1data, 2);
    else if(type=='minispawner') this.model = new CoolPath(0,0, s1data, 1.3);
    else   this.model = new CoolPath(0,0, edata, mratio);

    if(type=='shooter') this.model.colors[0] = "#8a8f";
    if(type=='fighter') this.model.colors[0] = "#88af";

    // spawner variables

    this.sIndex=sIndex;
    this.spawnInterval=200;
    this.enemyCount=0;

    this.nextSpawn=0;

    this.unlockdist=0;
    this.unlocked=false;
    this.spawner2interval=150;
    this.spawner2text="";

    this.animate(0);
  }

  // update()
  //
  // enemy's main loop

  update(){

    this.counter++;
    let p = this.display();

    // if enemy is on screen
    if(p!=false){

      // enable moving while on screen
      this.lrMaxSpeed=4;
      // get distance to player
      let d = distance(player.x,player.y,this.x,this.y);

      // run enemy behaviour
      switch(this.type){
        case 'fighter': this.roam(d); this.fight(d); break;
        case 'shooter': this.roam(d); this.shooter(d); break;
        case 'boss': this.roam(d); this.fight(d); this.shooter(d); this.dashing=true; break;
        case 'minispawner': if(d.d<20) this.popspawner(); break;
        case 'spawner2': this.updateSpawner2(); break;
        //case 'spawner': this.updateSpawner(); break; // regular spawners have no behaviour
      }

      //display model
      if(this.type!='spawner2'){ // spawner2 gets its own code for the model
        this.model.x=p.x+20;
        this.model.y=p.y+20;
        this.model.update(ctx,(this.facing=='left'));
      }
    }
    // prevent moving while off screen
    else this.lrMaxSpeed=0;
  }

  // popspawner()
  //
  // called when player runs into a minispawner.

  popspawner(){
    this.spawnOne();
    this.hitPoints=0;
  }

  // updatespawner2()
  //
  // run the text-lock thingy

  updateSpawner2(p){
    let t,c;

    // update lock while unlocking
    if(this.unlocked&&this.unlockdist<20) this.unlockdist+=2;

    // display lock
    ctx.save();
    ctx.strokeStyle='black';
    ctx.lineWidth='10';
    ctx.translate(p.x,p.y);
    // top
    ctx.beginPath();
    ctx.fillRect(0,0,10,-this.unlockdist);
    ctx.arc(30, 0-this.unlockdist, 25, Math.PI,0);
    ctx.stroke();
    // bottom
    cRect(0,0,60,40,'blue');
    cRect(3,12,54,20,'white');

    // setup lock text
    for(let i=0; i<revealedLink.length; i++){
      t=revealedLink[i];
      c='black';
      if(t=="_"){
        t = String.fromCharCode( 48+ randInt( 74 ) );
        c='grey'
      }
      // display letter
      cText( t,i*6+4,25,c,12);
    }

    // display progress indicator
    for(let i=0; i<dataCost; i++){
      if(i<datastrip%dataCost) cFill("white");
      else cFill('grey');
      cRect(i*5,35,4,4);
    }
    ctx.restore();

    // spawn at interval
    if(!this.doneSpawning
      &&this.counter%this.spawner2interval==0) this.spawnOne();
    }


    // spawnmore()
    //
    // kill this spawner and spawn a few enemies

    spawnMore(){
      this.hitPoints =0;
      for(let i=0; i<levelData.sections+1; i++)
      this.spawnOne(i);
    }


    // spawnone()
    //
    // pick a random enemy and spawn it
    // argument i is used to displace enemies when spawning multiple at once

    spawnOne(i){

      // pick which enemy to spawn:
      // shooting enemies appear starting at difficulty level 2,
      // and are more likely to appear at difficulty level 3

      let choice='fighter'
      if(levelData.difficulty>1){
        if(levelData.difficulty>2&&Math.random()>0.3) choice='shooter';
        else if(Math.random()>0.6) choice='shooter';
      }

      if(i==undefined) i=0;
      enemies.push(new Enemy(
        this.x - 50 + randInt(50) + i*50,
        this.y-80,this.currentPlatform,
        this.sIndex,
        choice
      ));
    }


    // regen()
    //
    // regenerate health

    regen(){
      if(this.hitPoints<100) this.hitPoints+= 0.1;
    }

    shooter(d){
      // check player range
      if(this.canAttack(200,100,d)){
        playBlaster(800,1);
        this.shoot(player.screenPos.x,player.screenPos.y,10,true);
        this.attackAndCool();
      }

      this.regen();
    }

    // canattack()
    //
    // see if distance to player and distance on y-axis checks out

    canAttack(maxD,yRange,d){
      return (this.nextAttack<this.counter) && (d.d<maxD&&player.y>this.y-yRange&&player.y<this.y+yRange);
    }

    // attackAndCool()
    //
    // trigger attack animation, set cooldown
    // and trigger animation reset after cooldown.

    attackAndCool(){
      this.animate(1);
      this.nextAttack = this.counter+this.attackInterval;
      this.attackTimeout=setTimeout(function(tar){tar.animate(0);},400,this);
    }

    // fight()
    //
    // enemy melee attack

    fight(d){
      // check player range
      if(this.canAttack(30,50,d)){
        damagePlayer(this.attackPower);
        this.attackAndCool();
      }
      this.regen();
    }


    // dash()
    //
    // trigger dash start + animation
    // and trigger dash stop + animation reset after dash time has elapsed

    dash(){

      this.dashing=true;
      this.lrMaxSpeed=9;
      this.animate(1);
      setTimeout(function(tar){ tar.lrMaxSpeed=4; tar.animate(0); }, 3000, this );
      setTimeout(function(tar){ tar.dashing=false; }, 3500, this );
    }

    // roam()
    //
    // move left-right towards player and trigger dashing

    roam(d){

      if(this.counter%50==0){

        if(player.x<this.x) this.goLeft();
        else this.goRight();

        if(player.y<this.y && d.d<150) this.jump();
        if(!this.dashing&&d.d<260) this.dash();
      }
    }

    // animate()
    //
    // trigger a new animation and block any animation reset timeout

    animate(index){
      clearTimeout(this.attackTimeout);
      this.model.selectAnimation(index);
    }

  }
