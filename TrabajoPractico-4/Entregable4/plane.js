function Plane() {
  this.width=parseInt($("#plane").css("width"));
  this.height=parseInt($("#plane").css("height"));
  this.lives=[];
  this.pickedLife=false;
  // this.ammo=;
  this.score=0;
  this.livesData=$("#lives-container");
  this.scoreData=$('#score');
  this.immune=false;
  this.alive=true;
  this.velocity=5;
  this.element= $("#plane");
  this.restringedDown=parseInt($(".sky-background").css("height"))-this.height;
  this.restringedRight=parseInt($(".sky-background").css("width"))-this.width-this.velocity;
}

Plane.prototype.move = function (event) {
  let x = parseInt(this.element.css("left"));
  let y = parseInt(this.element.css("top"));
  if (this.alive) {
    switch (event.key) {
      case "ArrowDown":
        if (y < this.restringedDown) {
          this.element.css("top", y + this.velocity + "px");
        }
        break;
      case "ArrowUp":
        if (y > 0) {
          this.element.css("top", y -this.velocity + "px");
        }
        break;
      case "ArrowLeft":
        if (x >= this.velocity) {
          this.element.css("left", x - this.velocity + "px");
        }
        break;
      case "ArrowRight":
        if (x < this.restringedRight) {
          this.element.css("left", x + this.velocity + "px");
        }
        break;
      default:
    }
  }
};

Plane.prototype.beginLives = function () {
  for (var i = 0; i < 3; i++) {
    let life= document.createElement("div");
    $(life).addClass("lives");
    this.livesData.append(life);
    this.lives.push(life);
  }
};

Plane.prototype.colisioned = function () {
  this.immune=true;
  this.alive=false;
  $(this.element).addClass("immunity");
  this.removeLife();
};

Plane.prototype.respawn = function () {
  this.alive=true;
  setTimeout((function(){
    this.restore();
  }).bind(this), 5000);
};

Plane.prototype.addLife = function () {
  if((this.lives.length-1)<=9){
    let life= document.createElement("div");
    $(life).addClass("lives");
    this.livesData.append(life);
    this.lives.push(life);
  }
};

Plane.prototype.removeLife = function () {
  let element= this.lives.pop();
  $(element).remove();
};

Plane.prototype.restore = function () {
  this.immune=false;
  $(this.element).removeClass("immunity");
};
