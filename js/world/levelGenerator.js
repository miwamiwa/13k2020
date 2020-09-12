let level1;
let killLine = 500;
let sceneW=0;
let fadeIn =0;
let enemies = [];

let enemyDifficulty=1;
let lvlDiffIncreaseInterval = 3;
let maxEnemyDifficulty =4;
let bgurl='js/characters/enemyclass.js';



// a place to setup some platforms and stuff

let basicLevel=(has404)=>{
  sceneW = canvas.w;

  level1=new Level( [
    [50,killLine-100,100],
    [-60,killLine-60,100],
    [0, killLine, canvas.w]
  ], sceneW, 100,has404);
}


let continueLevel=(spawn)=>{

  // extend kill line
  killLine+= 500;
  let plats = [[0,killLine,sceneW*1.02]]
  let stairs = flo(5+random()*3);
  let stairCount = flo(1+random()*3);
  //let extracount=0;

  // create stair formations
  for(let j=0; j< stairCount; j++){

    let x = -(stairCount/3)*canvas.w  + (j)* sceneW/stairCount + 155;
    let y = killLine;
    for(let i=0; i<stairs-j; i++){

      let w = 80;
      y-= 60;
      if(i==stairs-j-1){
        w = 280;
        if(spawn)
          enemies.push(new Enemy(x,y-80,'spawner'));
      }
      plats.push([x,y,w+random()*80])
      x+= -60+random()*120;
    }
  }

  // create new platform objects
  for(let i=0; i<plats.length; i++){
    let t = level1.getplatformtext(plats[i][2]);

    level1.platforms.push(new Platform(plats[i][0],plats[i][1],plats[i][2],t))

    if(spawn&&Math.random()>0.63)
      enemies.push(new Enemy(plats[i][0],plats[i][1]-80,'minispawner'));
    //  extracount++;

  }

  // spawn extra eggs
  if(spawn)
  for(let i=0; i<1+2*levelData.difficulty; i++)
    enemies.push(new Enemy(-300+randInt(600),plats[0][1]-80,'minispawner'));


  // update walls
  level1.moreClouds(2);
//  level1.newWalls(sceneW);
}





// createlevel()
//
// create level object design platforms

let createLevel=()=>{

  // reset level variables
//  noiseCounter=0
  enemies = [];
  items = [];
  killLine = 500;
  ncount=0;
  // close dialog window
  dUI.open=false;
//  console.log(directorylevels,currentLevel)
  // if target page is home page
  if(isHome()){
    basicLevel();
    createFriendlyNPCs();
  }
  // if this is a boss level
  else if(!directorylevels.includes(currentLevel)){
    //console.log("yoyo")
    basicLevel(true);
    let p=level1.platforms[0];
    if(!levelData.cleared)
      enemies.push(new Enemy(p.x,p.y-80,'boss'));
    else level1.clearLevel();
  }


  // if target page is a level:
  else {

    sceneW = 2*canvas.w;
    level1 = new Level([[0,killLine,sceneW*1.02]],sceneW, 400, true );

    let p=level1.platforms[0];
    let j=levelData.sections;
    if(levelData.cleared) level1.clearLevel();
    // if level isn't cleared, load enemies

      // if there is no progress on this level yet, create first spawner
      if(j==0)
        enemies.push(new Enemy(p.x,p.y-80,'spawner'));
        // if there is progress made on this level, add platforms below
      else for(let k=0; k<j; k++){

          if(k==j-1) continueLevel(!levelData.cleared); // add a spawner to the last section (unless level is cleared??)
          else continueLevel(false)
        }

        if(levelData.cleared2) level1.clearLevel2();
        else if(levelData.cleared) level1.addSpawner2();

      // save game/update favorites
    updateFavorites();
  }
}


class Level{

