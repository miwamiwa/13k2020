const twoPi=2*Math.PI;let aContext,samprate,soundStarted=!1,startSound=()=>{window.AudioContext=window.AudioContext||window.webkitAudioContext,aContext=new AudioContext,samprate=aContext.sampleRate,soundStarted=!0,startBeatMachine()},preloadSound=(e,t,a,s,i)=>{let l=[],n=[],o=samprate*(t.a+t.d+t.r),r=samprate/e,h=flo(r)*a,c=r/twoPi;if(null==i){for(let e=0;e<h;e++)n.push(s(e,c));for(let e=0;e<o;e++)l[e]=.4*t.level(e)*n[e%h]}else for(let e=0;e<o;e++)l[e]=.4*t.level(e)*s(e,c+e*i);return l},playSound=(e,t,a,s,i)=>{let l=new Float32Array(e.length);for(var n=0;n<e.length;n++)l[n]=t*e[n];let o=aContext.createBuffer(1,l.length,samprate);o.copyToChannel(l,0);let r=aContext.createBufferSource();r.buffer=o;let h=aContext.createBiquadFilter();r.connect(h),h.connect(aContext.destination),r.start(0),h.type=a,h.frequency.value=s,h.gain.value=i};class Envelope{constructor(e,t,a,s){this.a=e,this.d=t,this.r=s,this.s=a,this.aS=e*samprate,this.dS=t*samprate,this.rS=s*samprate,this.rT=this.aS+this.dS}level(e){return e<this.aS?e/this.aS:e<this.rT?1-(1-this.s)*(e-this.aS)/this.dS:this.s*(1-(e-this.rT)/this.rS)}}let cash2timeout,ctx,bar=1800,maxbars=16,startBeatMachine=()=>setInterval(newbar,bar),bassnote="0",mel2="HJMOMPOPOJMOP",mel1="POMJHHHJMHH",mel=mel1,beatinput=[{vals:" x x x x",beatval:8,f:playHats,p:!0},{vals:"x x",beatval:16,f:playKick,v:600,p:!0},{vals:"     x",beatval:8,f:playSnare,p:!0},{vals:" 5",beatval:8,f:playWobbleBass,v:2e3,p:!0},{vals:"  ",beatval:8,f:playNoiseySynth,v:0,p:!0},{vals:"  M  K  R  P  M  P",beatval:16,f:playSine,v:0,p:!0},{vals:"  P  P  T  R  P  R",beatval:16,f:playSine,v:0,p:!0},{vals:"  R  T  W  T  R  T",beatval:17,f:playSine,v:0,p:!0}],bars=0,section=0,noteToFreq=e=>13.75*2**((e-9)/12),melCounter=0,melCount2=1,newbar=()=>{bars%4==0&&(wubfact2=100+randInt(200),beatinput[7].beatval=16+randInt(2),beatinput[6].beatval=16+randInt(3)),"home"!=currentLevel&&levelData&&!levelData.cleared?(bars%8==0&&(mel!=mel1?(mel=mel1,beatinput[3].vals=" 5"):(mel=mel2,beatinput[3].vals=" 0"),melCount2=1,melCounter=0),beatinput[4].vals="   "+mel[melCounter]+" "+mel[melCounter],++melCounter>=melCount2&&(melCounter=0,melCount2++),melCount2>=mel.length&&(melCount2=0)):(beatinput[4].vals="",beatinput[3].vals="");for(let e=0;e<beatinput.length;e++)if(beatinput[e].p)for(let t=0;t<beatinput[e].vals.length;t++)"x"==beatinput[e].vals[t]?null!=beatinput[e].v?setTimeout(function(e,t){e(t)},t*bar/beatinput[e].beatval,beatinput[e].f,beatinput[e].v):setTimeout(function(e){e()},t*bar/beatinput[e].beatval,beatinput[e].f):null!=beatinput[e].v&&" "!=beatinput[e].vals[t]&&setTimeout(function(e,t){e(t)},t*bar/beatinput[e].beatval,beatinput[e].f,noteToFreq(beatinput[e].vals.charCodeAt(t)-20));++bars==maxbars&&(bars=0,section++)},sine4counter=0,sine4fact=.1,constSineB=(e,t)=>constrain(Math.round(Math.sin(e/(t+e/100))),0,.1),constSineB2=(e,t)=>constrain(Math.round(Math.sin(e/(t+e/1e3))),0,.1),noisey=(e,t)=>.02*Math.random(),noisey2=(e,t)=>Math.random()*constrain(Math.round(Math.sin(e/(e+t))),0,.13),constSine=(e,t)=>constrain(Math.sin(e/t),-.8,.8),wubfact2=200,constSine2=(e,t)=>constrain(.5*(Math.sin(e/t)+Math.sin(e/(wubfact2+t))),0,.1),constSine3=(e,t)=>constrain(.2*Math.random()*(Math.sin(e/t)+Math.sin(e/(100+t))),0,.1),constSine5=(e,t)=>constrain(.2*Math.random()*(Math.sin(e/t)+Math.sin(e/(1e3+t))),0,.1),constSine4=(e,t)=>constrain(Math.random()*sine4fact+.3*(Math.sin(e/t)+.3*Math.sin(e/(2+t))),0,.1),snarerelease=.3,playSnare=()=>play(10,.02,.01,.4,snarerelease,4,noisey2,5,"highpass",1200,4),playCash=()=>{play(1600,.01,.02,.3,.6,2,constSine2,4,"lowpass",1200,2),clearTimeout(cash2timeout),cash2timeout=setTimeout(function(){play(2400,.01,.02,.3,.6,2,constSine2,4,"lowpass",1800,2)},260)},play=(e,t,a,s,i,l,n,o,r,h,c,p)=>{playSound(preloadSound(e,new Envelope(t,a,s,i),l,n,p),o,r,h,c)},playHats=()=>play(40,.01,.01,.5,.8,40,noisey,14,"highpass",6400,6),constSineZ=(e,t)=>constrain(.1*Math.random()+.8*Math.sin(e/(.2*e+t)),0,.6),playHop=e=>play(e,.01,.11,.3,.31,10,constSine2,8,"highpass",500,2,-.001),playHop2=()=>play(200,.01,.11,.3,.31,200,constSineZ,9,"highshelf",1500,2),wubfactor=250,playWobbleBass=e=>play(e,.05,.51,.8,1.41,4,constSine,3.6,"lowpass",wubfactor,10),playNoiseySynth=e=>{play(e,.01,.11,.3,1.45,50,constSine4,8.5,"lowpass",1500,8),++sine4counter%12==0&&(sine4fact=1-sine4fact)},playHardHat=()=>play(8,.01,.01,.11,.13,1,constSine3,6,"lowshelf",2240,12),playKick=e=>play(e,.01,.11,.3,.35,500,constSineB,16,"lowpass",180,12),playBlaster=(e,t)=>play(e,.01,.11,.3,.25,100,constSineB2,t,"highpass",1080,8),playSine=e=>{if("home"!=currentLevel){let t=.35;levelData&&levelData.cleared&&(t=.8),play(e,.01,.11,.3,t,1,constSine,.7,"highpass",600,1)}},playDamageFX=()=>play(20,.01,.11,.3,.31,60+randInt(20),constSine3,14,"highshelf",1500,2),playThunder=()=>play(15+randInt(85),.3,.61,.3,2.81,20+randInt(50),constSine5,4,"lowpass",300+randInt(2200),2),canvas={},camera={},setupCamera=()=>{camera.target={x:player.x,y:player.y},camera.w=canvas.w2,camera.h=canvas.h2,camera.speed=24},cameraFollow=(e,t)=>{t-=50,reach(camera.target,{x:e,y:t},camera.speed),camera.left=camera.target.x-camera.w,camera.right=camera.target.x+camera.w,camera.top=camera.target.y-camera.h,camera.bottom=camera.target.y+camera.h};const shooterDamage=19,attackDamage=26;let textSpawnerGuy,aboutguy,updateEnemies=()=>{if(!isHome()&&!isStart())for(let e=enemies.length-1;e>=0;e--)enemies[e].update(),enemies[e].limitX(),enemies[e].hitPoints<=0&&(directorylevels.includes(currentLevel)?1==enemies.length?levelData.sections<levelData.difficulty?(levelData.sections++,continueLevel(!0)):level1.cleared||(levelData.cleared=!0,level1.clearLevel(),level1.addSpawner2(),updateFavorites()):level1.cleared&&!level1.cleared2&&generateLoot(enemies[e]):(level1.clearLevel(),levelData.cleared=!0,saveData.bossProgress++,updateFavorites()),poof(enemies[e].x,enemies[e].y,[enemies[e].model.colors[0]]),enemies.splice(e,1))},poof=(e,t,a)=>generateLoot({x:e,y:t},!0,a);class Enemy extends MovingObject{constructor(e,t,a){let s=1.4,i=60;"boss"==a&&(s=3,i=100),super(e,t,i,"#cc30"),this.type=a,this.friction=.4,this.counter=0,this.dashing=!1,this.nextAttack=0,this.attackInterval=25,"boss"==a&&(this.attackInterval=12),this.facing,this.facing="left",this.attackTimeout,this.doneSpawning=!1,"spawner2"==a&&pickNextLinkAward(),this.model="spawner"==a||"spawner2"==a?new CoolPath(0,0,s1data,2):"minispawner"==a?new CoolPath(0,0,s1data,1.3):new CoolPath(0,0,edata,s),"shooter"==a&&(this.model.colors[0]="#8a8f"),"fighter"==a&&(this.model.colors[0]="#88af"),this.spawnInterval=200,this.nextSpawn=0,this.unlockdist=0,this.unlocked=!1,this.spawner2interval=120-30*levelData.difficulty,this.spawner2text="",this.lastp=!1,this.animate(0)}update(){this.counter++;let e=this.display();if(0!=e){0==this.lastp&&(this.lrMaxSpeed=4);let t=distance(player.x,player.y,this.x,this.y);switch(this.type){case"fighter":this.roam(t),this.fight(t);break;case"shooter":this.roam(t),this.shooter(t);break;case"boss":this.roam(t),this.fight(t),this.shooter(t),this.dashing=!0;break;case"minispawner":t.d<20&&this.popspawner();break;case"spawner2":this.updateSpawner2(e)}"spawner2"!=this.type&&(this.model.x=e.x+20,this.model.y=e.y+20,this.model.update(ctx,"left"==this.facing))}else this.lrMaxSpeed=0;this.lastp=e}popspawner(){this.spawnOne(),this.hitPoints=0}updateSpawner2(e){let t,a;this.unlocked&&this.unlockdist<20&&(this.unlockdist+=2),ctx.save(),ctx.strokeStyle="#444",ctx.lineWidth="10",ctx.translate(e.x,e.y),ctx.beginPath(),cRect(0,0,10,-this.unlockdist,"#444"),ctx.arc(30,0-this.unlockdist,25,Math.PI,0),ctx.stroke(),cRect(0,0,60,40,"#88d"),cRect(3,12,54,20,"#bbb");for(let e=0;e<revealedLink.length;e++)a="#444","_"==(t=revealedLink[e])&&(t=String.fromCharCode(48+randInt(74)),a="grey"),cText(t,6*e+4,25,a,12);for(let e=0;e<dataCost;e++)cFill(e<datastrip%dataCost?"#f26":"#444"),cRect(10+7*e,35,4,4);ctx.restore(),this.doneSpawning||this.counter%this.spawner2interval!=0||this.spawnOne()}spawnMore(){this.hitPoints=0;for(let e=0;e<levelData.sections+1;e++)this.spawnOne(e)}spawnOne(e){let t="fighter";levelData.difficulty>1&&(levelData.difficulty>2&&Math.random()>.3?t="shooter":Math.random()>.6&&(t="shooter")),null==e&&(e=0),enemies.push(new Enemy(this.x-50+randInt(50)+50*e,this.y-80,t))}regen(){this.hitPoints<100&&(this.hitPoints+=.2)}shooter(e){this.canAttack(200,100,e)&&(playBlaster(800,1),this.shoot(player.screenPos.x,player.screenPos.y,10,!0),this.attackAndCool()),this.regen()}canAttack(e,t,a){return this.nextAttack<this.counter&&a.d<e&&player.y>this.y-t&&player.y<this.y+t}attackAndCool(){this.animate(1),this.nextAttack=this.counter+this.attackInterval,this.attackTimeout=setTimeout(function(e){e.animate(0)},400,this)}fight(e){this.canAttack(30,50,e)&&(damagePlayer(attackDamage),player.impactForce.x+=Math.min(Math.max(this.x-player.x,-e),e),this.attackAndCool()),this.regen()}dash(){this.dashing=!0,this.lrMaxSpeed=9,this.animate(1),setTimeout(function(e){e.lrMaxSpeed=4,e.animate(0)},3e3,this),setTimeout(function(e){e.dashing=!1},3500,this)}roam(e){this.counter%50==0&&(player.x<this.x?this.goLeft():this.goRight(),player.y<this.y&&e.d<150&&this.jump(),!this.dashing&&e.d<260&&this.dash())}animate(e){clearTimeout(this.attackTimeout),this.model.selectAnimation(e)}}let agTalkTimeout,player,playerMoving,fuelregen,amnoregen,createFriendlyNPCs=()=>{let e=level1.platforms[level1.platforms.length-1];aboutguy=new MovingObject(e.x+150,e.y-30,20,nocolor)},lastaboutstate=!1,aboutguytalking=!1,runFriendlyNPCs=()=>{aboutguy.display(),enableInteraction(aboutguy,"press E",80),0!=aboutguy.screenPos&&(aboutModel.x=aboutguy.screenPos.x+8,aboutModel.y=aboutguy.screenPos.y-4,aboutModel.update(ctx,!1),!dUI.open&&lastaboutstate?aboutguytalking=!1:dUI.open&&!lastaboutstate&&(aboutguytalking=!0,aboutGuyTalk())),lastaboutstate=dUI.open},agTalkCounter=8,aboutGuyTalk=()=>{let e=60+randInt(140),t=void 0,a=1200,s=400+randInt(50);Math.random()<.8&&(t=-1e-4*randInt(50),a=200),Math.random()<.8&&play(s,.01*randInt(3),.11,.3,e/1100,10,constSine3,4,"highpass",a,3,t),agTalkCounter--,aboutguytalking&&agTalkCounter>0?(aboutModel.fullRig.selectAnimation(1),agTalkTimeout=setTimeout(aboutGuyTalk,e)):aboutModel.fullRig.selectAnimation(0)},enableInteraction=(e,t,a)=>{if(0!=e.screenPos){if(distance(player.x,player.y,e.x,e.y).d<a){e.interactible=!0;let a=e.screenPos;ctx.fillText(t,a.x+25,a.y-40,"black",10)}else e.interactible=!1}else e.interactible=!1},createPlayer=()=>{let e=level1.platforms[level1.platforms.length-1];isHome()?e=level1.platforms[0]:e.x-=130,(player=new MovingObject(e.x,e.y-100,50,"#2a20")).initJumpForce=40,player.facing="left",player.jetFuel=100,player.gunPower=100,setupCamera(),player.display()},lastPlayerMovingState=!1,playerJumping=!1,fuelcost=7,shotcost=38,mcounter=0,wcounter=0,dY=0,updatePlayer=()=>{if(player.limitX(),player.hitPoints<40?(player.lrMaxSpeed=7,player.initJumpForce=29):(player.lrMaxSpeed=12,player.initJumpForce=40),player.jetpacks&&player.jumpForce<10?player.jetFuel>=fuelcost?(player.jetFuel-=fuelcost,player.jumpForce=10):(cantjetpack=!0,setTimeout(function(){cantjetpack=!1},500),player.jetpacks=!1):player.jumpForce>0?player.jumpForce-=4:player.jumpForce=0,player.display(),playerMoving=!1,(player.movingLeft||player.movingRight)&&(playerMoving=!0),dY=0,playerMoving&&0==player.jumpForce&&0==player.fallSpeed){let e=Math.cos(mcounter);dY=2+e*e*7,mcounter+=.2*Math.PI,wcounter++}(playerMoving||wcounter%5!=0)&&++wcounter%5==0&&0==player.jumpForce&&0==player.fallSpeed&&playHop2(),playerModel.x=player.screenPos.x+20,playerModel.y=player.screenPos.y+14-dY,(player.jumpForce>0||player.fallSpeed>0)&&!playerJumping?(playerJumping=!0,playerModel.fullRig.selectAnimation(5)):0==player.jumpForce&&0==player.fallSpeed&&playerJumping?(playerJumping=!1,resetPlayerAnimation()):playerMoving&&!lastPlayerMovingState?resetPlayerAnimation():!playerMoving&&lastPlayerMovingState&&(resetPlayerAnimation(),playHop2()),lastPlayerMovingState=playerMoving,playerModel.update(ctx,"left"==player.facing),player.hitPoints<100&&(player.hitPoints+=.1),player.hitPoints<=0&&(loadHomeLevel(),fade(60,"ouchies")),amnoregen=awarded("r3")?3:2,player.gunPower=Math.min(player.gunPower+amnoregen,100),fuelregen=awarded("r2")?3:2,cantjetpack||(player.jetFuel=Math.min(player.jetFuel+fuelregen,100))},resetPlayerAnimation=()=>{player.jumpForce>0||player.fallSpeed>0?playerModel.fullRig.selectAnimation(4):playerMoving?playerModel.fullRig.selectAnimation(2):playerModel.fullRig.selectAnimation(0)},damagePlayer=e=>{e+=4*levelData.difficulty,awarded("r4")&&(e*=.6),player.hitPoints-=e,playDamageFX(),playerModel.selectAnimation(4),setTimeout(function(){resetPlayerAnimation()},400)},texts=["Hmm? # Oh! You must be from the cleaning service. # Thank goodness you're here. # Our web page is being attacked by a mysterious virus! # Our pages have been replaced by fake 404s full of monsters. # Yuck! It's revolting! Here, let me add our directory to your favorites.","what's up ","hey","dope","wee! you cleared a page, good job. see how it was added to your favorites. here's a boost for your amno. now go clean more!","","that's 4 pages! nice job dude. here's a boost for your gun damage","that's 6 pages! nice job dude. here's a boost for your jetfuel","almost there guy! go to those boss files and rek whatever creature you might find!","wow you killed a boss dude heres a boost to your health","wow thats the second and last boss gj dude u done","thanks for playing sam thanks you","haha yaa go champ","you want a tip # ... # no tip","sup"],dUI={open:!1,t:0,counter:0,line:[],lineI:0,displayedText:""},dialogDone=!1,maxCharsPerLine=20,runDialog=()=>{if(dUI.open){if(0!=dUI.t){let e=getScreenPos({x:dUI.t.x,y:dUI.t.y,w2:50,h2:50});dUI.x=e.x-50,dUI.y=e.y-110}cFill("white"),cRect(dUI.x,dUI.y,250,50),cFill("black"),cFont(20),cText(dUI.displayedText[0],dUI.x+5,dUI.y+20),cText(dUI.displayedText[1],dUI.x+5,dUI.y+40)}aboutguy.interactible||(dUI.open=!1)},continueDialog=()=>{if(dialogDone){dUI.open=!1,dialogDone=!1;let e=saveData.gameProgress;if(0==saveData.textProgress){for(let e=0;e<2;e++)newLevel(allLinkNames[e]);updateFavorites(),e.push("start")}}else cutDialog()},cutDialog=()=>{let e=makeLine(),t={t:""};e.stop||(t=makeLine()),dUI.displayedText=[e.t,t.t]},makeLine=()=>{let e="",t=!1,a=!1;for(;!t&&!a&&e.length+dUI.line[0].length<maxCharsPerLine;)"#"==dUI.line[0]?a=!0:e+=dUI.line[0]+" ",dUI.line.shift(),0==dUI.line.length&&(t=!0,dialogDone=!0);return{t:e,stop:t}},actionButton=()=>{isHome()&&aboutguy.interactible&&(dUI.open?continueDialog():(dUI.open=!0,dUI.t=aboutguy,pickDialog(),dUI.line=texts[saveData.textProgress].split(" "),cutDialog()),agTalkCounter=6+randInt(9),clearTimeout(agTalkTimeout),aboutGuyTalk())},pickDialog=()=>{let e=saveData.gameProgress,t=saveData.directoryProgress,a=saveData.bossProgress,s=!1,i=0;awarded("start")&&(0==a&&0==a?i=1+randInt(3):a>0&&(awarded("r4")?a>1?i=10:1==a?s=!0:i=11:(e.push("r4"),i=9)),(t>0&&0==a||s)&&(1!=t||awarded("r3")?t>3&&!awarded("r1")?(e.push("r1"),i=6):t>5&&!awarded("r2")?(e.push("r2"),i=7):i=7==t?8:12+randInt(3):(e.push("r3"),i=4))),saveData.textProgress=i},awarded=e=>saveData.gameProgress.includes(e),cantGoDown=!1,cantjetpack=!1,jetkeypressed=!1,keypress=()=>{if(!tFormSelected)switch(event.keyCode){case 65:player.goLeft();break;case 68:player.goRight();break;case 32:jetkeypressed||(jetkeypressed=!0,!player.jetpacks&&player.jumpForce<8&&player.fallSpeed<4&&(playHop(300),player.jump()),cantjetpack||(player.jetpacks=!0));break;case 83:player.y<killLine&&!cantGoDown&&player.y++;break;case 69:actionButton();break;case 27:dUI.open=!1}},keyrelease=()=>{if(!tFormSelected)switch(event.keyCode){case 65:player.movingLeft=!1;break;case 68:player.movingRight=!1;break;case 32:player.jetpacks=!1,jetkeypressed=!1}},mouseIsPressed=!1,mouseX=0,mouseY=0,cantShoot=!1,mousePressed=()=>{soundStarted||startSound(),mouseIsPressed=!0,mouseX=event.clientX-canvas.x,mouseY=event.clientY-canvas.y,!isStart()&&!cantShoot&&player.gunPower>=shotcost&&(player.gunPower-=shotcost,playBlaster(1800,3),player.shoot(mouseX,mouseY,25,!1),player.movingRight||player.movingLeft?playerModel.selectAnimation(3):playerModel.selectAnimation(1),cantShoot=!0,setTimeout(function(){resetPlayerAnimation(),cantShoot=!1},250))},mouseReleased=()=>mouseIsPressed=!1,datastrip=0,addLoot=()=>{textSpawnerGuy.doneSpawning||(updateInv(++datastrip),playCash(),datastrip>dataCost&&(datastrip-=dataCost,processDataStrips(),updateInv(datastrip)))},updateInv=e=>{textSpawnerGuy.spawner2text=revealedLink},items=[],generateLoot=(e,t,a)=>{let s=5+randInt(15),i="gold";for(let l=0;l<s;l++){null!=a&&(i=a[randInt(a.length)]),null!=t?items.push(new Item(e.x,e.y-50,8,i,!0)):items.push(new Item(e.x,e.y-50,10,i));let s=items[items.length-1];s.impactForce.x=6+randInt(12),Math.random()>.5&&(s.impactForce.x*=-1),s.initJumpForce=11,s.jump()}},updateItems=()=>{for(let e=items.length-1;e>=0;e--)items[e].update(),(items[e].looted||items[e].poofy&&items[e].pfact>20)&&items.splice(e,1)};class Item extends MovingObject{constructor(e,t,a,s,i){super(e,t,a,s),this.size=a,this.looted=!1,this.v=1,null!=i&&(this.poofy=!0,this.pfact=0)}update(){if(this.poofy)this.pfact++;else if(!this.looted){let e=distance(this.x,this.y,player.x,player.y);if(e.d<10)this.looted=!0,addLoot();else{this.v++;let t=this.v/e.d;this.x+=t*e.adj,this.y+=t*e.opp,this.fallSpeed=0}}let e=this.display();0!=e&&cRect(e.x,e.y,this.size,this.size,this.fill)}}let lastp,ns1=58,ns2=93;class CoolPath{constructor(e,t,a,s){this.x=e,this.y=t,this.cmess,this.scale=1.5,null!=s&&(this.scale*=s),this.colors=[];for(let e=0;e<a.c.length;e++)this.colors[e]=a.c[e];this.model=a.m,this.rig=a.r,this.animations=a.a;for(let e=0;e<this.rig.length;e++)this.rig[e].isRoot&&(this.fullRig=new RigShape(e,this.scale,this.model,this.rig,this.animations,this.colors));this.selectAnimation(1),this.counter=0}selectAnimation(e){this.pose=e,this.fullRig.selectAnimation(e)}update(e,t){this.fullRig.updateRotationValues(),ctx.translate(this.x,this.y),t&&ctx.scale(-1,1),this.fullRig.display(ctx),ctx.resetTransform(),this.counter++,this.counter>this.animations[this.pose].animLength&&(this.counter=0)}}class RigShape{constructor(e,t,a,s,i,l){this.colors=l,this.rig=s,this.animations=i,this.sIndex=e,this.origin={x:s[e].origin.x*t,y:s[e].origin.y*t},this.rotation=0,this.paths=[],this.counter=0;for(let s=0;s<a.length;s++)if(a[s].shape==e){let e=a[s].origin,i=e.x*t,l=e.y*t,n=`M ${i} ${l} `,o=a[s].segments;for(let e=0;e<o.length;e++){n+=o[e].type+" ";let a=o[e].points;for(let e=0;e<a.length;e++)n+=`${i=a[e].x*t} ${l=a[e].y*t} `}this.paths.push({path:new Path2D(n),stroke:a[s].stroke,fill:a[s].fill})}this.pins=[];for(let n=0;n<s[e].pins.length;n++){let o=s[e].pins[n];this.pins.push({shape:new RigShape(o.shape,t,a,s,i,l),x:o.x*t,y:o.y*t})}}selectAnimation(e){this.pose=e;for(let t=0;t<this.pins.length;t++)this.pins[t].shape.selectAnimation(e)}updateRotationValues(){0==this.counter?this.rotation=this.animations[this.pose].initVals[this.sIndex]:this.rotation=this.getRotFromTimeStamps();for(let e=0;e<this.pins.length;e++)this.pins[e].shape.updateRotationValues();this.counter++,this.counter>this.animations[this.pose].animLength&&(this.counter=0)}display(e){e.save(),e.rotate(rad(this.rotation)),e.translate(-this.origin.x,-this.origin.y);for(let t=0;t<this.paths.length;t++)e.strokeStyle=this.colors[this.paths[t].stroke],e.lineWidth="2",e.stroke(this.paths[t].path);for(let t=0;t<this.pins.length;t++)e.save(),e.translate(this.pins[t].x,this.pins[t].y),this.pins[t].shape.display(e),e.restore();e.restore()}getRotFromTimeStamps(){let e=this.animations[this.pose],t=e.timeStamps[this.sIndex];if(t.length>0){for(let a=0;a<t.length;a++)if(this.counter<=t[a].time){setlast(0,0);let s=t[a-1];return a>0?setlast(s.time,s.rot):setlast(0,e.initVals[this.sIndex]),this.lerprot(t[a].time,t[a].rot)}let a=last(t);return setlast(a.time,a.rot),this.lerprot(e.animLength,e.initVals[this.sIndex])}return this.animations[this.pose].initVals[this.sIndex]}lerprot(e,t){return lastp.r+(this.counter-lastp.t)/(e-lastp.t)*(t-lastp.r)}}let riglength,playerModel,monsterModel,aboutModel,setlast=(e,t)=>lastp={t:e,r:t},cmess="",segments=[],newSeg=(e,t,a)=>segments.push({type:e,points:[{x:toNum(t,a),y:toNum(t+1,a)}]}),toNum=(e,t)=>cmess.charCodeAt(e)-t,isns1=(e,t)=>e.charCodeAt(t)<ns2,toAngle=e=>180*toNum(e,ns2)/30,unpackModelMessage=e=>{let t=e.split("*"),a=[];segments=[];for(let e=0;e<t.length;e++){cmess=t[e],segments=[];for(let a=5;a<t[e].length;a+=2)if(toNum(a,0)<ns2)newSeg("L",a,ns1);else{let e=segments.length-1;if(e>=0){let t=segments[e],s=t.points;"L"==t.type?newSeg("C",a,ns2):s.length<3?s.push({x:toNum(a,ns2),y:toNum(a+1,ns2)}):newSeg("C",a,ns2)}else newSeg("C",a,ns2)}let s=toNum(2,ns1);s>99&&(s/=100),a.push({shape:toNum(0,ns1),fill:toNum(1,ns1),stroke:s,origin:{x:toNum(3,ns1),y:toNum(4,ns1)},segments:segments})}return a},unpackRigMessage=e=>{let t=[],a=e;cmess=a;let s=0;for(let e=0;e<a.length;e++){let i=t[t.length-1];if(0==s)t.push({origin:{x:toNum(e,ns1)},pins:[],isRoot:!1});else if(1==s)i.origin.y=toNum(e,ns1);else if(s>2){let t=i.pins[i.pins.length-1];s%3==0?i.pins.push({x:toNum(e,ns2)}):s%3==1?i.pins[i.pins.length-1].y=toNum(e,ns2):t.shape=toNum(e,ns2)}else 2==s&&"1"==a[e]&&(i.isRoot=!0);++s>2&&isns1(a,e+1)&&(s=0)}return riglength=t.length,t},unpackAnimation=e=>{let t=[];cmess=e;let a=e,s=!1,i=0;for(;!s;){let e=a.indexOf("*",i+1),l={name:a.substring(i+1,e)};l.animLength=toNum(e+1,ns1);let n=e+1+riglength;l.initVals=[],l.timeStamps=[];for(let t=e+2;t<n+1;t++)l.initVals.push(toAngle(t));i=n+1;for(let e=0;e<riglength;e++){l.timeStamps.push([]);let e=a.indexOf("*",i+1);-1==e&&(e=a.length,s=!0);let t=0;for(let a=i+1;a<e;a++){let e=l.timeStamps[l.timeStamps.length-1];t%2==0?e.push({rot:toAngle(a)}):e[e.length-1].time=toNum(a,ns1),t++}i=e}t.push(l)}return t},nocolor="#0000",edata={m:unpackModelMessage(":;:HVDOhgkaskooniqikklinf*;;:AETMQOQL*<;:AGOMOKML*=;:FAHJEOIP*>;:FAHJEOIP"),r:unpackRigMessage("GQ1im^in_jx`kxaAE0AG0FA0FA0"),a:unpackAnimation("*run*F^]]hQ*\\@*[@*[@*R@*j@*eat*F]]]iS*W<\\@*X<]@TB*c<]@eB*Q@*j@*fall*PbZ^QP*_C*YC*ZC*QC*TC"),c:["#eccf",nocolor]},abdata={m:unpackModelMessage(":;:GRKPCI*;;:LAJEJIHI*<;:LAJEJIHI*=;:AOLK*>;:BBMI*?;:OHBDechdghidkeji*@;:BEOI"),r:unpackRigMessage("GR1ku^iu_fl`LA0LA0AO0onaMI0eebeecBD0BD0"),a:unpackAnimation("*still*PVcgd]WX*[D*]D*dD*YD*eD*QD*YD*talk*FZadcZXX*XC*aC*fC*a>c@eC*]>Z@\\C*R>W@SC*\\>W@[C"),c:["#ada",nocolor]},s1data={m:unpackModelMessage(":;:SDH<>CHKSDSPHX>P>JHRSKNNNGC?M@CGCT>P>C*;;:HDHL*<;:KJFE*<;<GDibbhhi*<;<LItmosmn"),r:unpackRigMessage("HL0HE1ki]kg_HH0"),a:unpackAnimation("*ya*J]]]*[D**yB*"),c:["#dcd",nocolor,"rgba(174,44,0,1.0)"]},pdata={m:unpackModelMessage(":;ŦBALDnjijlfhifhhe*;;<FGJH*<;<FHJI*:;>GJfoblfe*=;>GOFJGB*>;>EFH@*?;ĂEFGM*@;>EFH@*A;ĂEFGM*B;ĂHEJLIOMO*C;ĂHEJLIOMO*D;ŦFNJLHNHKNS"),r:unpackRigMessage("DH0ij^ik_FG0FH0FJ1kc]geamfchpekpfH@0hibEF0H@0hidEF0jpgHE0HE0GM0"),a:unpackAnimation("*still*PZ]]]X]XS]]W*]E*YH*^H**ZE*YE*ZE*****shoot*B]]]]a[N_]]`*_<*W>*`>*[<*j<*]<*N<*[<*e<*`<*V<*run*D\\]]]e]TPhW_*Y?***^?*O?*T?*e?*`?*T?*i?*R?*runshot*D]]]]h]LdiU]****Y?*N?**P?*S?*W?*m?**gethit*JS]]bd^mdmH]*I=*W=*b=**M=*Y=*@=WA*U=JA*p=MA*a=_A**jump*V]]]`_a`V[Z]*[?***c?*M?*W?*G?**M?*L?*\\?"),c:["rgba(0,0,0,1.0)",nocolor,"rgba(249,79,0,1.0)","rgba(138,131,248,1.0)","rgba(247,185,0,1.0)"]},loadModelData=()=>{(playerModel=new CoolPath(0,0,pdata,1.5)).selectAnimation(1),(aboutModel=new CoolPath(0,0,abdata,2)).selectAnimation(0)};class MovingObject extends DisplayObject{constructor(e,t,a,s){super(e,t,a,a),this.fill=s,this.hasGravity=!0,this.fallAcc=2,this.lrMaxSpeed=12,this.lrAcc=1,this.initJumpForce=25,this.friction=2,this.movingLeft=!1,this.movingRight=!1,this.jumpForce=0,this.jumpDecel=2.2,this.fallSpeed=0,this.lrSpeed=0,this.impactForce={x:0,y:0},this.hitPoints=100,this.jetpacks=!1}goLeft(){this.movingRight=!1,this.movingLeft=!0,this.facing="left"}goRight(){this.movingRight=!0,this.movingLeft=!1,this.facing="right"}display(){this.moveLeftRight(),this.applyPhysics();let e=this.position();return this.hitPoints<100&&this.displayHealthBar(),e}displayHealthBar(){progressBar(this.screenPos.x,this.screenPos.y-35,30,10,this.hitPoints,"red","white")}jump(){this.jumpForce=this.initJumpForce}moveLeftRight(){this.movingLeft&&!this.movingRight?(this.lrSpeed-=this.lrAcc,this.lrSpeed=Math.max(this.lrSpeed,-this.lrMaxSpeed)):this.movingRight&&!this.movingLeft?(this.lrSpeed+=this.lrAcc,this.lrSpeed=Math.min(this.lrSpeed,this.lrMaxSpeed)):this.lrSpeed+this.friction<0?this.lrSpeed+=this.friction:this.lrSpeed-this.friction>0?this.lrSpeed-=this.friction:this.lrSpeed=0,this.impactForce.x-1>0?this.impactForce.x--:this.impactForce.x+1<0?this.impactForce.x++:this.impactForce.x=0,this.x+=this.lrSpeed+this.impactForce.x}applyPhysics(){this.updateFallSpeed(),this.jumpForce-this.jumpDecel>0?this.jumpForce-=this.jumpDecel:this.jumpForce=0,this.jetpacks&&(this.fallSpeed=0),this.y+=this.fallSpeed-this.jumpForce}updateFallSpeed(){let e=level1.platforms,t=killLine;for(let a=0;a<e.length;a++)this.x>e[a].x-e[a].w2&&this.x<e[a].x+e[a].w2&&e[a].y>=this.y+this.h/2&&e[a].y<t&&(t=e[a].y);this.y+this.h/2+this.fallSpeed<t?this.fallSpeed+=this.fallAcc:(this.y=t-this.h/2,this.impactForce.y=this.fallSpeed,this.fallSpeed=0)}}class DisplayObject{constructor(e,t,a,s){this.x=e,this.y=t,this.w=a,this.h=s,this.w2=this.w/2,this.h2=this.h/2}position(){return checkCollision(getBounds(this),camera)?this.screenPos=getScreenPos(this):this.screenPos=!1,this.screenPos}limitX(){this.x=Math.min(Math.max(this.x,-sceneW/2),sceneW/2)}shoot(e,t,a,s){e<this.screenPos.x?this.facing="left":this.facing="right",projectiles.push(new Projectile(this.x,this.y,6,"green",a,e,t,s))}}class Projectile extends MovingObject{constructor(e,t,a,s,i,l,n,o){super(e,t,a,s),this.hitsplayer=o,this.destroyed=!1,this.y-=20;let r=this.position(),h=distance(r.x,r.y,l,n),c=i/h.d;this.speedVect={y:c*h.opp,x:c*h.adj},this.hasGravity=!1,this.lifeTimer=0}updateProjectile(){if(this.lifeTimer++,this.destroyed){let e=this.display();0!=e&&cRect(e.x,e.y,this.size,this.size,"white")}else{this.x+=this.speedVect.x,this.y+=this.speedVect.y;let e=this.position();if(0!=e){this.hitsplayer?(this.fs("#b66f",10),checkCollision(getBounds(this),getBounds(player))&&(this.stopProjectile(),this.bump(player,15),poof(player.x,player.y,["orange"]),playDamageFX(),damagePlayer(shooterDamage))):(this.checkForCollisions(level1.platforms,!1),this.checkForCollisions(enemies,32),saveData.gameProgress.includes("r1")?this.fs("#bb1",10):this.fs(this.fill,4)),this.checkWallCollisions();let t=this.lifeTimer%6;cRect(e.x-t,e.y-t,this.size+2*t,this.size+2*t),cRect(e.x,e.y,this.size,this.size,"white")}}}fs(e,t){cFill(e),this.size=t}checkWallCollisions(){(this.x<-sceneW/2||this.x>sceneW/2)&&this.stopProjectile()}checkForCollisions(e,t){for(let a=0;a<e.length;a++)checkCollision(getBounds(e[a]),getBounds(this))&&(this.stopProjectile(),0!=t&&(awarded("r1")&&(t*=2),t-=2*(levelData.difficulty-1),"spawner"==e[a].type?e[a].spawnMore():"minispawner"==e[a].type?e[a].hitPoints=0:"boss"==e[a].type?e[a].hitPoints-=t/6:"spawner2"!=e[a].type&&(this.bump(e[a],3),e[a].hitPoints-=t),playBlaster(200,6)))}bump(e,t){e.impactForce.x+=Math.min(Math.max(e.x-this.x,-t),t)}stopProjectile(){this.speedVect.x=0,this.speedVect.y=0,this.destroyed=!0}}let projectiles=[],updateProjectiles=()=>{for(let e=projectiles.length-1;e>=0;e--)projectiles[e].updateProjectile(),projectiles[e].lifeTimer>50&&projectiles.splice(e,1)},saveData=null,loadSave=()=>{null==(saveData=JSON.parse(localStorage.getItem(saveDataHeader)))&&newGameSave()},newGameSave=()=>{saveData={levels:[],textProgress:0,directoryProgress:0,bossProgress:0,gameProgress:[],lvlCount:0}};window.onbeforeunload=saveGame;let canvasElw,canvasElh,addbar,textform,listform,levelData,blingInt,fav,level1,saveDataHeader="sams404gameforjs13kof2020",saveGame=()=>localStorage.setItem(saveDataHeader,JSON.stringify(saveData)),createCanvas=()=>{canvas.w=800,canvas.h=600,canvas.w2=canvas.w/2,canvas.h2=canvas.h/2,canvas.c=document.createElement("canvas"),canvas.c.setAttribute("width",canvas.w),canvas.c.setAttribute("height",canvas.h),(ctx=canvas.c.getContext("2d")).filter="contrast(1.5) drop-shadow(1px 1px 2px #000)"},seedL=100,maxchar=100,charStart=128,ncount=0,random=()=>{let e=noiz(flo(ncount+=.7),currentLevel);return ncount%1*(noiz(Math.ceil(ncount),currentLevel)-e)+e},noiz=(e,t)=>(levelData.seedData.charCodeAt(e%seedL)-charStart)/maxchar,setupRandomSeed=e=>{let t="";for(let e=0;e<seedL;e++)t+=String.fromCharCode(charStart+randInt(maxchar));return t},constrain=(e,t,a)=>Math.min(Math.max(e,t),a),checkCollision=(e,t)=>oneDintercept(e.left,e.right,t.left,t.right)&&oneDintercept(e.top,e.bottom,t.top,t.bottom),oneDintercept=(e,t,a,s)=>t>=a&&t<=s||e>=a&&e<=s||e<=a&&t>=s,getScreenPos=e=>({x:canvas.w2+e.x-camera.target.x-e.w2,y:canvas.h2+e.y-camera.target.y-e.h2}),progressBar=(e,t,a,s,i,l,n)=>{cFill(n),cRect(e,t,a,s),cFill(l),cRect(e,t,a*i/100,s)},distance=(e,t,a,s)=>{let i=a-e,l=s-t;return{d:Math.sqrt(i*i+l*l),adj:i,opp:l}},getBounds=e=>({left:e.x-e.w2,right:e.x+e.w2,top:e.y-e.h2,bottom:e.y+e.h2}),isHome=()=>"home"==currentLevel,isStart=()=>"start"==currentLevel,div=(e,t)=>{let a=document.createElement("div");return document.body.appendChild(a),null!=e&&setStyle(a,e,t),a},setStyle=(e,t,a)=>e.setAttribute("style",`position:fixed; left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;background-color:${a};`),rad=e=>e*Math.PI/180,l=e=>e.length,randInt=e=>flo(Math.random()*e),flo=e=>Math.floor(e),reach=(e,t,a)=>{let s=!1,i=!1;return e.x+a<t.x?e.x+=a:e.x-a>t.x?e.x-=a:(e.x=t.x,s=!0),e.y+a<t.y?e.y+=a:e.y-a>t.y?e.y-=a:(e.y=t.y,i=!0),!(!s||!i)},last=e=>e[e.length-1],isLevel=e=>{let t=saveData.levels;for(let a=0;a<t.length;a++)if(t[a].name==e)return a;return-1},pointTo=e=>document.getElementById(e),cFill=e=>{ctx.fillStyle=e},cText=(e,t,a,s,i)=>{s&&cFill(s),i&&cFont(i),ctx.fillText(e,t,a)},cFont=e=>{ctx.font=e+"px Courier New"},cRect=(e,t,a,s,i)=>{i&&cFill(i),ctx.fillRect(e,t,a,s)},waittime=5,runFadeIn=()=>{let e=1;fadeIn>waittime&&(e=1-(fadeIn-waittime)/30),e>0&&(cRect(0,0,canvas.w,canvas.h,"rgba(0,0,0,"+e+")"),cText(fadetxt,canvas.w/2-30,canvas.h/2-2,"white",20)),fadeIn++},fadetxt="",fade=(e,t)=>{fadeIn=0,waittime=e,fadetxt=null!=t?t:""},addressbar=()=>{let e=(addbar=div()).style;e.width=canvas.w+"px",e.backgroundColor="#768",e.display="flex",e.flexDirection="row",e.justifyContent="space-around",updateFavorites(),document.body.appendChild(canvas.c);let t=canvas.c.getBoundingClientRect();canvas.x=Math.round(t.x),canvas.y=Math.round(t.y)},setupLevel=()=>{let e=isLevel(currentLevel);-1!=e?levelData=saveData.levels[e]:(newLevel(),levelData=last(saveData.levels))},newLevel=e=>{blingFavorites(),saveData.lvlCount++,null==e&&(e=currentlevel),saveData.levels.push({name:e,seedData:setupRandomSeed(),difficulty:1+flo(saveData.lvlCount/3),cleared:!1,cleared2:!1,sections:0})},saveLevelData=()=>{if(!isHome()&&!isStart()){let e=isLevel(currentLevel);saveData.levels[e].cleared=levelData.cleared,saveData.levels[e].cleared2=levelData.cleared2,saveData.levels[e].sections=levelData.sections}},goToLink=()=>{let e=listform.value;return"home"==e?(loadHomeLevel(),void updateFavorites()):isStart()&&"new"==e?(newGameSave(),loadHomeLevel(),void updateFavorites()):void(0!=saveData.levels.length&&(null!=levelData&&saveLevelData(),currentLevel=e.substring(0,e.indexOf(" ")),fade(24),setupLevel(),createLevel(),createPlayer()))},loadHomeLevel=()=>{currentLevel="home",createLevel(),createPlayer(),fade(8)},directorylevels=["submit","entries","partners","experts","prizes","rules","blog"],allLinkNames=["submit","blog","entries","evilbot","partners","experts","prizes","rules","invaderz"],nextLink="",revealedLink="",revealedChars=0,dataCost=6,processDataStrips=()=>{let e=revealedLink.length,t=randInt(e);for(;"_"!=revealedLink[t];)t=randInt(e);revealedLink=t<nextLink.length-1?rSub(0,t)+nextLink[t]+rSub(t+1,e):rSub(0,t)+nextLink[t],++revealedChars==e&&(newLevel(nextLink),enemies[0].unlocked=!0,level1.clearLevel2(),levelData.cleared2=!0,saveData.directoryProgress++,textSpawnerGuy.doneSpawning=!0,updateFavorites())},rSub=(e,t)=>revealedLink.substring(e,t),pickNextLinkAward=()=>{nextLink=allLinkNames[saveData.lvlCount],revealedLink="",revealedChars=0;for(let e=0;e<nextLink.length;e++)revealedLink+="_"},startTxt=["sam's js13k","2020 game","pick 'home'","to continue","or pick 'new'","to start a new game.","then press go!!","CONTROLS","Left: A. Right: D. Down: S.","Jump: Space.","Shoot: Click. ","Talk to the home page guy: E."],sCol=["#eee","#88b","#ec1","#e32","#6a7"],scI=[0,0,1,1,2,2,3,4,4,4,4,4],sframe=0,displayStartUI=()=>{if(sframe%30==0){cRect(0,0,canvas.w,canvas.h,"#333");let e,t,a,s,i=0;for(t=0;t<startTxt.length;t++){for(s=3+randInt(4),e=50-5*t,a=0;a<s;a++)cText(startTxt[t],50-a,100+i-a,sCol[scI[t]],90-6*t);i+=.7*(90-6*t)}}sframe++},tFormSelected=!1,haClass='class="hov abel"',aClass="class='abel'",updateFavorites=()=>{eType="option";let e=saveData.levels,t="favorites",a=el("home");if(isStart())a+=el("new");else for(let t=0;t<e.length;t++)a+=el(`${e[t].name} difficulty: ${e[t].difficulty}`);eType="span",addbar.innerHTML=el(el("<",haClass)+el(">",haClass))+el(`www.js13kgames.com/${currentLevel}`,aClass)+el(`${t}:<select id="${t}" style='cursor:pointer;'> ${a} </select>`+el("go",haClass+" onclick='goToLink()'"),aClass+" id='favs'"),listform=pointTo(t),fav=pointTo("favs"),saveGame()},eType="option",el=(e,t)=>(null==t&&(t=""),`<${eType} ${t}>${e}</${eType}>`),favBling=0,blinging=!1,blingFavorites=()=>{blinging||(blinging=!0,playCash(),blingInt=setInterval(function(){fav=pointTo("favs"),favBG(favBling%2==0?"blue":"white"),favBling++},400),setTimeout(function(){favBG("white"),clearInterval(blingInt),blinging=!1},5e3))},favBG=e=>fav.style.backgroundColor=e,killLine=500,sceneW=0,fadeIn=0,enemies=[],enemyDifficulty=1,lvlDiffIncreaseInterval=3,maxEnemyDifficulty=4,bgurl="js/characters/enemyclass.js",basicLevel=e=>{sceneW=canvas.w,level1=new Level([[50,killLine-100,100],[-60,killLine-60,100],[0,killLine,canvas.w]],sceneW,100,e)},continueLevel=e=>{let t=[[0,killLine+=500,1.02*sceneW]],a=flo(5+3*random()),s=flo(1+3*random());for(let i=0;i<s;i++){let l=-s/3*canvas.w+i*sceneW/s+155,n=killLine;for(let s=0;s<a-i;s++){let o=80;n-=60,s==a-i-1&&(o=280,e&&enemies.push(new Enemy(l,n-80,"spawner"))),t.push([l,n,o+80*random()]),l+=120*random()-60}}for(let a=0;a<t.length;a++){let s=level1.getplatformtext(t[a][2]);level1.platforms.push(new Platform(t[a][0],t[a][1],t[a][2],s)),e&&Math.random()>.63&&enemies.push(new Enemy(t[a][0],t[a][1]-80,"minispawner"))}if(e)for(let e=0;e<1+2*levelData.difficulty;e++)enemies.push(new Enemy(-300+randInt(600),t[0][1]-80,"minispawner"));level1.moreClouds(2)},createLevel=()=>{if(enemies=[],items=[],killLine=500,ncount=0,dUI.open=!1,isHome())basicLevel(),createFriendlyNPCs();else if(directorylevels.includes(currentLevel)){sceneW=2*canvas.w;let e=(level1=new Level([[0,killLine,1.02*sceneW]],sceneW,400,!0)).platforms[0],t=levelData.sections;if(levelData.cleared&&level1.clearLevel(),0==t)enemies.push(new Enemy(e.x,e.y-80,"spawner"));else for(let e=0;e<t;e++)continueLevel(e==t-1&&!levelData.cleared);levelData.cleared2?level1.clearLevel2():levelData.cleared&&level1.addSpawner2(),updateFavorites()}else{basicLevel(!0);let e=level1.platforms[0];levelData.cleared?level1.clearLevel():enemies.push(new Enemy(e.x,e.y-80,"boss"))}};class Level{constructor(e,t,a,s){let i=e[0];this.text404=new DisplayObject(i[0]-150,i[1]-10,300,300),this.platforms=[],this.bgFill="#333F",this.txtCounter=0;for(let t=0;t<e.length;t++){let a=this.getplatformtext(e[t][2]);this.platforms.push(new Platform(e[t][0],e[t][1],e[t][2],a))}this.clouds=[],this.moreClouds(3),this.bgTxt=new DisplayObject(t/2,this.platforms[0].y+a,2*t,4*a),this.bgcounter=0,this.thunder=100,this.drops=[],this.cleared=!1,this.cleared2=!1}moreClouds(e){for(let t=0;t<e;t++){let e=3+randInt(4),a=[];for(let t=0;t<e;t++)a.push(this.getplatformtext(30+randInt(100)));let s=1;t%2==0&&(s=-1),this.clouds.push({o:new DisplayObject(0+200*t+randInt(100),killLine+randInt(450),1e3,1e3),t:a,n:randInt(200),dir:s})}}getplatformtext(e){let t="";for(let a=0;a<e/3;a++)t+=bgText[this.txtCounter],this.txtCounter++,this.txtCounter==bgText.length&&(this.txtCounter=0);return t}addSpawner2(){let e=this.platforms[1+randInt(this.platforms.length-1)];enemies.push(new Enemy(e.x,e.y-80,"spawner2")),textSpawnerGuy=last(enemies)}clearLevel(){this.cleared=!0,this.bgFill="#666"}clearLevel2(){this.cleared2=!0,this.bgFill="#ccc"}displayBackground(){if(cRect(0,0,canvas.w,canvas.h,this.bgFill),this.bgcounter>this.thunder&&!level1.cleared2){let e=10-(this.bgcounter-this.thunder);if(e>=0)cRect(0,0,canvas.w,canvas.h,"#FFF"+e);else if(Math.random()<.3)this.thunder+=50+randInt(100),playThunder();else{let e=200;level1.cleared&&(e=20),this.thunder+=e+randInt(e),playThunder()}}for(let e=0;e<this.clouds.length;e++){let t=this.clouds[e];if(t.o.position(),0!=t.o.screenPos)for(let e=0;e<t.t.length;e++)cText(t.t[e],t.o.screenPos.x*(.7+.03*e),.8*t.o.screenPos.y+15*e,"#bbb3",30);t.o.x+=.2*t.dir,this.bgcounter%150==0&&Math.random()>.5&&(t.dir*=-1)}let e=this.bgTxt.position();for(let t=this.drops.length-1;t>=0;t--){let a=this.drops[t];a.y+=20,cText(bgText[a.c],e.x+a.x,e.y+a.y,"#bbba",12),a.y>player.y&&this.drops.splice(t,1)}this.bgcounter%4==0&&this.drops.push({x:player.x+randInt(canvas.w),y:player.y-800,c:randInt(400)}),this.bgcounter++}display404Background(){let e=this.text404.position();level1.cleared2||isHome()?cText(currentLevel+".html",e.x,e.y,"#666",100):(cText("404",e.x,e.y,"#c99",100),cText("return to last page...",e.x,e.y+50,"#c99",30))}displayPlatforms(){for(let e=0;e<this.platforms.length;e++)this.platforms[e].display()}}let platformHeight=10,platformFill="#fdcf";class Platform extends DisplayObject{constructor(e,t,a,s){super(e,t,a,platformHeight),this.fill=platformFill,this.ptext=s}display(){let e=this.position();if(0!=this.screenPos){ctx.strokeStyle="#fdc8",ctx.strokeRect(e.x,e.y,this.w,20);let t="#a438";(level1.cleared||isHome())&&(t="#fdc8"),cRect(e.x,e.y,this.w,20,t);let a=this.ptext.length;cText(this.ptext.substring(0,a/2),e.x,e.y+8,this.fill,10),cText(this.ptext.substring(a/2,a),e.x,e.y+18,this.fill,10)}}}let bgText,start=()=>{loadSave(),fadeIn=0,createCanvas(),addressbar(),loadModelData(),fetch(bgurl).then(e=>e.text()).then(e=>bgText=e.replace(" ","")),setInterval(run,33)};window.onload=start;let currentLevel="start",run=()=>{isStart()?displayStartUI():(cameraFollow(player.x,player.y),level1.displayBackground(),level1.displayPlatforms(),level1.display404Background(),isHome()&&runFriendlyNPCs(),updateEnemies(),updatePlayer(),updateProjectiles(),runDialog(),updateItems(),runFadeIn(),progressBar(10,canvas.h-40,100,30,player.gunPower,"orange","grey"),progressBar(canvas.w-110,canvas.h-40,100,30,player.jetFuel,"blue","grey"))};
