function TrafficInspector() {
  this.explotionSize=128;
}

TrafficInspector.prototype.colisionPlanes = function (enemy, plane) {
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
    let explosion= document.createElement("div");
    $(plane).append(explosion);
    $(explosion).addClass("explosion");
    $(explosion).css("top", "+="+((planeHeight-this.explotionSize)/2));
    $(explosion).css("left", "+="+((planeWidth-this.explotionSize)/2));
    let explosion2= document.createElement("div");
    $(enemy).append(explosion2);
    $(explosion2).addClass("explosion");
    $(explosion2).css("top", "+="+((enemyHeight-this.explotionSize)/2));
    $(explosion2).css("left", "+="+((enemyWidth-this.explotionSize)/2));
    return true;
  }
}

TrafficInspector.prototype.removeExplotions = function () {
  let explotions= $('.explosion');
  for (var i = 0; i < explotions.length; i++) {
    $(explotions[i]).remove();
  }
};
