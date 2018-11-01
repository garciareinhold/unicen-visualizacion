function Plane() {
  // this.width=;
  // this.height=;
  // this.lives=;
  // this.ammo=;
  // this.immune=;
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
