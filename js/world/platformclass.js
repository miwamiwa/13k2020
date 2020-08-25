let platformHeight = 10;
let platformFill='#a43f';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l){

    super(x,y,l,platformHeight);
    this.fill=platformFill;
  }

  display(){

    this.position();
    if(this.screenPos!=false){

      ctx.fillStyle=this.fill;
      ctx.fillRect(this.screenPos.x,this.screenPos.y,this.w,this.h);
    }
  }
}
