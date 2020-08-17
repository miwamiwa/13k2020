let actionBar = {};
function setupActionBar(){

  actionBar= {
    x:canvas.x,
    y:canvas.y+canvas.h,
    w: canvas.w,
    h: 50,
  }

    actionBar.el = div(actionBar,'black');

    actionBar.w=actionBar.w*0.9;
    actionBar.inventory = div(actionBar,'grey');

    actionBar.x+=actionBar.w;
    actionBar.w=actionBar.w*0.1/0.9;
    actionBar.right = div(actionBar,'blue');

}
