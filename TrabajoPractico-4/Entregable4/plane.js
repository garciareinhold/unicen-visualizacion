function Plane() {
  // this.width=;
  // this.height=;
  this.lives=[];
  this.pickedLife=false;
  // this.ammo=;
  this.score=0;
  this.livesData=$("#lives-container");
  this.scoreData=$('#score');
  this.immune=false;
  this.alive=true;
  this.velocity=2;
  this.element= $("#plane");
  this.restringedLeft=0;
  this.restringedRight=355;
  this.restringedTop=0;
  this.restringedDown=525
}

Plane.prototype.move = function (event) {
  let x = parseInt(this.element.css("left"));
  let y = parseInt(this.element.css("bottom"));
  if (this.alive) {
    switch (event.key) {
      case "ArrowDown":
        if (y >= this.restringedTop) {
          this.element.css("bottom", y - this.velocity + "px");
        }
        break;
      case "ArrowUp":
        if (y < this.restringedDown) {
          this.element.css("bottom", y + this.velocity + "px");
        }
        break;
      case "ArrowLeft":
        if (x >= this.restringedLeft) {
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

Plane.prototype.beginLives = function (livesCollection) {
  this.lives=$(livesCollection).toArray();
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
