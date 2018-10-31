$(document).ready(function() {

  let plane = $("#plane");
  let isAlive=true;
  let enemyColisioned=null;

  $(document).on("keydown", function(event){
      planeMovement(event, isAlive);
  });

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

  let availables = [
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
  let occupied = [];

  let raiseEnemies = setInterval(throwEnemies, 2000);

  function throwEnemies() {
    let enemy = availables.pop();
    occupied.unshift(enemy);
    console.log(enemy);
    $(enemy).css("left", Math.random() * 325 + "px");
    $(enemy).addClass('enemy1movement');
}

  function stopEnemyInterval() {
    clearInterval(raiseEnemies);
  }

  function restart() {
      $('.sky-background').css("animation-play-state", "paused");
      stopEnemies();
      isAlive=false;
      setTimeout(restoreGame, 1000);
  }

  function stopEnemies() {
    $('.enemy').css("animation-play-state", "paused");
  }
  function moveEnemies() {
    $('.enemy').css("animation-play-state", "running");
  }

  function restoreGame() {
    $(enemyColisioned).removeClass("enemy1movement");
    availables.push(enemyColisioned);
    removeExplotions();
    isAlive=true;
    $('.sky-background').css("animation-play-state", "running");
    moveEnemies();
  }

  function removeExplotions() {
    let explotions= $('.explosion');
    for (var i = 0; i < explotions.length; i++) {
      $(explotions[i]).remove();
    }
  }

  let beginUpdate = setInterval(update, 1/30);

  function update() {
    for (var i =occupied.length-1 ; i >=0 ; i--) {
      if (colision(occupied[i])) {
        occupied.splice(i, 1);
        restart();
      } else if ($(occupied[i]).css("top") == "700px") {
        $(occupied[i]).removeClass('enemy1movement');
        availables.unshift(occupied[i]);
        occupied.splice(i, 1);
      }
    }
  }
  function stopUpdate() {
    clearInterval(beginUpdate);
  }

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
      //aca al enemy y al plane les meto el div arriba
      enemyColisioned=enemy;
      let explosion= document.createElement("div");
      $("#plane").append(explosion);
      $(explosion).addClass("explosion");
      $(explosion).css("top", "+="+((planeHeight-64)/2));
      $(explosion).css("left", "+="+((planeWidth-64)/2));
      let explosion2= document.createElement("div");
      $(enemy).append(explosion2);
      $(explosion2).addClass("explosion");
      $(explosion2).css("top", "+="+((enemyHeight-64)/2));
      $(explosion2).css("left", "+="+((enemyWidth-64)/2));

      return true;
  }
}

});
