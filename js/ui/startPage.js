let startTxt = [
  "sam's js13k",
  "2020 game",
  "pick 'home'",
  "to continue",
  "or pick 'new'",
  "to start a new game.",
  "then press go!!",
  "CONTROLS",
  "Left: A. Right: D. Down: S.",
  "Jump: Space.",
  "Shoot: Click. ",
  "Talk to the home page guy: E."
];
let sCol = ['#eee','#88b','#ec1','#e32','#6a7'];
let scI=[0,0,1,1,2,2,3,4,4,4,4,4];
let sframe=0;

let displayStartUI=()=>{
  if(sframe%30==0){
    cRect(0,0,canvas.w,canvas.h,'#333');
    //cFill();
    let space=0;
    let t,i,j,r;
    for( i=0; i<startTxt.length; i++){

      r=3+randInt(4);
        t = 50-i*5 ;
      for( j=0; j<r; j++){

      cText(startTxt[i],50-j,100+space-j, sCol[scI[i]], 90-i*6 );

    }
    space+=(90-i*6)*.7;
  }

  }
sframe++;
}
