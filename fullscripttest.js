let canvas = {};
let ctx;
let camera = {};

// setupcamera()
//
// setup canvas since that is the "camera"
// initialize camera target position

function setupCamera(){

  camera.target = {x:player.x,y:player.y};
  camera.w = canvas.w2;
  camera.h = canvas.h2;
  camera.speed = 24;
}

function cameraFollow(x,y){

  y-=50;
  if(camera.target.x+camera.speed<x) camera.target.x+=camera.speed;
  else if(camera.target.x-camera.speed>x) camera.target.x-=camera.speed;
  else camera.target.x=x;

  if(camera.target.y+camera.speed<y) camera.target.y+=camera.speed;
  else if(camera.target.y-camera.speed>y) camera.target.y-=camera.speed;
  else camera.target.y=y;

  camera.left = camera.target.x-camera.w;
  camera.right = camera.target.x+camera.w;
  camera.top = camera.target.y-camera.h;
  camera.bottom = camera.target.y+camera.h;
}
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
let aboutguy;
let computer;

function createFriendlyNPCs(){

  let pos = level1.platforms[level1.platforms.length-1];
  aboutguy=new MovingObject(pos.x+150,pos.y-30,20,'#22af');
  computer=new MovingObject(pos.x-150,pos.y-30,20,'#447f');

}


function runFriendlyNPCs(){

  aboutguy.display();
  enableInteraction(aboutguy,"press E",50);

  computer.display();
  enableInteraction(computer,"press E, 1 or 2",50);

}


function enableInteraction(npc, text, range){

  if(npc.screenPos!=false){
    let d = distance(player.x,player.y,npc.x,npc.y);
    if(d.d<range){

      npc.interactible = true;
      ctx.fillStyle='black';
      ctx.font = "10px Georgia";
      let p = npc.screenPos;
      ctx.fillText(text,p.x,p.y-20);
    }
    else npc.interactible = false;

  }
  else npc.interactible = false;
}
let player;

function createPlayer(){

  let pos = level1.platforms[level1.platforms.length-1];
  if(currentLevel=='home') pos=level1.platforms[0]
  else pos.x-= 130;
  player=new MovingObject(pos.x,pos.y-100,20,'#2a2f');


}
let aboutguydialogs = [
  "welcome to sam's 13k js 2020 game! what's up?",
  "still talking to me, huh"
];

let computerdialogs = [
  "i'm the computer! press 1 to reach another page, press 2 to process data strips."
]
let dialogUI = {
  open: false,
  t: 0,
  counter:0,
  line:[],
  lineI:0,
  displayedText:""
};

let aboutguyDialogProgression =0;
let computerDialogProgression =0;


function runDialog(){

  if(dialogUI.open){

    if(dialogUI.t!=0){
      let p = getScreenPos({x:dialogUI.t.x,y:dialogUI.t.y,w2:50,h2:50});
      dialogUI.x = p.x;
      dialogUI.y = p.y - 70;
    }

    ctx.fillStyle='white';
    ctx.fillRect(dialogUI.x,dialogUI.y,100,37);
    ctx.fillStyle='black';
    ctx.fillText(dialogUI.displayedText[0],dialogUI.x+5,dialogUI.y+15)
    ctx.fillText(dialogUI.displayedText[1],dialogUI.x+5,dialogUI.y+26)
  }

  // if no one is interactible, close dialog ui (add any other interactible things here)
  if(!aboutguy.interactible&&!computer.interactible) dialogUI.open=false;
  if(!computer.interactible){
    displayLinksUI = false;
    displayProcessUI = false;
  }

}

function continueDialog(){

  if(dialogDone){
    dialogUI.open = false;
    dialogDone = false;

    if(aboutguy.interactible) aboutguyDialogProgression = (aboutguyDialogProgression+1)%2;
    else computerDialogProgression =0;
  }
  else
  cutDialog();
}


let dialogDone = false;
let maxCharsPerLine = 20;

function cutDialog(){

  let line1 = makeLine();
  let line2 = {t:""};
  if(!line1.stop) line2 = makeLine();

  dialogUI.displayedText=[line1.t,line2.t];
}

function makeLine(){

  let result="";
  let stop=false;
  while(!stop&&result.length+dialogUI.line[0].length<maxCharsPerLine){
    result+=dialogUI.line[0]+" ";
    dialogUI.line.shift();
    if(dialogUI.line.length==0){
      stop=true;
      dialogDone = true;

    }
  }
  return {t:result,stop:stop};
}
let exitDoorRange=30;

