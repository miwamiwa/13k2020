let level1;

let sceneW=0;
let fadeIn =0;
let enemies = [];
let lvlCount=0;
let enemyDifficulty=1;
let lvlDiffIncreaseInterval = 3;
let maxEnemyDifficulty =3;
let platInterval = 65;
let maxExtraPlatW = 150;
let minPlatW = 50;
// a place to setup some platforms and stuff

let basicLevel=()=>{
  level1=new Level( [
    [50,killLine-100,100],
    [-60,killLine-60,100],
    [0, killLine, canvas.w]
  ], sceneW, 100);
}

let randPlat=(x)=> Math.min( minPlatW + random()*maxExtraPlatW , (sceneW-x)/2 );

// createlevel()
//
// create level object design platforms

let createLevel=()=>{

  // reset level variables
  noiseCounter=0
  enemies = [];
  items = [];
  spawners = [];

  firstEnemyKilled = false;
  sceneW = canvas.w;
  cantGoDown = false;

  if(currentLevel=='home'){

    basicLevel();
    createFriendlyNPCs();
  }
  else if(currentLevel=='true404'){

    basicLevel();
    let p=last(level1.platforms);
    level1.text404 = new DisplayObject( p.x-10, p.y-10,300,300 );

  }
  else {

    sceneW = 2*canvas.w;
    let plats = [[0,killLine,sceneW]]; // starting platform (bottom)
    let platCount = 0; // number of platforms
    let spawnPoints = [0];

    for(let j=0; j<3; j++){

      let lastPlatCount=platCount;
      platCount+=3+flo(random()*8);
      spawnPoints.push(lastPlatCount+2+ flo(random()*(platCount-lastPlatCount-2)));
    // first platform config
    let y = killLine;
    let x = (-sceneW/2+random()*sceneW)*0.6;
    let w = randPlat(x);

    // create platforms :

    for(let i=0; i<platCount-1; i++){

      // alternate platform max width
      if(i%4==2) maxExtraPlatW = 300;
      else maxExtraPlatW = 40;
      // increment platform height
      y-= platInterval;

      // create platform
      plats.push([x,y,w]);

      // pick which x-direction to offset next platform
      let xdir = flo( random()*3 )-1;
      if(x<-50||x>50){
        let x2=sceneW/2-x;
        xdir = Math.abs(x2)/x2;
      }
      // setup next platform coords
      x += xdir*flo( random() * 60 );
      w = randPlat(x);
    }
  }

  plat = last(plats);
  plat[0] = sceneW/8;
  plat[2] = sceneW*1.2;
  //let h = ;

    level1 = new Level(plats,sceneW, Math.abs(plats[0][1] - plat[1]) );
    plat = last(level1.platforms)
    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    level1.enemyDifficulty = levelData.difficulty; //difficultyLevels[index];
    level1.cleared = levelData.cleared;//clearedStates[index];
    level1.spawnPoints = spawnPoints;

    // check if top platform is already unlocked
    if(levelData.unlocked){
      firstEnemyKilled = true;
      cantGoDown=false;

      for(let i=0; i<levelData.spawners.length; i++){
            let p = level1.platforms[level1.spawnPoints[i]];
        if(levelData.spawners[i])
          enemies.push(new Enemy(p.x,p.y-80,level1.spawnPoints[i],i,'spawner'));
      }

    }
    else{
      cantGoDown = true;
      plat.fill = 'orange'
      enemies.push(new Enemy(plat.x,plat.y-80,level1.platforms.length-1,-1,'flyer'));
      enemies[0].jumpy=false;
    }
  }

  updateFavorites();
}


let linestyle=(c,a,w)=>{
  ctx.strokeStyle=c+a;
  ctx.lineWidth = w;
}

class Level{

