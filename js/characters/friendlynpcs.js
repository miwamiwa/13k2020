let aboutguy;

let createFriendlyNPCs=()=>{

  let pos = level1.platforms[level1.platforms.length-1];
  aboutguy=new MovingObject(pos.x+150,pos.y-30,20,nocolor);
}


let runFriendlyNPCs=()=>{

  aboutguy.display();
  enableInteraction(aboutguy,"press E",50);
  if(aboutguy.screenPos!=false){
  //  edata.fullRig.
  aboutModel.x=aboutguy.screenPos.x+8;
  aboutModel.y=aboutguy.screenPos.y-24;
    aboutModel.update(ctx,false);
  }
}


let enableInteraction=(npc, text, range)=>{

  if(npc.screenPos!=false){
    let d = distance(player.x,player.y,npc.x,npc.y);
    if(d.d<range){

      npc.interactible = true;
      
      let p = npc.screenPos;
      ctx.fillText(text,p.x+25,p.y-40,'black',10);
    }
    else npc.interactible = false;

  }
  else npc.interactible = false;
}
