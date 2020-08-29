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

      ctx.strokeStyle=this.fill;
      ctx.strokeRect(this.screenPos.x,this.screenPos.y,this.w,20);
      if(this.txtStart==undefined) this.txtStart=level1.txtCounter;
      else level1.txtCounter=this.txtStart;
      let t="";
      for(let i=0; i<6; i++){
        while(
          level1.txtCounter<level1.bgText.length
          &&level1.bgText.charCodeAt(level1.txtCounter)<24
        ){
          level1.txtCounter++;
        }
        t+=level1.bgText[level1.txtCounter];
        level1.txtCounter++;
      }

      ctx.fillStyle=this.fill;
      ctx.font='20px Courier New';
      ctx.fillText(t,this.screenPos.x+12,this.screenPos.y+15);

    //  ctx.strokeRect(this.screenPos.x+this.w*0.2,this.screenPos.y+6,this.w*0.7,6);
      /*
      this.screenPos.y+=6;
      ctx.strokeStyle='black';
      ctx.font='10px Courier New';
      if(this.txtStart==undefined) this.txtStart=level1.txtCounter;
      else level1.txtCounter=this.txtStart;
      for(let j=0; j<2; j++){
        for(let i=0; i<this.txtL-j*5; i++){

          while(level1.txtCounter<level1.bgText.length&&level1.bgText.charCodeAt(level1.txtCounter)<33){
            level1.txtCounter++;
          }

        //  console.log(level1.bgText[level1.txtCounter],level1.txtCounter)
          ctx.strokeText(
            level1.bgText[level1.txtCounter],
            this.screenPos.x + i*5 + j*this.w/(j+5),this.screenPos.y+j*6
          );
          level1.txtCounter++;
        }
      }
*/
    }
  }
}
