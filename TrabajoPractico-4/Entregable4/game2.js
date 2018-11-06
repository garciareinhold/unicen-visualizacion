function Game() {
  this.enemies=null;
  this.plane= new Plane();
  this.enemyColisioned=null;
  this.ranking=null;
  this.enemiesInterval=null;
  this.music=null;
  this.increasedDifficulty;
  this.difficulty;
  this.lifeInterval=null;
  this.collectLifeInterval=null;
  this.background= $('.sky-background');
  this.timeExplotion= 800;
  this.updateInterval=null;
  this.airTrafficInspector= new TrafficInspector();
  this.life=$('#life');
  this.lifeThrowed=false;
  this.optionsUser;
}

Game.prototype.raiseEnemies = function () {
  this.enemies = [
    $('#enemy1'),
    $('#enemy2'),
    $('#enemy3'),
    $('#enemy4'),
    $('#enemy5'),
    $('#enemy6'),
    $('#enemy7'),
    $('#enemy8'),
    $('#enemy9'),
    $('#enemy10')
  ]
};

Game.prototype.beginLifeInterval = function () {
  this.lifeInterval= setInterval((function(){
    $(this.life)
    .clearQueue()
    .stop()
    .css({
      left: Math.random() * 325 + "px",
      top: "-110px",
      opacity: 1.0
    })
    .animate({
              top: "700px"
             },
             {
                duration: 3000,
                start: (function() {
                   this.lifeThrowed=true;
                }).bind(this),
                complete: (function () {
                  if(this.plane.pickedLife){
                    this.plane.addLife();
                    $(this.life).css("animation-play-state" , "paused");
                    let oneUp= document.createElement("div");
                    $(".sky-background").append(oneUp);
                    $(oneUp).css({
                      width:"107px",
                      height:"52px",
                      "background-image": "url(images/1up.png)",
                      top: "45%",
                      "margin-left": "40%"
                    })
                    console.log(oneUp);
                    $(oneUp).addClass("oneUp-animation");

                    setTimeout(function(){
                      $(".oneUp-animation").remove();
                    }, 2500)
                  }
                  this.plane.pickedLife=false;
                  this.lifeThrowed=false;
                }).bind(this)
              })
  }).bind(this), 30000)



};

Game.prototype.resetEnemies = function () {
  this.enemies= null;
};

Game.prototype.setOptionsUser = function (optionsUser) {
  this.optionsUser= optionsUser;
  this.difficulty= optionsUser.difficulty.difficulty;

  if(this.optionsUser.music.music=="ON"){
    this.music = new Audio("audios/music.mp3");
    this.music.loop=true;
  }
  if(this.optionsUser.music.sound=="ON"){
    this.airTrafficInspector.explotionEffect = new Audio("audios/explotion.mp3");
    this.airTrafficInspector.lifeUp = new Audio("audios/lifeUp.mp3");
  }
};
Game.prototype.begin = function () {
  $("#score").html("0");
  $(this.plane.element).css("left", "25%");
  $(this.plane.element).css("top", "400px");
  if(this.music!=null){
    this.music.play();
  }
  this.plane.beginLives();
  this.raiseEnemies();
  this.beginEnemyInterval();
  this.beginUpdateInterval();
  this.beginLifeInterval();
};

Game.prototype.beginEnemyInterval = function () {
  this.enemiesInterval = setInterval((function(){
    this.throwEnemies();
    if(this.difficulty>=1000){
      console.log(this.difficulty);
    }
  }).bind(this), this.difficulty);
};

Game.prototype.throwEnemies = function () {

  this.plane.score+=10;
  $(this.plane.scoreData).html(this.plane.score);
  for (var i = 0; i < this.enemies.length; i++) {
    let enemy=this.enemies[i];
    if($(enemy).css("top")=="-110px"){
      $(enemy).css("left", Math.random() * (parseInt($(this.background).css("width"))-130) + "px");
      $(enemy).addClass('enemy1movement');
      break;
    }
    else if($(enemy).css("top")=="700px"){
      $(enemy).removeClass('enemy1movement');
      $(enemy).css("top", "-110px");
    }
  }
};
Game.prototype.stopEnemyInterval = function () {
  clearInterval(this.enemiesInterval);
  this.enemiesInterval= null;

};

Game.prototype.stopLifeInterval = function () {
  clearInterval(this.lifeInterval);
  this.lifeInterval= null;

};

Game.prototype.stop = function () {
  this.stopUpdateInterval();
  this.stopBackground();
  this.stopEnemies();
  this.plane.alive=false;
  if(this.plane.lives.length < 1){
    this.finish();
  }
  else {
    setTimeout((function(){
      this.restore();
    }).bind(this), this.timeExplotion);
  }
};

Game.prototype.restore = function () {
  $(this.enemyColisioned).removeClass("enemy1movement");
  $(this.enemyColisioned).css("top", "-110px");
  this.airTrafficInspector.removeExplotions();
  this.plane.respawn();
  this.playBackground();
  this.moveEnemies();
  this.beginUpdateInterval();
};

Game.prototype.finish = function () {
  if(this.music!=null){
    this.music.pause();
  }
  this.stopLifeInterval();
  this.playBackground();
  $('.enemy').css("animation-play-state", "running");
  $("#score").html("0");
  $("#plane").removeClass("immunity");
  $("#finalScore").attr("value", this.plane.score);
  $("#modalFinish").css("z-index", 9999);
  $("#modalFinish").css("display", "block");
  this.airTrafficInspector.removeExplotions();
  for (var i = 0; i < this.enemies.length; i++) {
    let enemy= this.enemies[i];
  $(enemy).removeClass('enemy1movement');
  $(enemy).css("top", "-110px");
}
};
Game.prototype.stopEnemies = function () {
  this.stopEnemyInterval();
  $('.enemy').css("animation-play-state", "paused");
};

Game.prototype.moveEnemies = function () {
  $('.enemy').css("animation-play-state", "running");
  this.beginEnemyInterval();
};

Game.prototype.playBackground = function () {
  this.background.css("animation-play-state", "running");
};

Game.prototype.stopBackground = function () {
  this.background.css("animation-play-state", "paused");
};

Game.prototype.beginUpdateInterval = function () {
  this.updateInterval=setInterval((function(){
    this.update();
  }).bind(this), 1/8);
};

Game.prototype.stopUpdateInterval = function () {
  clearInterval(this.updateInterval);
  this.updateInterval= null;
};

Game.prototype.update = function () {
    if(!this.plane.immune){
    for (var i =this.enemies.length-1 ; i >=0 ; i--) {
      if (this.airTrafficInspector.colisionPlanes(this.enemies[i], this.plane.element, false)) {
        this.enemyColisioned=this.enemies[i];
        this.plane.colisioned();
        this.stop();
      }
    }
  }
  if(this.airTrafficInspector.colisionPlanes(this.life, this.plane.element, true)){
      this.plane.pickedLife=true;
      console.log("picked");
      //acá va el efecto del corazon
      $(this.life).css("opacity", "0.0");

    }

};
