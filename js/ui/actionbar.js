let actionBar = {};
let actionBarFill = 'black';
function setupActionBar(){

  actionBar= {
    x:canvas.x,
    y:canvas.y+canvasElh,
    w: canvasElw,
    h: 50,
  }

    actionBar.el = div(actionBar,actionBarFill);

    actionBar.w=actionBar.w*0.9;
    actionBar.inventory = div(actionBar,'grey');

    actionBar.x+=actionBar.w;
    actionBar.w=actionBar.w*0.1/0.9;
    actionBar.right = div(actionBar,'blue');

}
