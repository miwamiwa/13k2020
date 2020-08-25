let aboutguy;

function createFriendlyNPCs(){

  let pos = level1.platforms[level1.platforms.length-1];
  aboutguy=new MovingObject(pos.x+150,pos.y-30,20,'#22af');
}


function runFriendlyNPCs(){

  aboutguy.display();
  enableInteraction(aboutguy,"press E",50);
}


function enableInteraction(npc, text, range){

  if(npc.screenPos!=false){
    let d = distance(player.x,player.y,npc.x,npc.y);
    if(d.d<range){

      npc.interactible = true;
      ctx.fillStyle='black';
      ctx.font = "10px Georgia";
      let p = npc.screenPos;
      ctx.fillText(text,p.x,p.y-20);
    }
    else npc.interactible = false;

  }
  else npc.interactible = false;
}
