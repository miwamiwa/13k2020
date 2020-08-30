let projectiles = [];

let updateProjectiles=()=>{

  for(let i=projectiles.length-1; i>=0; i--){
    projectiles[i].updateProjectile();
    if(projectiles[i].lifeTimer>50){
      projectiles.splice(i,1);
    //  console.log("projectile ded")
    }
  }
}