  constructor(plist,w,h,has404txt){


      let p = plist[0];
      this.text404 = new DisplayObject( p[0]-150,p[1]-10,300,300 );


    this.platforms = [];
    this.bgFill='#333F';

    this.txtCounter=0;
    for(let i=0; i<plist.length; i++){
      let t = this.getplatformtext(plist[i][2]);
      this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2],t));
    }

    //let cloudCount=4;
    this.clouds = [];
    this.moreClouds(3);

    //this.newWalls(sceneW);
    this.bgTxt = new DisplayObject(w/2,this.platforms[0].y+h,w*2,h*4);

    this.bgcounter=0;
    this.thunder=100;

    this.drops = [];
    this.cleared=false;
    this.cleared2=false;
  }

  moreClouds(cloudCount){
    for(let i=0; i<cloudCount; i++){

      let rows = 3+randInt(4);
      let t = [];
      for(let j=0; j<rows; j++){
        t.push(this.getplatformtext(30+randInt(100)))
      }
      let d = 1;
      if(i%2==0) d=-1;
      //let p= this.platforms[0];
      this.clouds.push({
        o: new DisplayObject(
          0+  i*200 + randInt(100),
          killLine+randInt(450),
          1000,1000
        ),

        t:t,
        n: randInt(200),
        dir: d
      })
    }
  }

  getplatformtext(l){
    let t="";
    for(let j=0; j<l/3; j++){

      t += bgText[this.txtCounter];
      this.txtCounter++;
      if(this.txtCounter==bgText.length) this.txtCounter=0;
    }
    return t;
  }

  addSpawner2(){
    let p = this.platforms[1+randInt(this.platforms.length-1)];
    //console.log("cleared")
    enemies.push(new Enemy(p.x,p.y-80,'spawner2'));
    textSpawnerGuy = last(enemies);
  }

  clearLevel(){
    this.cleared=true;
    this.bgFill="#666"
  }

  clearLevel2(){
    this.cleared2=true;
    this.bgFill="#ccc"
  }
/*
  newWalls(w){
    this.walls=[
      new DisplayObject( - 0.75*w, 0, w/2, 2000 ),
      new DisplayObject( w*0.75, 0, w/2, 2000 ),
      new DisplayObject( 0, killLine+520, 2000, 1000 )
    ];
  }
*/
  displayBackground(){


    cRect(0,0,canvas.w,canvas.h,this.bgFill);

    // run thunder
    if(this.bgcounter>this.thunder&&!level1.cleared2){
      let val = 10-(this.bgcounter-this.thunder);
      if(val>=0)
        cRect(0,0,canvas.w,canvas.h, '#FFF'+val);

      else if(Math.random()<0.3){
        this.thunder+=50+randInt(100);

        playThunder();
      }
      else{
        let i=200;
        if(level1.cleared) i = 20;
        this.thunder+=i+randInt(i);

        playThunder();
      }
    }

    // draw clouds

    for(let i=0; i<this.clouds.length; i++){
      let c = this.clouds[i]
      c.o.position();

      if(c.o.screenPos!=false){
        for(let j=0; j<c.t.length; j++)
          cText(c.t[j],c.o.screenPos.x*(0.7+0.03*j),c.o.screenPos.y*0.8+j*15,'#bbb3', 30);
      }



      c.o.x += c.dir*.2;


      if(this.bgcounter%150==0&&Math.random()>0.5)
        c.dir *= -1;

    }

    // draw rain drops
    let p=this.bgTxt.position();

    // update rain drops
    for(let i=this.drops.length-1; i>=0; i--){

      let j=this.drops[i];
      // update position
      j.y += 20;
      // draw rain drop
      cText( bgText[j.c], p.x+j.x, p.y+j.y, '#bbba', 12 );
      // remove drop once it hits the killLine
      if(j.y>player.y) this.drops.splice(i,1);
      }

      // add rain drops
      if(this.bgcounter%4==0)
        this.drops.push({x:player.x+randInt(canvas.w),y:player.y-800,c:randInt(400)});
      this.bgcounter++;
    }

    display404Background(){
      let p=this.text404.position();
      if(!level1.cleared2&&!isHome()){
        cText("404", p.x, p.y, '#c99', 100);
        cText("return to last page...", p.x, p.y+50, '#c99', 30);
      }
      else cText(currentLevel+".html", p.x, p.y, '#666', 100);

    }

    displayPlatforms(){

      // display platforms

      for(let i=0; i<this.platforms.length; i++)
        this.platforms[i].display();
        /*
      // display walls
      cFill('black');
      for(let i=0; i<this.walls.length; i++){
        let w = this.walls[i];
        let p = w.position();
        if(p!=false)
        ctx.fillRect(p.x,p.y,w.w,w.h);
      }
      */
    }



  }
