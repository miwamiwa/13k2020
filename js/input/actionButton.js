let exitDoorRange=30;

// actionbutton()
//
// called when user presses action button. triggers dialog ui

function actionButton(){
  if(currentLevel=='home'){
    let a = aboutguy.interactible;


    if(!displayLinksUI&&!displayProcessUI){
      if(a||computer.interactible){
        if(!dialogUI.open){

          dialogUI.open=true;
          if(a){
            dialogUI.t=aboutguy;
            dialogUI.line = aboutguydialogs[aboutguyDialogProgression].split(" ");
          }

          else{
            dialogUI.line = computerdialogs[computerDialogProgression].split(" ");
            dialogUI.t =computer;
          }
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
      currentLevel='home';
      createLevel();
      createPlayer();
      fadeIn=0;
      waittime=8;
    }
  }
}