// actionbutton()
//
// called when user presses action button. triggers dialog ui

function actionButton(){
  if(currentLevel=='home'){
    let a = aboutguy.interactible;


    if(!displayLinksUI&&!displayProcessUI){
      if(a||computer.interactible){
        if(!dialogUI.open){

          dialogUI.open=true;
          if(a){
            dialogUI.t=aboutguy;
            dialogUI.line = aboutguydialogs[aboutguyDialogProgression].split(" ");
          }

          else{
            dialogUI.line = computerdialogs[computerDialogProgression].split(" ");
            dialogUI.t =computer;
          }
          cutDialog();
        }
        else continueDialog();
      }
    }
    // if either links or process ui are open
    else {
      if(displayLinksUI){

      }
      else if(displayProcessUI){

      }
    }


  }
  else {
    if(exitdoor.interactible){
      currentLevel='home';
      createLevel();
      createPlayer();
      fadeIn=0;
      waittime=8;
    }
  }
}
let cantGoDown = false;

function keypress(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=true;
    break;

    case 68: //d
      player.movingRight=true;
    break;

    case 32: //space
    if(player.fallSpeed<8) player.jump();
    break;

    case 83: //s
      if(player.y<killLine&&!cantGoDown) player.y++;
    break;

    case 69: //e
      // action button
      actionButton();
    break;

    case 49: //1
      if(currentLevel=='home'&&computer.interactible&&!displayProcessUI) displayLinksUI = true;
      else displayLinksUI = false;
    break;

    case 50: //2
      if(currentLevel=='home'&&computer.interactible&&!displayLinksUI) displayProcessUI = true;
      else displayProcessUI = false;
    break;

    case 82: // r

    break;

    case 27: //escape
    displayProcessUI = false;
    displayLinksUI = false;
    dialogUI.open=false;
    inventoryDisplayed=!inventoryDisplayed;
    break;
  }
}


function keyrelease(){

  switch(event.keyCode){
    case 65: //a
      player.movingLeft=false;
    break;

    case 68: //d
      player.movingRight=false;
    break;

  }
}
let mouseIsPressed = false;
let mouseX =0;
let mouseY =0;

// mousepressed()
//
// triggered once when mouse is pressed

function mousePressed(){
  //console.log("mouse press");
  mouseIsPressed = true;
  mouseX = event.clientX-canvas.x;
  mouseY = event.clientY-canvas.y;
  //console.log(mouseX,mouseY);
  if(!displayLinksUI&&!displayProcessUI)
    player.shoot(mouseX,mouseY,15);
}


// mouseReleased()
//
// called once when mouse is released

function mouseReleased(){
  //console.log("mouse released")
  mouseIsPressed = false;
}
let inventoryDisplayed = false;

function addToInventory(name,quantity){

  let alreadyHave = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name){
      alreadyHave = true;
      inventory[i].quantity+=quantity;
    }
  }
  if(!alreadyHave) inventory.push({name:name,quantity:quantity});
}

function removeItem(name,quantity){
  let have = haveItem(name);
  if(have!=false){
    inventory[i].quantity-=quantity;
    if(inventory[i].quantity==0) inventory.splice(i,1);
  }
}

function haveItem(name,quantity){
  let result = false;
  for(let i=0; i<inventory.length; i++){
    if(inventory[i].name==name&&inventory[i].quantity>=quantity) result = i;
  }
  return result;
}

function findAndRemoveItem(name,quantity){
  if(haveItem(name,quantity)) removeItem(name,quantity);
}
let enemyLootTable = [
  {name:"angry data strip",fill:"grey",quantity:{min:12,r:14},chance:1},
  {name:"gold",fill:"gold",quantity:{min:1,r:5},chance:0.5},
  {name:"html bits",fill:"lightblue",quantity:{min:3,r:52},chance:0.8},
  {name:"health pot",fill:"tomato",quantity:{min:1,r:3},chance:0.2}
];

let items = [];
let inventory = [];

function generateLoot(target){

  let r = Math.random();
  for(let i=0; i<enemyLootTable.length; i++){
    if(r<enemyLootTable[i].chance){
      let e = enemyLootTable[i];
      let r2 = Math.floor(e.quantity.min+Math.random()*e.quantity.r);
      items.push(new Item(target.x,target.y-50,10,e.fill,e.name,r2));
    //  console.log(items[items.length-1])
      let index=items.length-1;
      items[index].impactForce.x = Math.floor(6 + Math.random()*12);
      if(Math.random()>0.5) items[index].impactForce.x*=-1;
      items[index].initJumpForce=11;
      items[index].jump();
    }
  }
}

