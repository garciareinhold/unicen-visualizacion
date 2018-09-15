function Locker(posX, posY, matX, matY, radio, occupied) {
  this.posX= posX;
  this.posY=posY;
  this.matX=matX;
  this.matY=matY;
  this.radio=radio;
  this.color= "white";
  this.occupied=occupied;
}

Locker.prototype.draw = function (ctx, color) {
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radio, 0 , Math.PI*2);
  (color==null)? ctx.fillStyle= this.color: ctx.fillStyle= color;
  ctx.fill();
  ctx.closePath();
};
