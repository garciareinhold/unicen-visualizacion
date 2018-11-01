$(document).ready(function() {

  let plane = $("#plane");
  let isAlive=true;
  let enemyColisioned=null;

  $(document).on("keydown", function(event){
      planeMovement(event, isAlive);
  });





//////////////////////////////////////////
//PLANE MOVEMENT
//////////////////////////////////////////
  function planeMovement(event, isAlive) {
    let x = parseInt(plane.css("left"));
    let y = parseInt(plane.css("bottom"));
    if (isAlive) {
      switch (event.key) {
        case "ArrowDown":
          if (y >= 0) {
            plane.css("bottom", y - 2 + "px");
          }
          break;
        case "ArrowUp":
          if (y < 525) {
            plane.css("bottom", y + 2 + "px");
          }
          break;
        case "ArrowLeft":
          if (x >= 0) {
            plane.css("left", x - 2 + "px");
          }
          break;
        case "ArrowRight":
          if (x < 355) {
            plane.css("left", x + 2 + "px");
          }
          break;
        default:
      }
    }

  }

  let enemies = [
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


//////////////////////////////////////////////////////
//throwEnemies
/////////////////////////////////////////////////////
  let raiseEnemies =null;

  beginEnemyInterval();

  function beginEnemyInterval() {
    raiseEnemies = setInterval(throwEnemies, 2000);
  }
  function stopEnemyInterval() {
    clearInterval(raiseEnemies);
  }

  function throwEnemies() {
    for (var i = 0; i < enemies.length; i++) {
      let enemy= enemies[i];
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
    for (var i = 0; i < enemies.length; i++) {
      let enemy=enemies[i];
      console.log($(enemy).css("top"));
    }
  }


  //////////////////////////////////////////////////////
  //RESTORE GAME
  /////////////////////////////////////////////////////

  function stopGame() {
      stopUpdate();
      $('.sky-background').css("animation-play-state", "paused");
      stopEnemies();
      isAlive=false;
      setTimeout(restoreGame, 800);
  }

  function restoreGame() {
    $(enemyColisioned).removeClass("enemy1movement");
    $(enemyColisioned).css("top", "-110px");
    removeExplotions();
    isAlive=true;
    $('.sky-background').css("animation-play-state", "running");
    moveEnemies();
    beginUpdateInterval();
  }

  function removeExplotions() {
    let explotions= $('.explosion');
    for (var i = 0; i < explotions.length; i++) {
      $(explotions[i]).remove();
    }
  }

  function stopEnemies() {
    stopEnemyInterval();
    $('.enemy').css("animation-play-state", "paused");

  }
  function moveEnemies() {
    $('.enemy').css("animation-play-state", "running");
    beginEnemyInterval();
  }


//////////////////////////////////////////////////////
//UPDATE
////////////////////////////////////////////////////

  let beginUpdate =null;

  beginUpdateInterval();

  function beginUpdateInterval() {
    beginUpdate = setInterval(update, 1/30);
  }

  function update() {
    for (var i =enemies.length-1 ; i >=0 ; i--) {
      if (colision(enemies[i])) {
        stopGame();
      }
    }
  }

  function stopUpdate() {
    clearInterval(beginUpdate);
  }





////////////////////////////////////////////////////////
//DETECCIÓN DE COLISIÓN
///////////////////////////////////////////////////////
  function colision(enemy) {
    let planeHeight=parseInt($(plane).css("height"));
    let planeWidth=parseInt($(plane).css("width"));
    let enemyHeight=parseInt($(enemy).css("height"));
    let enemyWidth=parseInt($(enemy).css("width"));
    let enemyBeginSides= parseInt($(enemy).css("left"));
    let enemyEndSides= enemyWidth+enemyBeginSides;
    let planeBeginSides= parseInt($(plane).css("left"));
    let PlaneEndSides= planeWidth+planeBeginSides;
    let enemyBeginUp=parseInt($(enemy).css("top"));
    let enemyEndDown=enemyHeight+enemyBeginUp;
    let planeBeginUp=parseInt($(plane).css("top"));
    let PlaneEndDown=planeHeight+planeBeginUp;

    if((((enemyEndSides > planeBeginSides) && (enemyEndSides < PlaneEndSides)) ||((enemyBeginSides < PlaneEndSides) && (enemyBeginSides > planeBeginSides))) && ((enemyEndDown > planeBeginUp) && (enemyBeginUp < PlaneEndDown)) ){
      enemyColisioned=enemy;
      let explosion= document.createElement("div");
      $("#plane").append(explosion);
      $(explosion).addClass("explosion");
      $(explosion).css("top", "+="+((planeHeight-128)/2));
      $(explosion).css("left", "+="+((planeWidth-128)/2));
      let explosion2= document.createElement("div");
      $(enemy).append(explosion2);
      $(explosion2).addClass("explosion");
      $(explosion2).css("top", "+="+((enemyHeight-128)/2));
      $(explosion2).css("left", "+="+((enemyWidth-128)/2));

      return true;
  }
}

});
