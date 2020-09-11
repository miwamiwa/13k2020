let items = [];

let generateLoot=(target,poofy,colors)=>{

  let res = 5+randInt(15);
  let fill = 'grey';

  //console.log("poof!", colors,i)

  //console.log(color)
  for(let i=0; i<res; i++){

    if(colors!=undefined) fill= colors[ randInt(colors.length) ];

    if(poofy!=undefined) items.push(new Item(target.x,target.y-50,8,fill,true));
    else items.push(new Item(target.x,target.y-50,10,fill));


    // apply force to item
    let j=items[items.length-1];
    j.impactForce.x = 6+randInt(12);
    if(Math.random()>0.5) j.impactForce.x*=-1;
    j.initJumpForce=11;
    j.jump();
  }
}



let updateItems=()=>{

  for(let i=items.length-1; i>=0; i--){
//    console.log("hey")
    items[i].update();
    if(items[i].looted||(items[i].poofy && items[i].pfact>30)) items.splice(i,1);

  }
}

class Item extends MovingObject {

  constructor(x,y,size,fill,poofy){
    super(x,y,size,fill);
    this.size=size;
    this.looted = false;
    this.v=1;
    if(poofy!=undefined){
      this.poofy=true;
      this.pfact=0;
    }
  }

  update(){
    if(this.poofy){
      this.pfact++;
    }
    else if(!this.looted){
      let d = distance(this.x,this.y,player.x,player.y);

      // item picked up
      if(d.d<10){ // set pickup range here
        this.looted = true;
        addLoot();
      }

      // item in player range
      else if(d.d<80){ // set pull range here
        this.v++;
        let r = this.v/d.d;

        this.x+=r*d.adj;
        this.y+=r*d.opp;
        this.fallSpeed=0;
      }
      else if(this.v>1) this.v--;

    }
    let p=this.display();
    if(p!=false) cRect(p.x,p.y,this.size,this.size,this.fill);
  }
}
