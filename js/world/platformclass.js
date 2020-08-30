let platformHeight = 10;
let platformFill='#a43f';

class Platform extends DisplayObject { // extends display object class

  constructor(x,y,l){

    super(x,y,l,platformHeight);
    this.fill=platformFill;

  }

  display(){

    let p=this.position();
    if(this.screenPos!=false){

      // draw platform:
      ctx.strokeStyle=this.fill;
      ctx.strokeRect(p.x,p.y,this.w,20);

      // draw text inside the platform:
      if(this.txtStart==undefined) this.txtStart=level1.txtCounter;
      else level1.txtCounter=this.txtStart;

      let t="";
      for(let i=0; i<6; i++){
        while(
          level1.txtCounter<level1.bgText.length
          &&level1.bgText.charCodeAt(level1.txtCounter)<24
        )
          level1.countT();

        t+=level1.bgText[level1.txtCounter];
        level1.countT();
      }
      cText(t,p.x+12,p.y+15, this.fill,20);

    }
  }
}
