let aboutguy;

let createFriendlyNPCs=()=>{

  let pos = level1.platforms[level1.platforms.length-1];
  aboutguy=new MovingObject(pos.x+150,pos.y-30,20,nocolor);
}

let lastaboutstate=false;
let aboutguytalking=false;
let runFriendlyNPCs=()=>{

  aboutguy.display();
  enableInteraction(aboutguy,"press E",80);
  if(aboutguy.screenPos!=false){
  //  edata.fullRig.
  aboutModel.x=aboutguy.screenPos.x+8;
  aboutModel.y=aboutguy.screenPos.y-4;
    aboutModel.update(ctx,false);

    if(!dUI.open&&lastaboutstate){

      aboutguytalking = false;
    }
    else if(dUI.open&&!lastaboutstate){

      aboutguytalking=true;

      aboutGuyTalk();
    }
  }

  lastaboutstate=dUI.open;
}

let agTalkTimeout;
let agTalkCounter=8;
let aboutGuyTalk=()=>{

  let l = 60+randInt(140)
  let t = undefined;
  let filt = 1200;
  let freq = 400+randInt(50);
  //if(Math.random()<0.3&&agTalkCounter==1) l*=4;
  if(Math.random()<0.8){
    t = -0.0001*randInt(50);
    filt = 200;
  }


  if(Math.random()<0.8)
  play(freq,0.01*randInt(3),0.11,0.3,l/1100,10,constSine3,4,'highpass',filt,3,t);
//  else aboutModel.fullRig.selectAnimation(0);
  agTalkCounter--;

  if(aboutguytalking&&agTalkCounter>0){
    aboutModel.fullRig.selectAnimation(1);
    agTalkTimeout=setTimeout(aboutGuyTalk, l);
  }
  else aboutModel.fullRig.selectAnimation(0);

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
