let ns1 = 58;
let ns2 = 93;

class CoolPath{
  constructor(x,y,modeldata,rig,anim,colors){
    this.x=x;
    this.y=y;
    this.cmess;
    this.scale = 1.5;
    this.colors = colors;
    this.unpackModelMessage(modeldata); // this.model
    this.unpackRigMessage(rig); // this.rig
    this.unpackAnimation(anim); // this.animations


    for(let i=0; i<this.rig.length; i++){
      if(this.rig[i].isRoot) this.fullRig = new RigShape(i,this.scale,this.model,this.rig,this.animations,this.colors);
    }
    this.selectAnimation(1);
    this.timeCounter=0;
  }

  selectAnimation(index){
    this.selectedAnimation=index;
    this.fullRig.selectAnimation(index);
  }

  update(context,flipped){

    this.fullRig.updateRotationValues();
    ctx.translate(this.x,this.y);
    if(flipped) ctx.scale(-1,1);
    this.fullRig.display(ctx);
    ctx.resetTransform();

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.selectedAnimation].animLength) this.timeCounter=0;
  }
  unpackModelMessage(modeldata){

    let m = modeldata.split("*");
    this.model = [];

    // for each path
    for(let i=0; i<m.length; i++){

        this.cmess=m[i];
        this.segments = [];

        // check out characters by pair
        for(let j=5; j<m[i].length; j+=2){

            // if this point is part of a line
         if(this.toNum(j,0)<ns2) this.newSeg('L',j,ns1);

          // otherwise this point is part of a curve
          else{
            let sl=this.segments.length-1;

            if(sl>=0){
              // look at the current batch of points
              let s = this.segments[sl];
              // if they were part of a line, start a new curve
              if(s.type=="L") this.newSeg('C',j,ns2);
              // if instead we already have a curve going
              else {
                // if it's not full, add a point
                let p = s.points;
                  if(p.length<3) p.push({x:this.toNum(j,ns2),y:this.toNum(j+1,ns2)});
                  // if it is full start a new curve
                  else this.newSeg('C',j,ns2);
              }
            }
            // lastly if there was nothing in the list, add new curve entry
            else this.newSeg('C',j,ns2);

          }
        }

        this.model.push({
          shape:this.toNum(0,ns1),
          fill:this.toNum(1,ns1),
          stroke:this.toNum(2,ns1),
          origin:{x:this.toNum(3,ns1),y:this.toNum(4,ns1)},
          segments:this.segments
        });
    }

  }

  unpackRigMessage(rig){

    this.rig=[];

    let m = rig;
    this.cmess=m;
    let counter=0;

    for(let i=0; i<m.length; i++){

      let r = this.rig[this.rig.length-1];

      if(counter==0) this.rig.push({origin:{x:this.toNum(i,ns1)},connections:[],isRoot:false});
      else if(counter==1) r.origin.y=this.toNum(i,ns1);
      else if (counter>2){

          let c = r.connections[r.connections.length-1];
          if(counter%3==0) r.connections.push({x:this.toNum(i,ns2)});
          else if(counter%3==1) r.connections[r.connections.length-1].y=this.toNum(i,ns2);
          else c.shape=this.toNum(i,ns2);

      }
      else if(counter==2&&m[i]=='1') r.isRoot=true;

      counter++;
      if(counter>2&&this.isns1(m,i+1)) counter=0;

    }
  }

  unpackAnimation(anim){

    this.animations = [];
    this.cmess = anim;
    let m = anim;
    let done = false;
    let lastEnd=0;

    while(!done){

      let nameEnd = m.indexOf('*',lastEnd+1);
      let a={ name: m.substring(lastEnd+1,nameEnd) };
      a.animLength = this.toNum(nameEnd+1,ns1);

      let x = nameEnd+1+this.rig.length;
      a.initVals = [];
      a.timeStamps = [];

      for(let i=nameEnd+2; i<x+1; i++){
        a.initVals.push( this.toAngle(i) );
      }

      lastEnd = x+1;
      for(let i=0; i<this.rig.length; i++){

        a.timeStamps.push([]);
        let nextEnd = m.indexOf('*',lastEnd+1);
        let counter=0;

        for(let j=lastEnd+1; j<nextEnd; j++){
          let ts=a.timeStamps[ l(a.timeStamps)-1];
          if(counter%2==0) ts.push( {rot: this.toAngle(j) } );
          else ts[ l(ts)-1 ].time=this.toNum(j,ns1);
          counter++;
        }

        lastEnd = nextEnd;
        if(nextEnd==-1) done = true;
      }
      this.animations.push(a);
    }

  //  return result;
  }

  newSeg(t,charindex,ns){
    let p = {x:this.toNum(charindex,ns),y:this.toNum(charindex+1,ns)};
    this.segments.push({type:t,points:[p]});
  }

  toNum(character,startnum){
    return this.cmess.charCodeAt(character)-startnum;
  }

  isns1(message,charindex){
    return (message.charCodeAt(charindex)<ns2);
  }

  toAngle(i){
    return 180*this.toNum(i,ns2)/30;
  }
}

