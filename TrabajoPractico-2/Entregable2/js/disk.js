function Disk(posx, posy, radio, color) {
  this.posX= posx;
  this.posY=posy;
  this.radio=radio;
  this.color=color;
  this.assigned=false;
  this.locker=null;
}

Disk.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radio, 0, Math.PI*2);
  ctx.fillStyle=this.color;
  // ctx.save();
  // ctx.shadowColor = 'black';
  // ctx.shadowBlur = 40;
  // ctx.shadowOffsetX = 10;
  // ctx.shadowOffsetY = 7;
  ctx.stroke();
  ctx.fill();
  // ctx.restore();
  ctx.closePath();
};
