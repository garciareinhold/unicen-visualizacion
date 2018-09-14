function GameBoard(posx, posy, width, height, color) {
  this.posX=posx;
  this.posY=posy;
  this.width= width;
  this.height=height;
  this.color=color;
  this.lockersCollection=[];
}

GameBoard.prototype.board = function (ctx) {
  ctx.fillStyle= this.color;
  ctx.fillRect(this.posX, this.posX, this.width, this.height);
};

GameBoard.prototype.lockers = function (ctx, radio) {
  //120*120 tablero, 22 radios en ancho y 19 en alto , teniendo en cuenta 7x6 casilleros y una separacion entre los mismos de un radio del casillero (circular)
  let pointerX;
  let pointerY=this.posY;

  for (let y=0; y<6; y++){
    pointerX=this.posX;
    pointerY+=radio*2;

    for(let x=0; x<7; x++){
      pointerX+=radio*3;
      let locker= new Locker(pointerX, pointerY, y, x, radio);
      this.lockersCollection.push(locker);
      locker.draw(ctx);
    }
    pointerY+=radio*2;
  }
};
