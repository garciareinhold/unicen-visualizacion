function Locker(posX, posY, matX, matY, radio, occupied) {
  this.posX= posX;
  this.posY=posY;
  this.matX=matX;
  this.matY=matY;
  this.radio=radio;
  this.color= "orange";
  this.occupied=occupied;
  this.value=null;
}

Locker.prototype.draw = function (ctx, color) {
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radio, 0 , Math.PI*2);
  (color==null)? ctx.fillStyle= this.color: ctx.fillStyle= color;
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
};
