function Disk(posx, posy, radio, color) {
  this.posX= posx;
  this.posY=posy;
  this.radio=radio;
  this.color=color;
  this.assigned=false;
  this.locker=null;
  this.image= null;
}

Disk.prototype.draw = function (ctx) {
    if (this.image!=null) {
      ctx.drawImage(this.image,this.posX-this.image.width/2,this.posY-this.image.height/2, this.image.width, this.image.height);
      ctx.fillStyle="rgba(7, 91, 224, 0)";
    }
    else {
      ctx.fillStyle=this.color;
    }
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radio, 0, Math.PI*2);
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
