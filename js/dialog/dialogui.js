let dialogUI = {
  open: false,
  t: 0,
  counter:0,
  line:[],
  lineI:0,
  displayedText:""
};

let aboutguyDialogProgression =0;
let computerDialogProgression =0;


function runDialog(){

  if(dialogUI.open){

    if(dialogUI.t!=0){
      let p = getScreenPos({x:dialogUI.t.x,y:dialogUI.t.y,w2:50,h2:50});
      dialogUI.x = p.x;
      dialogUI.y = p.y - 70;
    }

    ctx.fillStyle='white';
    ctx.fillRect(dialogUI.x,dialogUI.y,100,37);
    ctx.fillStyle='black';
    ctx.fillText(dialogUI.displayedText[0],dialogUI.x+5,dialogUI.y+15)
    ctx.fillText(dialogUI.displayedText[1],dialogUI.x+5,dialogUI.y+26)
  }

  // if no one is interactible, close dialog ui (add any other interactible things here)
  if(!aboutguy.interactible&&!computer.interactible) dialogUI.open=false;
  if(!computer.interactible){
    displayLinksUI = false;
    displayProcessUI = false;
  }

}

function continueDialog(){

  if(dialogDone){
    dialogUI.open = false;
    dialogDone = false;

    if(aboutguy.interactible) aboutguyDialogProgression = (aboutguyDialogProgression+1)%2;
    else computerDialogProgression =0;
  }
  else
  cutDialog();
}


let dialogDone = false;
let maxCharsPerLine = 20;

function cutDialog(){

  let line1 = makeLine();
  let line2 = {t:""};
  if(!line1.stop) line2 = makeLine();

  dialogUI.displayedText=[line1.t,line2.t];
}

function makeLine(){

  let result="";
  let stop=false;
  while(!stop&&result.length+dialogUI.line[0].length<maxCharsPerLine){
    result+=dialogUI.line[0]+" ";
    dialogUI.line.shift();
    if(dialogUI.line.length==0){
      stop=true;
      dialogDone = true;

    }
  }
  return {t:result,stop:stop};
}
