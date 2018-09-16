function Disk(posx, posy, radio, color) {
  this.posX= posx;
  this.posY=posy;
  this.radio=radio;
  this.color=color;
  this.assigned=false;
}

Disk.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radio, 0, Math.PI*2);
  ctx.fillStyle=this.color;
  ctx.fill();
  ctx.closePath();
};
