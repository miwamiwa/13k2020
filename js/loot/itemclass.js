let enemyLootTable = [
  {name:"angry data strip",fill:"grey",quantity:{min:12,r:14},chance:1},
  {name:"gold",fill:"gold",quantity:{min:1,r:5},chance:0.5},
  {name:"html bits",fill:"lightblue",quantity:{min:3,r:52},chance:0.8},
  {name:"health pot",fill:"tomato",quantity:{min:1,r:3},chance:0.9}
];

let cleaningitem = 'level clear-tastik';

let items = [];
let inventory = [];

function generateLoot(target){

  let r = Math.random();
  for(let i=0; i<enemyLootTable.length; i++){
    if(r<enemyLootTable[i].chance){
      let e = enemyLootTable[i];
      let r2 = Math.floor(e.quantity.min+Math.random()*e.quantity.r);
      items.push(new Item(target.x,target.y-50,10,e.fill,e.name,r2));
    //  console.log(items[items.length-1])
      let index=items.length-1;
      items[index].impactForce.x = Math.floor(6 + Math.random()*12);
      if(Math.random()>0.5) items[index].impactForce.x*=-1;
      items[index].initJumpForce=11;
      items[index].jump();
    }
  }
}

function updateItems(){
//  console.log("sup boyx")
  for(let i=0; i<items.length; i++){
    items[i].update();
  //  console.log("updat4e it")
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

        addToInventory(this.name,this.quantity);
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
      if(this.screenPos!=false){
        ctx.fillStyle='#000b';
        ctx.font='8px bold';
        ctx.fillText(this.quantity,this.screenPos.x+15,this.screenPos.y-15)
      }
      //console.log("updat4!")
    }

  }
}