function updateItems(){
//  console.log("sup boyx")
  for(let i=0; i<items.length; i++){
    items[i].update();
  //  console.log("updat4e it")
  }
}

class Item extends MovingObject {

  constructor(x,y,size,fill,name,quantity){
    super(x,y,size,fill);
    this.name=name;
    this.looted = false;
    this.lootableRange = 80;
    this.pickupRange = 10;
    this.lootSpeed=1;
    this.quantity = quantity;
  //  console.log("load loot!")
  }

  update(){
//console.log("yo")
    if(!this.looted){
      let d = distance(this.x,this.y,player.x,player.y);
      if(d.d<this.pickupRange){
        // ITEM PICKED UP !
        this.looted = true;

        addToInventory(this.name,this.quantity);
      }
      else if(d.d<this.lootableRange){
        // ITEM MOVES TOWARDS PLAYER
        this.lootSpeed++;
        let ratio = this.lootSpeed/d.d;
        this.speedVect = {
          y: ratio*d.opp,
          x: ratio*d.adj
        }
        this.x+=this.speedVect.x;
        this.y+=this.speedVect.y;
        this.fallSpeed=0;
      }
      else if(this.lootSpeed>1) this.lootSpeed--;


      this.display();
      if(this.screenPos!=false){
        ctx.fillStyle='#000b';
        ctx.font='8px bold';
        ctx.fillText(this.quantity,this.screenPos.x+15,this.screenPos.y-15)
      }
      //console.log("updat4!")
    }

  }
}
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
class DisplayObject{

  constructor(x,y,w,h){

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.w2=this.w/2;
    this.h2=this.h/2;
  }

  updateOnScreenPosition(){

    let bounds = getBounds(this);

    // if object is on screen, then update screen pos.
    if( checkCollision(bounds,camera) ) this.screenPos = getScreenPos(this);
    // if it is offscreen screenpos is false.
    else this.screenPos = false;
  }

  limitX(){
    this.x = Math.min(Math.max(this.x,-sceneW/2),sceneW/2);
  }

  shoot(targetx,targety,speed){

    projectiles.push(new Projectile(this.x,this.y,4,"black",speed,targetx,targety));
  }
}

function checkCollision(bounds1,bounds2){
  return (
    ( bounds1.right>=bounds2.left && bounds1.right<=bounds2.right )
    || ( bounds1.left>=bounds2.left && bounds1.left<=bounds2.right )
    || ( bounds1.left<=bounds2.left && bounds1.right>=bounds2.right )
  )
  &&(
    ( bounds1.bottom>=bounds2.top && bounds1.bottom<=bounds2.bottom)
    || ( bounds1.top>=bounds2.top && bounds1.top<=bounds2.bottom )
    || ( bounds1.top<=bounds2.top && bounds1.bottom>=bounds2.bottom )
  )
}

function getScreenPos(input){
  return {
    x: canvas.w2 + input.x-camera.target.x - input.w2,
    y: canvas.h2 + input.y-camera.target.y - input.h2
  }
}
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
let projectiles = [];

function updateProjectiles(){

  for(let i=projectiles.length-1; i>=0; i--){
    projectiles[i].updateProjectile();
    if(projectiles[i].lifeTimer>50){
      projectiles.splice(i,1);
    //  console.log("projectile ded")
    }
  }
}
let waittime=5;
function runFadeIn(){

  let fact =1;
  if(fadeIn>waittime){
    fact = 1-(fadeIn-waittime)/30;

  }

  if(fact>0){
    ctx.fillStyle='rgba(0,0,0,'+fact+')';
    ctx.fillRect(0,0,canvas.w,canvas.h);
  }

  fadeIn++;
}
let displayLinksUI = false;
let lastdisplayState = false;
let linksUI = {
  w:260,
  h:80
};
let linkLoadTime=800;
let linksUIel;
let textform;
let listform;

