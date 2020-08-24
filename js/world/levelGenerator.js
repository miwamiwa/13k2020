let level1;

let sceneW=0;
let fadeIn =0;
let exitdoor;
let enemies = [];
let lvlCount=0;
let enemyDifficulty=1;
let lvlDiffIncreaseInterval = 3;
let maxEnemyDifficulty =3;
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
  else if(currentLevel=='true404'){
    sceneW = canvas.w;
    let plats = [
      [50,killLine-100,100],
      [-60,killLine-60,100],
      [0, killLine, canvas.w]
    ];

    level1 = new Level(plats,sceneW,Math.abs(plats[0][1] - plats[plats.length-1][1]));
    let plat=level1.platforms[level1.platforms.length-1];
    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    exitdoor=new MovingObject(plat.x+50,plat.y-50,20,'#a22f');
    cantGoDown = false;
    //createFriendlyNPCs();
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

    level1.text404 = new DisplayObject( plat.x-10,plat.y-10,300,300 );
    exitdoor=new MovingObject(plat.x+50,plat.y-50,20,'#a22f');

    let index = saveData.seedIndex.indexOf(currentLevel);
    level1.enemyDifficulty = difficultyLevels[index];
    level1.arrayindex=index;
    level1.completion=completions[index];
    level1.cleared = clearedStates[index];

    // check if top platform is already unlocked
    if(favoritesStatus[index].substring(0,3)=="Unl"){
      firstEnemyKilled = true;
      cantGoDown=false;
    }
    else{
      cantGoDown = true;
      plat.fill = 'orange'
      enemies.push(new Enemy(plat.x,plat.y-80,lastplat));
      enemies[0].jumpy=false;
    }
  }

}


class Level{
  constructor(plist,w,h){
    if(currentLevel!='home'){
      fetch('js/characters/enemyclass.js')
      .then(response => response.text())
      .then(text => this.bgText=text);
    }
    else {
      fetch('index.html')
      .then(response => response.text())
      .then(text => this.bgText=text);
    }

    this.completion=0;
    this.uncorruptedBG = [];
    this.uncorrupting=false;
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

    this.bgTextObj = new DisplayObject(w/2,this.platforms[0].y+h,w*2,h*4);
  }

  displayBackground(){
    ctx.fillStyle=this.bgFill;
    ctx.fillRect(0,0,canvas.w,canvas.h);
    this.bgTextObj.updateOnScreenPosition();
    if(this.bgText!=undefined&&this.bgTextObj.screenPos!=false){

      //console.log("yo")

      ctx.font='30px Arial';

      if(this.uncorrupting){
        let index=Math.floor(Math.random()*6000);
        let range =Math.floor(Math.random()*20);
        for(let i=0; i<range; i++){
          if(!this.uncorruptedBG.includes(index+i)) this.uncorruptedBG.push(index+i);
        }
      }


      let counter=0;
      let r = -1+Math.floor(Math.random()*3);
      for(let i=0; i<50; i++){

        let alphaval = 'f';
        if(i<10) alphaval=i;
        let x=this.bgTextObj.screenPos.x;

        let txtcontent=this.bgText.substring(i*120,(i+1)*120);
        for(let j=0; j<120; j++){
          if(currentLevel=='home'||this.uncorruptedBG.includes(counter)){
            //console.log("yoo")
            ctx.strokeStyle='#bbb'+alphaval;
            ctx.lineWidth = 2;
          }
          else {
            ctx.strokeStyle='#bdb'+alphaval;
            ctx.lineWidth = 12+r;//+Math.floor(Math.random()*2);
          }

          ctx.strokeText(txtcontent[j],(x),(this.bgTextObj.screenPos.y+i*50)/2);
          counter++;
          x+=ctx.measureText(txtcontent[j]).width*1.2;
        }

      }
      ctx.lineWidth = 1;

    }


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

  displayCompletion(){
    ctx.font="40px bold";

    ctx.fillStyle='black';
    ctx.fillText(this.completion+"% complete", 10,30 );
    ctx.fillStyle='white';
    ctx.fillText(this.completion+"% complete", 12,32 );
  }
}
