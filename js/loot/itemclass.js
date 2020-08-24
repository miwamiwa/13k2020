let enemyLootTable = [
  {name:"data strip",fill:"grey",quantity:{min:12,r:14},chance:1}
];


let cleaningitem = 'level clear-tastik';

let items = [];
let inventory = [];

function generateLoot(target){

  let quantity = 5+randInt(15);
  for(let i=0; i<quantity; i++){

    items.push(new Item(target.x,target.y-50,10,'grey','data strip',1));
    let j=items[items.length-1];
    j.impactForce.x = 6+randInt(12);
    if(Math.random()>0.5) j.impactForce.x*=-1;
    j.initJumpForce=11;
    j.jump();
  }
}



function updateItems(){

  for(let i=items.length-1; i>=0; i--){
    items[i].update();
    if(items[i].looted) items.splice(i,1);
  }
}

class Item extends MovingObject {

  constructor(x,y,size,fill,name,quantity){
    super(x,y,size,fill);
    this.name=name;
    this.looted = false;
    this.lootableRange = 80;
    this.pickupRange = 10;
    this.lootSpeed=1;
    this.quantity = quantity;
  //  console.log("load loot!")
  }

  update(){
//console.log("yo")
    if(!this.looted){
      let d = distance(this.x,this.y,player.x,player.y);
      if(d.d<this.pickupRange){
        // ITEM PICKED UP !
        this.looted = true;

        addLoot();

      }
      else if(d.d<this.lootableRange){
        // ITEM MOVES TOWARDS PLAYER
        this.lootSpeed++;
        let ratio = this.lootSpeed/d.d;
        this.speedVect = {
          y: ratio*d.opp,
          x: ratio*d.adj
        }
        this.x+=this.speedVect.x;
        this.y+=this.speedVect.y;
        this.fallSpeed=0;
      }
      else if(this.lootSpeed>1) this.lootSpeed--;


      this.display();

      //console.log("updat4!")
    }

  }
}
