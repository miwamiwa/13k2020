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
    this.counter=0;


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

    this.counter++;
    if(this.counter>this.animations[this.pose].animLength) this.counter=0;
  }

}

class RigShape{

  constructor(index,scale,m,r,a,c){
    //  // console.log(animShapes[index])
    // get origin from animShape index
    this.colors=c;
    this.rig = r;
    this.animations=a;
    this.sIndex=index;
    this.origin={ x:r[index].origin.x*scale, y:r[index].origin.y*scale };
    this.rotation =0;
    this.paths = [];

    this.counter=0;

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
      this.pins.push({
        shape:new RigShape( p.shape,scale,m,r,a,c),
        x: p.x*scale,
        y: p.y*scale
      });
    }
  }

  selectAnimation(index){
    this.pose=index;
    for(let i=0; i<this.pins.length; i++)
      this.pins[i].shape.selectAnimation(index);
  }
  updateRotationValues(){
    // if time is 0, rotations = initial values
    if(this.counter==0) this.rotation= this.animations[this.pose].initVals[this.sIndex];
    else this.rotation = this.getRotFromTimeStamps();

    for(let i=0; i<this.pins.length; i++)
      this.pins[i].shape.updateRotationValues();

    this.counter++;
    if(this.counter>this.animations[this.pose].animLength) this.counter=0;
  }

  // context must be specified since this is used in both
  // the rig editor's and the anim editor's canvas.
  display(c){
    c.save();
    c.rotate(rad(this.rotation));
    c.translate(-this.origin.x,-this.origin.y)

    // display all paths in this shape
    for(let i=0; i<this.paths.length; i++){
      // set style
    //  cFill(this.colors[this.paths[i].fill]);
    //  c.fill(this.paths[i].path);

      // draw stroke if there is stroke
    //  let s=this.colors[this.paths[i].stroke];
    //  if(s!=nocolor){
  //  c.strokeWeight='4px'
        c.strokeStyle=this.colors[this.paths[i].stroke];
        c.stroke(this.paths[i].path);
    //  }
    }

    // + display any pins
    for(let i=0; i<this.pins.length; i++){
      c.save();
      c.translate(this.pins[i].x,this.pins[i].y);
      this.pins[i].shape.display(c);
      c.restore();
    }
    c.restore();
  }

  // getgotfromtimestamps()
  //
  // calculates this rig shape's rotation value according to time stamps

  getRotFromTimeStamps(){


    // get list of time stamps for this shape
    let p=this.animations[this.pose];
    let stamps = p.timeStamps[this.sIndex];

    // if this shape has time stamps
    if(stamps.length>0){

      // check each time stamp related to this shape
      for(let i=0; i<stamps.length; i++){
        // if current time is less than this stamp's time,
        // then stamps[j] is the stamp we are working towards.
        if(this.counter<=stamps[i].time){
          setlast(0,0)
          let s = stamps[i-1]
          // get time between last stamp and this next stamp:
          if(i>0) setlast(s.time,s.rot);
          else setlast(0,p.initVals[this.sIndex]); //if last stamp was the initval
          // calculate rotation:
          return this.lerprot(stamps[i].time,stamps[i].rot);
        }
      }
        // case in which there are no more stamps ahead (work back to initval)
        let s = last(stamps);
        setlast(s.time,s.rot);
        return this.lerprot(p.animLength,p.initVals[this.sIndex]);
    }
    else return this.animations[this.pose].initVals[this.sIndex];
  }

  lerprot(t,r){
    return lastp.r + (this.counter-lastp.t)/(t-lastp.t) * (r - lastp.r);
  }
}

let lastp;
let setlast=(t,r)=> lastp={t:t,r:r};

let cmess="";
let segments = [];
let riglength;

let newSeg=(t,charindex,ns)=>
  segments.push({type:t,points:[{x:toNum(charindex,ns),y:toNum(charindex+1,ns)}]});


let toNum=(character,startnum)=>
  cmess.charCodeAt(character)-startnum;


let isns1=(message,charindex)=>
  (message.charCodeAt(charindex)<ns2);

let toAngle=(i)=>
  180*toNum(i,ns2)/30;





let unpackModelMessage=(modeldata)=>{

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
          let p = s.points;
          // if they were part of a line, start a new curve
          if(s.type=="L") newSeg('C',j,ns2);
          // if instead we already have a curve going
          else {
            // if it's not full, add a point
            if(p.length<3) p.push({x:toNum(j,ns2),y:toNum(j+1,ns2)});
            else newSeg('C',j,ns2); // if it is full start a new curve
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

let unpackRigMessage=(rigdata)=>{

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

let unpackAnimation=(anim)=>{

  let animations = [];
  cmess = anim;
  let m = anim;
  let done = false;
  let lastEnd=0;

  while(!done){

    let nameEnd = m.indexOf('*',lastEnd+1);
    let a={ name: m.substring(lastEnd+1,nameEnd) };
    a.animLength = toNum(nameEnd+1,ns1);
  //  console.log(a.animLength)
    let x = nameEnd+1+riglength;
    a.initVals = [];
    a.timeStamps = [];

    for(let i=nameEnd+2; i<x+1; i++){
      a.initVals.push( toAngle(i) );
    //  if(cmess[i]=='\\') i++;
    }

    lastEnd = x+1;
    for(let i=0; i<riglength; i++){

      a.timeStamps.push([]);
      let nextEnd = m.indexOf('*',lastEnd+1);
      if(nextEnd==-1){
        nextEnd=m.length;
        done=true;
      }
      let counter=0;

      for(let j=lastEnd+1; j<nextEnd; j++){
        let ts=a.timeStamps[ a.timeStamps.length-1];
        if(counter%2==0) ts.push( {rot: toAngle(j) } );
        else ts[ ts.length-1 ].time=toNum(j,ns1);
        counter++;
      }

      lastEnd = nextEnd;

    }
    animations.push(a);
  }

  return animations;
}