  constructor(plist,w,h){
    let bgurl='index.html';
    if(currentLevel!='home')
      bgurl='js/characters/enemyclass.js';

      fetch(bgurl)
      .then(response => response.text())
      .then(text => this.bgText=text);

    this.unbg = [];
    this.uncorrupting=false;
    this.platforms = [];
    this.bgFill='#ddff';

    for(let i=0; i<plist.length; i++)
      this.platforms.push(new Platform(plist[i][0],plist[i][1],plist[i][2]));

    this.walls=[
      new DisplayObject( - 0.75*w, 0, w/2, 2000 ),
      new DisplayObject( w*0.75, 0, w/2, 2000 ),
      new DisplayObject( 0, killLine+500, 2000, 1000 )
    ];

    this.bgTxt = new DisplayObject(w/2,this.platforms[0].y+h,w*2,h*4);

    this.bgcounter=0;
    this.nextThunder=100;
    this.txtCounter=0;
    this.drops = [];
  }

  displayBackground(){

    cFill('#333F');
    cRect(0,0,canvas.w,canvas.h);

    if(this.bgcounter>this.nextThunder){
      let val = 10-(this.bgcounter-this.nextThunder);
      if(val>=0){
        cFill('#FFF'+val);
        cRect(0,0,canvas.w,canvas.h);
      }
      else if(Math.random()<0.3) this.nextThunder+=50+randInt(100);
      else this.nextThunder+=200+randInt(200);
    }

    this.bgTxt.position();
    cFill('#bbba');
    cFont('12px Courier New')
    for(let i=this.drops.length-1; i>=0; i--){
      this.drops[i].y += 20;
      cText( level1.bgText[this.drops[i].c],
        this.bgTxt.screenPos.x+this.drops[i].x,
        this.bgTxt.screenPos.y+this.drops[i].y );
        if(this.drops[i].y>500) this.drops.splice(i,1);
    }

    if(this.bgcounter%1==0){

      this.drops.push({x:randInt(sceneW),y:-500,c:randInt(400)});
    //  level1.txtCounter++;
    //  if(level1.txtCounter==level1.bgText.length) level1.txtCounter=0;
    }
    this.bgcounter++;
  }
  displayBackground2(){

    cFill(this.bgFill);
    cRect(0,0,canvas.w,canvas.h);
    this.bgTxt.position();


    if(this.bgTxt.screenPos!=false){
      cFont('30px Arial');

      // if uncorrupting is active, add indices to uncorrupted bg array
      if(this.uncorrupting){
        let index=randInt(6000);
        let r=randInt(20);
        for(let i=0; i<r; i++)
          if(!this.unbg.includes(index+i)) this.unbg.push(index+i);
      }

      let counter=0;
      let r = -1+randInt(3);

      for(let i=0; i<50; i++){

        let alphaval = 'f';
        if(i<10) alphaval=i;
        let x=this.bgTxt.screenPos.x;
        let txtcontent=this.bgText.substring(i*120,(i+1)*120);

        for(let j=0; j<120; j++){
          // if uncorrupted
          if(currentLevel=='home'||this.unbg.includes(counter))
            linestyle('#bbb',alphaval,2);
            // if corrupted
          else linestyle('#bdb',alphaval,12+r)

          ctx.strokeText(txtcontent[j],(x),(this.bgTxt.screenPos.y+i*50)/2);
          counter++;
          x+=ctx.measureText(txtcontent[j]).width*1.2;
        }
      }
      ctx.lineWidth = 1;
    }
  }

  display404Background(){
    this.text404.position();
    cFont('100px Georgia');
    cFill('black');
    cText("404",this.text404.screenPos.x,this.text404.screenPos.y);
    cFont('30px Georgia');
    cText("return to last page...",this.text404.screenPos.x,this.text404.screenPos.y+50);
  }

  displayPlatforms(){

    this.txtCounter=0;
    for(let i=0; i<this.platforms.length; i++)
      this.platforms[i].display();

    cFill('black');
    for(let i=0; i<this.walls.length; i++){
      let w = this.walls[i];
      w.position();
      let p = w.screenPos;
      if(p!=false)
       ctx.fillRect(p.x,p.y,w.w,w.h);
    }
  }

  displayCompletion(){
    let t = levelData.completion+"% complete";
    cFont("40px bold");
    cFill('black');
    cText( t, 10,30 );
    cFill('white');
    cText( t, 12,32 );
  }
}