function runLinksUI(){

  if(displayLinksUI){
    if(!lastdisplayState){
      lastdisplayState =true;
      dialogUI.open=false;

      linksUI.x = canvas.w2-linksUI.w/2 + canvas.x;
      linksUI.y = canvas.h2-linksUI.h/2 + canvas.y;

      linksUIel = document.createElement('div');
      linksUIel.setAttribute("style",`padding:10px;position:fixed;left:${linksUI.x}px;top:${linksUI.y}px;width:${linksUI.w}px;height:${linksUI.h}px;background-color:white;font-size:14px;`);

      let options = "";
      for(let i=0; i<favorites.length; i++){
        options+=`<option value="${favorites[i]}">status: unknown</option>`
      }

      linksUIel.innerHTML = `Choose from favorites:<br><input list="browsers" name="browser" id="browser" onchange='inputListChanged()'>
      <datalist id="browsers">
      ${options}
      </datalist></input>
      <br>Or type url name:<br>
      <input type="text" id="fname" name="fname" value="custom url" onkeydown='formKeyDown()' onclick='formclick()'>
      <div style='font-size:12px;position:absolute; right:26px;top:10px;'><br>select a list<br>item, or type<br>url name and <br>press enter</div>
      `;
      document.body.appendChild(linksUIel);

      textform=document.getElementById("fname");
      listform=document.getElementById("browser");
    }


  }
  else{
    if(lastdisplayState) linksUIel.remove();
    lastdisplayState = false;

  }
}

function formclick(){
  textform.value="";
}

function formKeyDown(){

  if(event.keyCode==13){
    textform.value = textform.value.trim();
    goToLink();
  }
}

function inputListChanged(){

  textform.value=listform.value;
  goToLink();
}

function goToLink(){

  let tinput = textform.value;
  let linput = listform.value;
  let result = linput;
  if(tinput!=linput) result = tinput;
  linksUIel.innerHTML = "loading "+result+"!";
  fadeIn =0;
  waittime=24;

  setTimeout(function(){
    displayLinksUI = false;
    currentLevel =0;
    createLevel();
    createPlayer();
  },linkLoadTime);

}
let displayProcessUI = false;
let favorites = ["link1","link2","link3","link4"];

let pUI = {
  w:200,
  h:200,
  last:false,
  el:0
}

function runProcessUI(){

  if(displayProcessUI&&!pUI.last){

    pUI.x = canvas.w2-pUI.w/2;
    pUI.y = canvas.h2-pUI.h/2;

    dialogUI.open=false;
    pUI.el = div(pUI,'white');

    let bsize = {x:pUI.x,y:pUI.y,w:pUI.w,h:pUI.h/2};
    pUI.dataButton = button(bsize,'yellow','but1','processDataStrips');
    bsize.y+=pUI.h/2;
    pUI.htmlButton = button(bsize,'orange','but2','processHTMLBits');
  }
  else if(!displayProcessUI&&pUI.last){
    pUI.el.remove();
    pUI.dataButton.remove();
    pUI.htmlButton.remove();
  }

  pUI.last=displayProcessUI;
}

let dataCost = 50;
function processDataStrips(){
console.log("data strps")
findAndRemoveItem(enemyLootTable[0].name,dataCost);

}

let htmlCost = 100;
function processHTMLBits(){
console.log("html bits");
findAndRemoveItem(enemyLootTable[2].name,htmlCost);
}

function div(box,fill){
  let result = document.createElement("div");
  document.body.appendChild(result);
  result.setAttribute("style",`position:fixed; left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;background-color:${fill};`);
  return result;
}

function button(bounds,fill,id,action){
  let result = div(bounds,fill);
  result.id=id;
  at(result,'onclick',action+"()");
  at(result,'onmouseenter',`hover("${id}")`);
  at(result,'onmouseleave',`unhover("${id}","${fill}")`);
  return result;
}

function at(target,attribute,value){
  target.setAttribute(attribute,value);
}

function hover(id,fill){
  document.getElementById(id).style.backgroundColor="grey";
}
function unhover(id,fill){
  document.getElementById(id).style.backgroundColor=fill;
}
let level1;
let currentLevel='home';
let sceneW=0;
let fadeIn =0;
let exitdoor;
let enemies = [];
// a place to setup some platforms and stuff

