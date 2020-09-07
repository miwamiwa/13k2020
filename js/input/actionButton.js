
// actionbutton()
//
// called when user presses action button. triggers dialog ui

let actionButton=()=>{
  if(currentLevel=='home'&&aboutguy.interactible){

      if(!dUI.open){

        dUI.open=true;
        dUI.t=aboutguy;
        dUI.line = texts[saveData.textProgress].split(" ");

        if(!revealedLink.includes('_'))
          pickNextLinkAward();

        cutDialog();
      }
      else continueDialog();
  }
}
