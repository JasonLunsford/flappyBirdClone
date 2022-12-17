(()=>{"use strict";var e,t={494:(e,t,s)=>{var i=s(260),r=s.n(i);class n extends r().Scene{constructor(e,t){super(e),this.config=t,this.screenCenter=[t.width/2,t.height/2],this.menuStyle={fontSize:"32px",fill:"#fff"};let s=window.localStorage.getItem("storedScore");s&&(s=parseInt(s,10)),this.highScore=s||0}create(){this.add.image(0,0,"sky").setOrigin(0,0)}createMenu(e,t){let s=0;e.forEach((e=>{const i=[this.screenCenter[0],this.screenCenter[1]+s];e.textObject=this.add.text(...i,e.label,this.menuStyle).setOrigin(.5,1),t(e),s+=42}))}}const h=n;const a=class extends h{constructor(e){super("MenuScene",e),this.menu=[{scene:"PlayScene",label:"Play"},{scene:"ScoreScene",label:"High Score"},{scene:null,label:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this)),this.handleInputs()}setupMenuEvents(e){const{scene:t,textObject:s}=e;s.setInteractive(),s.on("pointerover",(()=>{s.setStyle({fill:"#ff0"})})),s.on("pointerout",(()=>{s.setStyle({fill:"#fff"})})),s.on("pointerup",(()=>{t?this.scene.start(t):this.game.destroy(!0)}))}handleInputs(){this.input.keyboard.on("keydown",(e=>{e.keyCode===Phaser.Input.Keyboard.KeyCodes.P?this.scene.start("PlayScene"):e.keyCode===Phaser.Input.Keyboard.KeyCodes.H?this.scene.start("ScoreScene"):e.keyCode===Phaser.Input.Keyboard.KeyCodes.E&&this.game.destroy(!0)}))}};const c=class extends h{constructor(e){super("PauseScene",e),this.menu=[{scene:"PlayScene",label:"Continue"},{scene:"MenuScene",label:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this)),this.handleInputs()}setupMenuEvents(e){const{scene:t,textObject:s}=e;s.setInteractive(),s.on("pointerover",(()=>{s.setStyle({fill:"#ff0"})})),s.on("pointerout",(()=>{s.setStyle({fill:"#fff"})})),s.on("pointerup",(()=>{"Continue"===e.label?(this.scene.stop(),this.scene.resume(t)):"Exit"===e.label&&(this.scene.stop("PlayScene"),this.scene.start(t))}))}handleInputs(){this.input.keyboard.on("keydown",(e=>{e.keyCode===Phaser.Input.Keyboard.KeyCodes.C?(this.scene.stop(),this.scene.resume("PlayScene")):e.keyCode===Phaser.Input.Keyboard.KeyCodes.E&&(this.scene.stop("PlayScene"),this.scene.start("MenuScene"))}))}};const o=class extends h{constructor(e){super("PlayScene",e),this.birdPosition=e.birdPosition,this.bird=null,this.pipes=null,this.score=0,this.scoreText="",this.highScoreText="",this.isPaused=!1,this.pipeGapSpread=[150,250],this.currentDifficulty="easy",this.difficulties={easy:{pipeGapSpread:[150,250],pipeSpeed:-200},normal:{pipeGapSpread:[140,190],pipeSpeed:-300},hard:{pipeGapSpread:[120,170],pipeSpeed:-400}}}create(){this.currentDifficulty="easy",super.create(),this.createBird(),this.createAnimation(),this.createPipes(),this.createColliders(),this.createScore(),this.createPause(),this.handleInputs(),this.myEventListener()}update(){this.checkForGameOver(),this.recyclePipes()}createBird(){this.bird=this.physics.add.sprite(this.birdPosition.x,this.birdPosition.y,"bird").setFlipX(!0).setOrigin(0).setScale(3),this.bird.setBodySize(this.bird.width,this.bird.height-8),this.bird.body.gravity.y=600,this.bird.setCollideWorldBounds(!0)}createAnimation(){this.anims.create({key:"fly",frames:this.anims.generateFrameNumbers("bird",{start:8,end:15}),frameRate:16,repeat:-1}),this.bird.play("fly")}createPipes(){const e=this.difficulties[this.currentDifficulty];this.pipes=this.physics.add.group();for(let e=0;e<this.config.pipesToRender;e++){const e=this.pipes.create(0,0,"pipe").setImmovable(!0).setOrigin(0,1),t=this.pipes.create(0,0,"pipe").setImmovable(!0).setOrigin(0,0);this.placePipe(e,t)}this.pipes.setVelocityX(e.pipeSpeed)}createColliders(){this.physics.add.collider(this.bird,this.pipes,this.gameOver,null,this)}createScore(){this.score=0,this.scoreText=this.add.text(16,16,`Score: ${this.score}`,{fontSize:"32px",fill:"#000"}),this.highScoreText=this.add.text(16,52,`High Score: ${this.highScore}`,{fontSize:"16px",fill:"#000"})}createPause(){this.isPaused=!1;const{width:e,height:t}=this.config;this.add.image(e-10,t-10,"pause").setOrigin(1).setScale(3).setInteractive().on("pointerdown",(()=>{this.isPaused=!0,this.physics.pause(),this.scene.pause(),this.scene.launch("PauseScene")}))}handleInputs(){this.input.on("pointerdown",this.flap,this),this.input.keyboard.on("keydown",(e=>{e.keyCode===Phaser.Input.Keyboard.KeyCodes.SPACE?this.flap():e.keyCode===Phaser.Input.Keyboard.KeyCodes.P&&(this.physics.pause(),this.scene.pause(),this.scene.launch("PauseScene"))}))}myEventListener(){this.pauseEvent||(this.pauseEvent=this.events.on("resume",(()=>{this.initTime=3,this.countDownText=this.add.text(...this.screenCenter,`Restart in: ${this.initTime}`,this.menuStyle).setOrigin(.5,1),this.timedEvent=this.time.addEvent({delay:1e3,callback:this.countDown,callbackScope:this,loop:!0})}),this))}countDown(){this.initTime--,this.countDownText.setText(`Restart in: ${this.initTime}`),this.initTime<=0&&(this.countDownText.setText(""),this.physics.resume(),this.timedEvent.remove(),this.isPaused=!1)}placePipe(e,t){let s=this.difficulties[this.currentDifficulty];const i=this.getLastPipe();let r=Phaser.Math.Between(...s.pipeGapSpread),n=Phaser.Math.Between(20,this.config.height-20-r),h=Phaser.Math.Between(450,500);e.x=i+h,e.y=n,t.x=e.x,t.y=e.y+r}getLastPipe(){let e=0;return this.pipes.getChildren().forEach((t=>{e=Math.max(t.x,e)})),e}recyclePipes(){const e=[];this.pipes.getChildren().forEach((t=>{t.getBounds().right<=0&&e.push(t)})),e.length&&(this.placePipe(e[0],e[1]),this.increaseScore(),this.increaseDifficulty())}flap(){this.isPaused||(this.bird.body.velocity.y=-this.config.flapVelocity)}checkForGameOver(){(this.bird.getBounds().bottom>=this.config.height||this.bird.y<=0)&&this.gameOver()}increaseScore(){this.score++,this.scoreText.setText(`Score: ${this.score}`),this.score>this.highScore&&(this.highScore=this.score,this.highScoreText.setText(`Best Score: ${this.highScore}`),window.localStorage.setItem("storedScore",this.score))}increaseDifficulty(){let e;1===this.score&&(this.currentDifficulty="easy"),5===this.score&&(this.currentDifficulty="normal"),10===this.score&&(this.currentDifficulty="hard"),e=this.difficulties[this.currentDifficulty],this.pipes.setVelocityX(e.pipeSpeed)}gameOver(){this.physics.pause(),this.bird.setTint(15616036),this.bird.stop("fly"),this.time.addEvent({delay:1e3,callback:()=>{this.scene.restart()},loop:!1})}};class p extends r().Scene{constructor(){super("PreloadScene")}preload(){this.load.image("sky","assets/sky.png"),this.load.spritesheet("bird","assets/birdSprite.png",{frameWidth:16,frameHeight:16}),this.load.image("pipe","assets/pipe.png"),this.load.image("pause","assets/pause.png"),this.load.image("back","assets/back.png")}create(){this.scene.start("MenuScene")}}const d=p;const l=class extends h{constructor(e){super("ScoreScene",e)}create(){super.create(),this.createHighScoreText(),this.createBackButton(),this.handleInputs()}createHighScoreText(){this.add.text(...this.screenCenter,`High Score: ${this.highScore}`,this.menuStyle).setOrigin(.5,1)}createBackButton(){const{width:e,height:t}=this.config;this.add.image(e-10,t-10,"back").setOrigin(1).setScale(2).setInteractive().on("pointerdown",(()=>{this.scene.start("MenuScene")}))}handleInputs(){this.input.keyboard.on("keydown",(e=>{e.keyCode===Phaser.Input.Keyboard.KeyCodes.B&&this.scene.start("MenuScene")}))}},u={width:800,height:600,birdPosition:{x:80,y:300},flapVelocity:300,pipesToRender:8},y=[d,a,l,o,c],f={type:r().AUTO,pixelArt:!0,physics:{default:"arcade",arcade:{debug:!1}},scale:{mode:r().Scale.FIT},scene:y.map((e=>new e(u))),...u};new(r().Game)(f)}},s={};function i(e){var r=s[e];if(void 0!==r)return r.exports;var n=s[e]={exports:{}};return t[e].call(n.exports,n,n.exports,i),n.exports}i.m=t,e=[],i.O=(t,s,r,n)=>{if(!s){var h=1/0;for(p=0;p<e.length;p++){for(var[s,r,n]=e[p],a=!0,c=0;c<s.length;c++)(!1&n||h>=n)&&Object.keys(i.O).every((e=>i.O[e](s[c])))?s.splice(c--,1):(a=!1,n<h&&(h=n));if(a){e.splice(p--,1);var o=r();void 0!==o&&(t=o)}}return t}n=n||0;for(var p=e.length;p>0&&e[p-1][2]>n;p--)e[p]=e[p-1];e[p]=[s,r,n]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={143:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var r,n,[h,a,c]=s,o=0;if(h.some((t=>0!==e[t]))){for(r in a)i.o(a,r)&&(i.m[r]=a[r]);if(c)var p=c(i)}for(t&&t(s);o<h.length;o++)n=h[o],i.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return i.O(p)},s=self.webpackChunkphaser_webpack_boilerplate=self.webpackChunkphaser_webpack_boilerplate||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var r=i.O(void 0,[736],(()=>i(494)));r=i.O(r)})();