function Game() {
  this.enemies=null;
  this.plane= new Plane();
  this.enemyColisioned=null;
  this.ranking=null;
  this.enemiesInterval=null;
  // this.width=;
  // this.height=;
  this.lifeInterval=null;
  this.background= $('.sky-background');
  this.timeExplotion= 800;
  this.updateInterval=null;
  this.airTrafficInspector= new TrafficInspector();
  this.life=$('#life');
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
  this.lifeInterval= setInterval(function(){
    $(this.life)
    .clearQueue()
    .stop()
    .css({
      left: Math.random() * 325 + "px",
      top: "-110px"
    })
    .animate({
              top: "700px"
             },
             {
                duration: 3000,
                start: function() {
                   console.log("empece");
                },
                complete: function () {
                  console.log("termine");
                }
              })
  }, 10000)



};

Game.prototype.resetEnemies = function () {
  this.enemies= null;
};

Game.prototype.begin = function () {
  this.raiseEnemies();
  this.beginEnemyInterval();
  this.beginUpdateInterval();
  this.beginLifeInterval();
};

Game.prototype.beginEnemyInterval = function () {
  this.enemiesInterval = setInterval((function(){
    this.throwEnemies();
  }).bind(this), 2500);
};

Game.prototype.throwEnemies = function () {

  this.plane.score+=10;
  for (var i = 0; i < this.enemies.length; i++) {
    let enemy=this.enemies[i];
    if($(enemy).css("top")=="-110px"){
      $(enemy).css("left", Math.random() * 325 + "px");
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

Game.prototype.stop = function () {
  this.stopUpdateInterval();
  this.stopBackground();
  this.stopEnemies();
  this.plane.alive=false;
  setTimeout((function(){
    this.restore();
  }).bind(this), this.timeExplotion);
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
      if (this.airTrafficInspector.colisionPlanes(this.enemies[i], this.plane.element)) {
        this.enemyColisioned=this.enemies[i];
        // location.reload();
        this.plane.colisioned();
        this.stop();
      }
    }
  }

};