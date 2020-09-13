
// actionbutton()
//
// called when user presses action button. triggers dialog ui

let actionButton=()=>{
  if(isHome()&&aboutguy.interactible){

    if(!dUI.open){

      dUI.open=true;
      dUI.t=aboutguy;

      pickDialog();
      dUI.line = texts[saveData.textProgress].split(" ");

      cutDialog();
    }
    else continueDialog();

    agTalkCounter=6+randInt(9);
    clearTimeout(agTalkTimeout);
    aboutGuyTalk();
  }
}

let pickDialog=()=>{
  let p = saveData.gameProgress;
  let d = saveData.directoryProgress;
  let b = saveData.bossProgress;
  let notdone=false;
  let r = 0;
  if(awarded('start')) {

    if(b==0&&b==0) r = 1+randInt(3);

    else if(b>0){
      if(!awarded('r4')){
        p.push('r4');
        r=9;
      }
      else if(b>1) r=10;

      else {
        if(b==1) notdone=true;
        else r=11;
      }
    }

    if((d>0&&b==0)||notdone){



      if(d==1&&!awarded('r3')){
        p.push('r3')
        r=4;
      }

      else if(d>2&&!awarded('r1')){
        p.push('r1')
        r=6;
      }

      else if(d>5&&!awarded('r2')){
        p.push('r2')
        r=7
      }
      else if(d==7) r = 8;

      else  r = 12+randInt(4);

    }
  }

  saveData.textProgress=r;
}

let awarded=(name)=> saveData.gameProgress.includes(name)