class RigShape{

  constructor(index,scale,model,rig,animations,colors){
  //  // console.log(animShapes[index])
    // get origin from animShape index
    this.colors=colors;
    this.model=model;
    this.rig = rig;
    this.animations=animations;
    this.shapeIndex=index;
    this.origin={ x:this.rig[index].origin.x*scale, y:this.rig[index].origin.y*scale };
    this.rotation =0;
    this.paths = [];
    this.fill;
    this.stroke;
    this.timeCounter=0;

    for(let i=0; i<this.model.length; i++){
      // console.log(this.model[i]);
      // create path from model save data
      if(this.model[i].shape==index){

      let x=this.model[i].origin.x*scale;
      let y=this.model[i].origin.y*scale;
      let path = "M "+x+" "+y+" ";
      for(let j=0; j<this.model[i].segments.length; j++){
        path+=this.model[i].segments[j].type+" ";

        for(let k=0; k<this.model[i].segments[j].points.length; k++){

          x=this.model[i].segments[j].points[k].x*scale;
          y=this.model[i].segments[j].points[k].y*scale;
          path+=x + " " + y;

          path+=" ";
        }
      }

      this.paths.push({path:new Path2D(path),stroke: this.model[i].stroke, fill: this.model[i].fill});
    }

    }

    // create connections from animshape index
    this.connections=[];
    for(let i=0; i<this.rig[index].connections.length; i++){
    //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.connections.push({
        shape:new RigShape(this.rig[index].connections[i].shape,scale,this.model,this.rig,this.animations,this.colors),
        x: this.rig[index].connections[i].x*scale,
        y: this.rig[index].connections[i].y*scale
      });
    }
  }
  selectAnimation(index){
    this.selectedAnimation=index;
    for(let i=0; i<this.connections.length; i++){
    //  // console.log("add connection to "+animShapes[index].connectors[i].shape)
      this.connections[i].shape.selectAnimation(index);
    }
  }
  updateRotationValues(){

      //setRotationsFromTimeStamps();\
      // if time is 0, rotations = initial values
      if(this.timeCounter==0){
        this.rotation= this.animations[this.selectedAnimation].initVals[this.shapeIndex];
      }
      else{
        // if time isn't 0, we hafta look at the timestamps

       this.rotation = this.getRotFromTimeStamps();
    //     // console.log(this.rotation+", time: "+timeCounter);

      }

    for(let i=0; i<this.connections.length; i++){
      this.connections[i].shape.updateRotationValues();
    }

    this.timeCounter++;
    if(this.timeCounter>this.animations[this.selectedAnimation].animLength) this.timeCounter=0;
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

    // + display any connections
    for(let i=0; i<this.connections.length; i++){
      context.save();
      context.translate(this.connections[i].x,this.connections[i].y);
      this.connections[i].shape.display(context);
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
    let stamps = this.animations[this.selectedAnimation].timeStamps[this.shapeIndex];
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
              lastStampRot=this.animations[this.selectedAnimation].initVals[this.shapeIndex];
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

        let pos = (this.timeCounter-lastStampTime)/(this.animations[this.selectedAnimation].animLength-lastStampTime);
      //  // console.log("POS2* "+pos);
        //    // console.log(timeCounter,lastStampTime,pos,lastStampRot,newrot);
        newrot = lastStampRot + pos * (this.animations[this.selectedAnimation].initVals[this.shapeIndex] - lastStampRot);
      }
    }
    //currentRigPos[this.shapeIndex]=newrot;
    return newrot;
  }
}
