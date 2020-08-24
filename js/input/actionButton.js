let exitDoorRange=30;

// actionbutton()
//
// called when user presses action button. triggers dialog ui

function actionButton(){
  if(currentLevel=='home'){
    let a = aboutguy.interactible;


    if(!displayLinksUI&&!displayProcessUI){
      if(a){
        if(!dialogUI.open){

          if(aboutguyDialogProgression>=1){

            if(haveItem(enemyLootTable[0].name,dataCost)!=-1){
              aboutguyDialogProgression =3;
              processDataStrips();
              let t = "That's the entire url! Type it into the address bar and let's get rid of this virus. Also, bring me more data strips so we can uncover more urls.";
            //  let t1 = '';
              if(revealedLink.includes('_')){
                t=". There's gotta be an infected file there, if only we knew the entire url. Bring me more data strips and I can complete it! Or just take a guess?";
            //  t1=t;
              }
              aboutguydialogs[3] = "Oh Data strips! Let me process those... "+revealedLink+". "+t;


              aboutguydialogs[2] = "Here's what I've got: "+revealedLink+". "+t;
            }
            else if(haveItem(enemyLootTable[0].name,1)!=-1) aboutguyDialogProgression =2;
            else aboutguyDialogProgression =1;
          }
          dialogUI.open=true;

          if(a){
            dialogUI.t=aboutguy;
            dialogUI.line = aboutguydialogs[aboutguyDialogProgression].split(" ");
          }

          if(!revealedLink.includes('_'))
          pickNextLinkAward();

          cutDialog();
        }
        else continueDialog();
      }
    }
    // if either links or process ui are open
    else {
      if(displayLinksUI){

      }
      else if(displayProcessUI){

      }
    }


  }
  else {
    if(exitdoor.interactible){
      loadHomeLevel();
    }
  }
}


function loadHomeLevel(){
  currentLevel='home';
  createLevel();
  createPlayer();
  fadeIn=0;
  waittime=8;
  console.log("load home level")
}

function getSavedGameAndStart(){
  console.log("get saved game...???");
  loadHomeLevel();
}
