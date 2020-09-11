
let displayStartUI=()=>{

  cRect(0,0,canvas.w,canvas.h,'#aab');
  cFill('black');
  cText("sam's js13k game",50,50);
  cText("pick 'home' in the select tool above to continue last save,",50,65);
  cText("or pick 'new' to start a new game.",50,80);

  cText("CONTROLS",50,120);
  cText("Left: A. Right: D. Down: S. Jump: Space.",50,135);
  cText("Shoot: Click. ",50,150);
  cText("Talk to the home page guy: E.",50,165);
}
