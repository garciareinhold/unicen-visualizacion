function Rectangle(posx, posy, height, width, color) {
  this.posX=posx;
  this.pos=posy;
  this.height=height;
  this.width=width;
  this.color=color;
}

Rectangle.prototype.draw = function (ctx, img) {
  let image= ctx.createPattern(img, 'repeat');
  ctx.fillStyle= image;
  ctx.fillRect(this.posX, this.posX, this.width, this.height);
};
