function Circle(posx, posy, radio, color) {
  this.posX=posx;
  this.posY=posy;
  this.radio=radio;
  this.color=color;
}

Circle.prototype.draw = function (ctx, image) {
  ctx.beginPath();
  ctx.arc(this.posX, this.posY, this.radio, 0 , Math.PI*2);
  this.fillImage(ctx, image);
  ctx.closePath();
};

Circle.prototype.fillLinearGradient = function (ctx) {
  console.log("entre");
  let gradient= ctx.createLinearGradient(this.posX-this.radio, this.posY, this.posX+this.radio ,this.posY );
  gradient.addColorStop(0,"black");
  gradient.addColorStop(0.5, "yellow");
  gradient.addColorStop(1, "red");
  ctx.fillStyle= gradient;
  ctx.fill();
};

Circle.prototype.fillImage = function (ctx, img) {
  let image= ctx.createPattern(img, "repeat");
  ctx.fillStyle= image;
  ctx.fill();
};

Circle.prototype.fillRadialGradient = function (ctx) {
  let gradient = ctx.createRadialGradient(this.posX, this.posY, this.radio/4, this.posX, this.posY, this.radio);
  gradient.addColorStop(0,"black");
  gradient.addColorStop(0.5, "yellow");
  gradient.addColorStop(1, "red");
  ctx.fillStyle = gradient;
  ctx.fill();
};
