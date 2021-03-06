let dUI = {
  open: false,
  t: 0,
  counter:0,
  line:[],
  lineI:0,
  displayedText:""
};

let dialogDone = false;
let maxCharsPerLine = 20;


// rundialog()
//
//

let runDialog=()=>{

  if(dUI.open){

    if(dUI.t!=0){
      let p = getScreenPos({x:dUI.t.x,y:dUI.t.y,w2:50,h2:50});
      dUI.x = p.x - 50;
      dUI.y = p.y - 110;
    }

    cFill('white');
    cRect(dUI.x,dUI.y,250,50);
    cFill('black');
    cFont(20)
    cText(dUI.displayedText[0],dUI.x+5,dUI.y+20)
    cText(dUI.displayedText[1],dUI.x+5,dUI.y+40)
  }

  // if no one is interactible, close dialog ui (add any other interactible things here)
  if(!aboutguy.interactible) dUI.open=false;

}


// continuedialog()
//
//


let continueDialog=()=>{

  // dialog over actions
  if(dialogDone){

    dUI.open = false;
    dialogDone = false;
    let p = saveData.gameProgress;
    // trigger action.. so far there is only one.. should this be an if()?


    if(saveData.textProgress==0){

      for(let i=0; i<2; i++)
        newLevel(allLinkNames[i]);

      updateFavorites();
      p.push('start');

      saveData.textProgress = 1;
      setTimeout(function(){dUI.open=true;dUI.line = texts[1].split(" ");cutDialog();},200);

    }
  }
  else
    cutDialog();
}


// cutdialog()
//
//

let cutDialog=()=>{


  let line1 = makeLine();
  let line2 = {t:""};
  if(!line1.stop) line2 = makeLine();

  dUI.displayedText=[line1.t,line2.t];
}


// makeline()
//
//

let makeLine=()=>{

  let result="";
  let stop=false;
  let broke=false;
  while(!stop&&!broke&&result.length+dUI.line[0].length<maxCharsPerLine){

    if(dUI.line[0]=='#') broke=true;
    else result+=dUI.line[0]+" ";

    dUI.line.shift();
    if(dUI.line.length==0){
      stop=true;
      dialogDone = true;
    }
  }
  return {t:result,stop:stop};
}
