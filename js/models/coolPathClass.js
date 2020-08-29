let ns1 = 58;
let ns2 = 93;

class CoolPath{
  constructor(x,y,data,scale){
    this.x=x;
    this.y=y;
    this.cmess;
    this.scale = 1.5;
    if(scale!=undefined) this.scale*=scale;
    this.colors = [];
    for(let i=0; i<data.c.length; i++){
      this.colors[i] = data.c[i];
    }
    this.model=data.m;
    this.rig=data.r;
    this.animations=data.a;

    for(let i=0; i<this.rig.length; i++){
      if(this.rig[i].isRoot) this.fullRig = new RigShape(i,this.scale,this.model,this.rig,this.animations,this.colors);
    }
    this.selectAnimation(1);
    this.timeCounter=0;


  }

  selectAnimation(index){
    this.pose=index;
    this.fullRig.selectAnimation(index);
  }

  update(context,flipped){

    this.fullRig.updateRotationValues();
    ctx.translate(this.x,this.y);
    if(flipped) ctx.scale(-1,1);
    this.fullRig.display(ctx);
    ctx.resetTransform();

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.pose].animLength) this.timeCounter=0;
  }

}

class RigShape{

  constructor(index,scale,m,r,a,c){
    //  // console.log(animShapes[index])
    // get origin from animShape index
    this.colors=c;
    this.rig = r;
    this.animations=a;
    this.shapeIndex=index;
    this.origin={ x:r[index].origin.x*scale, y:r[index].origin.y*scale };
    this.rotation =0;
    this.paths = [];

    this.timeCounter=0;

    for(let i=0; i<m.length; i++){
      // create path from model save data
      if(m[i].shape==index){

        let o=m[i].origin;
        let x=o.x*scale;
        let y=o.y*scale;
        let path = `M ${x} ${y} `;
        let s = m[i].segments;

        for(let j=0; j<s.length; j++){

          path+=s[j].type+" ";
          let p = s[j].points;

          for(let k=0; k<p.length; k++){
            x=p[k].x*scale;
            y=p[k].y*scale;
            path+=`${x} ${y} `;
          }
        }
        this.paths.push({path:new Path2D(path),stroke: m[i].stroke, fill: m[i].fill});
      }

    }

    // create pins from animshape index
    this.pins=[];
    for(let i=0; i<r[index].pins.length; i++){
      let p = r[index].pins[i];
      //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.pins.push({
        shape:new RigShape( p.shape,scale,m,r,a,c),
        x: p.x*scale,
        y: p.y*scale
      });
    }
  }
  selectAnimation(index){
    this.pose=index;
    for(let i=0; i<this.pins.length; i++){
      //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.pins[i].shape.selectAnimation(index);
    }
  }
  updateRotationValues(){

    //setRotationsFromTimeStamps();\
    // if time is 0, rotations = initial values
    if(this.timeCounter==0){
      this.rotation= this.animations[this.pose].initVals[this.shapeIndex];
    }
    else{
      // if time isn't 0, we hafta look at the timestamps

      this.rotation = this.getRotFromTimeStamps();
      //     // console.log(this.rotation+", time: "+timeCounter);

    }

    for(let i=0; i<this.pins.length; i++){
      this.pins[i].shape.updateRotationValues();
    }

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.pose].animLength) this.timeCounter=0;
  }

  // context must be specified since this is used in both
  // the rig editor's and the anim editor's canvas.
  display(context){
    // display this


    context.save();
    context.rotate(rad(this.rotation));
    context.translate(-this.origin.x,-this.origin.y)

    // display all paths in this shape
    for(let i=0; i<this.paths.length; i++){

      context.strokeStyle=this.colors[this.paths[i].stroke];
      context.fillStyle=this.colors[this.paths[i].fill];
      //  context.strokeStyle="black"
      //  context.fillStyle="blue"
      context.fill(this.paths[i].path);
      context.stroke(this.paths[i].path);
      //  // console.log(this.paths[i].path)
    }

    // + display any pins
    for(let i=0; i<this.pins.length; i++){
      context.save();
      context.translate(this.pins[i].x,this.pins[i].y);
      this.pins[i].shape.display(context);
      context.restore();
    }
    context.restore();
  }

  // getgotfromtimestamps()
  //
  // calculates this rig shape's rotation value according to time stamps

  getRotFromTimeStamps(){

    let newrot; // value to be returned

    // get list of time stamps for this shape
    let stamps = this.animations[this.pose].timeStamps[this.shapeIndex];
    //// console.log(stamps);
    // find which stamp is just behind and which stamp is just ahead
    // at this point in time:

    let correctStampFound=false;
    //  // console.log(stamps);
    // if this shape has time stamps
    if(stamps.length>0){

      // check each time stamp related to this shape
      for(let i=0; i<stamps.length; i++){

        // if current time is less than this stamp's time,
        // then stamps[j] is the stamp we are working towards.
        if(this.timeCounter<=stamps[i].time&&!correctStampFound){

          let lastStampTime=0;
          let lastStampRot=0;

          // get time between last stamp and this next stamp:
          if(i>0) {
            // if last stamp was a timestamp
            lastStampTime=stamps[i-1].time;
            lastStampRot=stamps[i-1].rot;
          }
          else{
            //if last stamp was the initval
            lastStampTime=0;
            lastStampRot=this.animations[this.pose].initVals[this.shapeIndex];
          }

          // calculate where we are (% of time between stamps) (fraction of 1)
          let pos = (this.timeCounter-lastStampTime)/(stamps[i].time-lastStampTime);

          // calculate rotation:
          // d = lastStampRot + %pos * (nextStampRot-lastStampRot)
          newrot = lastStampRot + pos * (stamps[i].rot - lastStampRot);
          //  // console.log(timeCounter,lastStampTime,stamps[i].time,pos,lastStampRot,newrot);

          correctStampFound=true;
        }
      }
      if(!correctStampFound){
        // case in which there are no more stamps ahead (work back to initval)

        let lastStampTime=stamps[stamps.length-1].time;
        let lastStampRot=stamps[stamps.length-1].rot;

        let pos = (this.timeCounter-lastStampTime)/(this.animations[this.pose].animLength-lastStampTime);
        //  // console.log("POS2* "+pos);
        //    // console.log(timeCounter,lastStampTime,pos,lastStampRot,newrot);
        newrot = lastStampRot + pos * (this.animations[this.pose].initVals[this.shapeIndex] - lastStampRot);
      }
    }
    //currentRigPos[this.shapeIndex]=newrot;
    return newrot;
  }
}