function createLevel(){

  enemies = [];
  items = [];
  firstEnemyKilled = false;

  if(currentLevel=='home'){
    sceneW = canvas.w;
    let plats = [
      [50,killLine-100,100],
      [-60,killLine-60,100],
      [0, killLine, canvas.w]
    ];

    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));
    cantGoDown = false;
    createFriendlyNPCs();
  }
  else {
    sceneW = 2*canvas.w;
    let sceneW2 = sceneW/2;
    let plats = [[0,killLine,sceneW]];
    let maxExtraPlatCount=8;
    let platCount = 5+Math.floor(random()*maxExtraPlatCount);
    let y = killLine;
    let minPlatW = 50;
    let maxExtraPlatW = 150;
    let platInterval = 65;
    let maxPlatDist = 60;


    let x = (-sceneW2+random()*sceneW)*0.6;
    let w = Math.min( minPlatW + random()*maxExtraPlatW , sceneW-x );

    for(let i=0; i<platCount-1; i++){

      if(i%4==2) maxExtraPlatW = 300;
      else maxExtraPlatW = 40;
      y-= platInterval;


      plats.push([x,y,w]);


      let middlemargin=50;

      let xdir = Math.floor( random()*3 )-1;
      if(x<0-middlemargin||x>0+middlemargin){
        xdir = Math.abs(sceneW2-x)/(sceneW2-x);
      }

      x += xdir*Math.floor( random() * maxPlatDist );
      w = Math.min( minPlatW + random()*maxExtraPlatW , (sceneW-x)/2 );

    }

    //plats[plats.length-1] = [0, killLine, canvas.w*2];

    let plat = plats[plats.length-1];
    plat[0] = sceneW/8;
    plat[2] = sceneW*1.2;
    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));
    let lastplat=level1.platforms.length-1;
    plat=level1.platforms[lastplat];
    plat.fill = 'orange'
    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    exitdoor=new MovingObject(plat.x+50,plat.y-50,20,'#a22f');
    cantGoDown = true;

    enemies.push(new Enemy(plat.x,plat.y-80,lastplat));
    enemies[0].jumpy=false;
  }

}

class Level{
  constructor(plist,w,h){

    this.platforms = [];
    for(let i=0; i<plist.length; i++){
      this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2]));
    }
    this.bgFill='#ddff';

  let offset = w/4;
    this.walls=[
      new DisplayObject( - w+offset, 0, w/2, 2000 ),
      new DisplayObject( w/2+offset, 0, w/2, 2000 ),
      new DisplayObject( 0, killLine+500, 2000, 1000 )
    ]
  }

  displayBackground(){
    ctx.fillStyle=this.bgFill;
    ctx.fillRect(0,0,canvas.w,canvas.h);



  }

  display404Background(){
    this.text404.updateOnScreenPosition();
    ctx.font='100px Georgia';
    ctx.fillStyle='black';
    ctx.fillText("404",this.text404.screenPos.x,this.text404.screenPos.y);
    ctx.font='30px Georgia';
    ctx.fillText("return to last page...",this.text404.screenPos.x,this.text404.screenPos.y+50);
  }

  displayPlatforms(){

    for(let i=0; i<this.platforms.length; i++){
      this.platforms[i].display();
    }

    ctx.fillStyle = "yellow"
    for(let i=0; i<this.walls.length; i++){
      let w = this.walls[i];
      w.updateOnScreenPosition();

      let p = w.screenPos;
    //  console.log("wall!",w.x,w.y,w.w,w.h)
      if(p!=false)
        ctx.fillRect(p.x,p.y,w.w,w.h);
    }


  }
}
let platformHeight = 10;
let platformFill='#a43f';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l){

    super(x,y,l,platformHeight);
    this.fill=platformFill;
  }

  display(){

    this.updateOnScreenPosition();
    if(this.screenPos!=false){

      ctx.fillStyle=this.fill;
      ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);
    }
  }
}
window.onload = start;

let killLine = 500;

function start(){

  fadeIn =0;
  createCanvas();
  createLevel();
  createPlayer();
  setupCamera();

  setInterval( run, 33 );
}

function run(){

  let h = currentLevel=='home';
  cameraFollow(player.x,player.y);
  level1.displayBackground();
  if(!h) level1.display404Background();
  level1.displayPlatforms();

  if(h){
    runFriendlyNPCs();
  }
  else runExitDoor();

  updateEnemies();
  player.limitX();
  player.display();

  if(player.hitPoints<100) player.hitPoints+=0.1;
  updateProjectiles();
  runDialog();

  updateItems();

  runFadeIn();

  runProcessUI();
  runLinksUI();


}


function runExitDoor(){
  exitdoor.display();
  enableInteraction(exitdoor,"press E to return home",exitDoorRange);

}
