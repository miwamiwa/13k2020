let platformHeight = 10;
let platformFill='#a43f';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l,t){

    super(x,y,l,platformHeight);
    this.fill=platformFill;
    this.ptext = t;
    console.log(t);
  }

  display(){

    let p=this.position();
    if(this.screenPos!=false){

      // draw platform:
      ctx.strokeStyle='#a438';
      ctx.strokeRect(p.x,p.y,this.w,20);
      let pl = this.ptext.length;
      cText(this.ptext.substring(0,pl/2),p.x,p.y+8, this.fill,10);
      cText(this.ptext.substring(pl/2,pl),p.x,p.y+18, this.fill,10);

    }
  }
}
