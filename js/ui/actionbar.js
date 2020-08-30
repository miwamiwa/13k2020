let aBar = {};
let aBarFill = 'black';

let setupActionBar=()=>{

  aBar= {
    x:canvas.x,
    y:canvas.y+canvasElh,
    w: canvas.w,
    h: 20,
  }

    aBar.el = div(aBar,aBarFill);

    aBar.w*=0.2;
    aBar.health = div(aBar,'grey');

    aBar.x+=aBar.w;
    aBar.inventory = div(aBar,'grey');

    aBar.x+=aBar.w;
    aBar.w*=2;
    aBar.research = div(aBar,'grey');

    aBar.x+=aBar.w;
    aBar.w/=2;
    aBar.save = div(aBar,'grey');

}

let aBarEl=()=> div(aBar,'grey');
