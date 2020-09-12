let platformHeight = 10;
let platformFill='#fdcf';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l,t){

    super(x,y,l,platformHeight);
    this.fill=platformFill;
    this.ptext = t;
//    console.log(t);
  }

  display(){

    let p=this.position();
    if(this.screenPos!=false){

      // draw platform:
      ctx.strokeStyle='#fdc8';

      ctx.strokeRect(p.x,p.y,this.w,20);
      let f = '#a438';
      if(level1.cleared||currentLevel=='home') f = '#fdc8'
      cRect(p.x,p.y,this.w,20,f);
      let pl = this.ptext.length;
      cText(this.ptext.substring(0,pl/2),p.x,p.y+8, this.fill,10);
      cText(this.ptext.substring(pl/2,pl),p.x,p.y+18, this.fill,10);

    }
  }
}
