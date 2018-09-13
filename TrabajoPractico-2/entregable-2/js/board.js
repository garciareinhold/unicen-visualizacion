function GameBoard(posx, posy, width, height, color) {
  this.posX=posx;
  this.posY=posy;
  this.width= width;
  this.height=height;
  this.color=color;
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
      console.log("entre");
      pointerX+=radio*3;
      ctx.beginPath();
      ctx.arc(pointerX, pointerY, radio, 0 , Math.PI*2);
      ctx.fillStyle="white";
      ctx.fill();
      ctx.closePath();
    }
    pointerY+=radio*2;
  }
};