let cmess="";
let segments = [];
let riglength;

function newSeg(t,charindex,ns){
  let p = {x:this.toNum(charindex,ns),y:this.toNum(charindex+1,ns)};
  segments.push({type:t,points:[p]});
}

function toNum(character,startnum){
  return cmess.charCodeAt(character)-startnum;
}

function isns1(message,charindex){
  return (message.charCodeAt(charindex)<ns2);
}

function toAngle(i){
  return 180*this.toNum(i,ns2)/30;
}




function unpackModelMessage(modeldata){

  let m = modeldata.split("*");
  let model = [];
  segments = [];

  // for each path
  for(let i=0; i<m.length; i++){

    cmess=m[i];
    segments = [];

    // check out characters by pair
    for(let j=5; j<m[i].length; j+=2){

      // if this point is part of a line
      if(toNum(j,0)<ns2) newSeg('L',j,ns1);

      // otherwise this point is part of a curve
      else{
        let sl=segments.length-1;

        if(sl>=0){
          // look at the current batch of points
          let s = segments[sl];
          // if they were part of a line, start a new curve
          if(s.type=="L") newSeg('C',j,ns2);
          // if instead we already have a curve going
          else {
            // if it's not full, add a point
            let p = s.points;
            if(p.length<3) p.push({x:toNum(j,ns2),y:toNum(j+1,ns2)});
            // if it is full start a new curve
            else newSeg('C',j,ns2);
          }
        }
        // lastly if there was nothing in the list, add new curve entry
        else newSeg('C',j,ns2);

      }
    }

    model.push({
      shape:toNum(0,ns1),
      fill:toNum(1,ns1),
      stroke:toNum(2,ns1),
      origin:{x:toNum(3,ns1),y:toNum(4,ns1)},
      segments:segments
    });
  }

  return model;
}

function unpackRigMessage(rigdata){

  let rig=[];

  let m = rigdata;
  cmess=m;
  let counter=0;

  for(let i=0; i<m.length; i++){

    let r = rig[rig.length-1];

    if(counter==0) rig.push({origin:{x:toNum(i,ns1)},pins:[],isRoot:false});
    else if(counter==1) r.origin.y=toNum(i,ns1);
    else if (counter>2){

      let c = r.pins[r.pins.length-1];
      if(counter%3==0) r.pins.push({x:toNum(i,ns2)});
      else if(counter%3==1) r.pins[r.pins.length-1].y=toNum(i,ns2);
      else c.shape=toNum(i,ns2);

    }
    else if(counter==2&&m[i]=='1') r.isRoot=true;

    counter++;
    if(counter>2&&isns1(m,i+1)) counter=0;

  }
  riglength=rig.length;
  return rig;
}

function unpackAnimation(anim){

  let animations = [];
  cmess = anim;
  let m = anim;
  let done = false;
  let lastEnd=0;

  while(!done){

    let nameEnd = m.indexOf('*',lastEnd+1);
    let a={ name: m.substring(lastEnd+1,nameEnd) };
    a.animLength = toNum(nameEnd+1,ns1);

    let x = nameEnd+1+riglength;
    a.initVals = [];
    a.timeStamps = [];

    for(let i=nameEnd+2; i<x+1; i++){
      a.initVals.push( toAngle(i) );
    }

    lastEnd = x+1;
    for(let i=0; i<riglength; i++){

      a.timeStamps.push([]);
      let nextEnd = m.indexOf('*',lastEnd+1);
      let counter=0;

      for(let j=lastEnd+1; j<nextEnd; j++){
        let ts=a.timeStamps[ a.timeStamps.length-1];
        if(counter%2==0) ts.push( {rot: toAngle(j) } );
        else ts[ ts.length-1 ].time=toNum(j,ns1);
        counter++;
      }

      lastEnd = nextEnd;
      if(nextEnd==-1) done = true;
    }
    animations.push(a);
  }

  return animations;
}
