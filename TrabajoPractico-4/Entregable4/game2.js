function Game() {
  this.enemies=null;
  this.plane= new Plane();
  this.enemyColisioned=null;
  this.score=0;
  this.ranking=null;
  this.enemiesInterval=null;
  // this.width=;
  // this.height=;
  this.background= $('.sky-background');
  this.timeExplotion= 800;
  this.updateInterval=null;
  this.airTrafficInspector= new TrafficInspector();
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

Game.prototype.resetEnemies = function () {
  this.enemies= null;
};

Game.prototype.begin = function () {
  this.raiseEnemies();
  this.beginEnemyInterval();
  this.beginUpdateInterval();
};

Game.prototype.beginEnemyInterval = function () {
  this.enemiesInterval = setInterval((function(){
    this.throwEnemies();
  }).bind(this), 1500);
};

Game.prototype.throwEnemies = function () {
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
  this.plane.alive=true;
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
  }).bind(this), 1/30);
};

Game.prototype.stopUpdateInterval = function () {
  clearInterval(this.updateInterval);
  this.updateInterval= null;
};

Game.prototype.update = function () {
  for (var i =this.enemies.length-1 ; i >=0 ; i--) {
    if (this.airTrafficInspector.colisionPlanes(this.enemies[i], this.plane.element)) {
      this.enemyColisioned=this.enemies[i];
      this.stop();
    }
  }
};
