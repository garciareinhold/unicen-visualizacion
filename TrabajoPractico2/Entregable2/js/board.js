function GameBoard(posx, posy, width, height, color) {
  this.posX=posx;
  this.posY=posy;
  this.width= width;
  this.height=height;
  this.color=color;
  this.lockersCollection=[];
  this.dropzones=[];
  this.activeZone=null;
  this.radio= 8;
}

GameBoard.prototype.board = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.posX,this.posY+this.radio);
  ctx.lineTo(this.posX,this.posY+this.height-this.radio);
  ctx.quadraticCurveTo(this.posX,this.posY+this.height,this.posX+this.radio,this.posY+this.height);
  ctx.lineTo(this.posX+this.width-this.radio,this.posY+this.height);
  ctx.quadraticCurveTo(this.posX+this.width,this.posY+this.height,this.posX+this.width,this.posY+this.height-this.radio);
  ctx.lineTo(this.posX+this.width,this.posY+this.radio);
  ctx.quadraticCurveTo(this.posX+this.width,this.posY,this.posX+this.width-this.radio,this.posY);
  ctx.lineTo(this.posX+this.radio,this.posY);
  ctx.quadraticCurveTo(this.posX,this.posY,this.posX,this.posY+7);
  ctx.fillStyle= this.color;
  ctx.save();
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 15;
  ctx.shadowOffsetY = 15;
  ctx.fill();
  ctx.restore();
  // ctx.fillRect(this.posX, this.posY, this.width, this.height);
};

GameBoard.prototype.createBoard = function (ctx, radio) {
  this.board(ctx);
  this.createLockers(ctx, radio);
};

GameBoard.prototype.refreshBoard = function (ctx) {
  this.board(ctx)
  for (var i = 0; i < this.lockersCollection.length; i++) {
    this.lockersCollection[i].draw(ctx);
  }
};

GameBoard.prototype.getLockersBelow = function (x, y) {
  let lockers=[];
  for (let i = 0; i < this.lockersCollection.length; i++) {
    if(this.lockersCollection[i]!=null && this.lockersCollection[i].matX>x && this.lockersCollection[i].matY==y){
      lockers.push(this.lockersCollection[i]);
    }
  }
  return lockers;
};

GameBoard.prototype.getLockersOnRight = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  while (!cut) {
    let locker= this.getLocker(x, y+i, value);
    if (locker!=null) {
      sum++;
      i++;
    }
    else cut=true;
  }
  return sum;
};

GameBoard.prototype.paintBelow = function (currentDisk) {
alert("winner");
};

GameBoard.prototype.paintSides = function (currentDisk) {
  alert("winner");

};

GameBoard.prototype.paintDiagonalLeft = function (currentDisk) {
  alert("winner");

};

GameBoard.prototype.paintDiagonalRight = function (currentDisk) {
  alert("winner");

};

GameBoard.prototype.getLockersOnLeft = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  let lockers=[];
  while (!cut) {
    let locker= this.getLocker(x, y-i, value);
    if (locker!=null) {
      sum++;
      i++;
      lockers.push(locker);
    }
    else cut=true;
    }
  return lockers;
};

GameBoard.prototype.getLockersUpRight = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  while (!cut) {
    let locker= this.getLocker(x-i, y+i, value);
    if (locker!=null) {
      sum++;
      i++;
    }
    else cut=true;
    }
  return sum;
};

GameBoard.prototype.getLockersUpLeft = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  while (!cut) {
    let locker= this.getLocker(x-i, y-i, value);
    if (locker!=null) {
      sum++;
      i++;
    }
    else cut=true;
    }
  return sum;
};

GameBoard.prototype.getLockersDownLeft = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  while (!cut) {
    let locker= this.getLocker(x+i, y-i, value);
    if (locker!=null) {
      sum++;
      i++;
    }
    else cut=true;
    }
  return sum;
};

GameBoard.prototype.getLockersDownRight = function (x, y, value) {
  let sum=0;
  let i= 1;
  let cut=false;
  let lockers= [];
  while (!cut) {
    let locker= this.getLocker(x+i, y+i, value);
    if (locker!=null) {
      sum++;
      i++;
      lockers.push(locker);
    }
    else cut=true;
    }
  return lockers;
};


GameBoard.prototype.getLocker = function (x, y, value) {
  let locker= null;
  for (var i = 0; i < this.lockersCollection.length; i++) {
    if(this.lockersCollection[i].matX==x && this.lockersCollection[i].matY==y && this.lockersCollection[i].value==value ){
      locker= this.lockersCollection[i];
    }
  }
  return locker;
};

GameBoard.prototype.createLockers = function (ctx, radio) {
  //120*120 tablero, 22 radios en ancho y 19 en alto , teniendo en cuenta 7x6 casilleros y una separacion entre los mismos de un radio del casillero (circular)
  let pointerX;
  let pointerY=this.posY;
  for (let y=0; y<6; y++){
    pointerX=this.posX-16;
    pointerY+=17;

    for(let x=0; x<7; x++){
      pointerX+=33;
      let locker= new Locker(pointerX, pointerY, y, x, radio);
      this.lockersCollection.push(locker);
      locker.draw(ctx);
    }
    pointerY+=17;
  }
  this.establishDropzones();
};

GameBoard.prototype.establishDropzones = function () {
  for (var i = 0; i < 7; i++) {
    let locker= this.lockersCollection[i];
    let iniX= locker.posX-locker.radio;
    let finX= locker.posX+locker.radio - 10; //dispersion value 
    let iniY= locker.posY-locker.radio*4;
    let finY= locker.posY;
    let column= locker.matY
    let zone= {'iniX':iniX, 'iniY':iniY, 'finX':finX, 'finY':finY, 'column':column}
    this.dropzones.push(zone);
  }
};

GameBoard.prototype.isDropzone = function (event, radio) {
  for (var i = 0; i < this.dropzones.length; i++) {
    let zone=this.dropzones[i];
    if(((event.layerX+radio>zone.iniX && event.layerX<zone.finX)
    ||(event.layerX-radio<zone.finX && event.layerX-radio > zone.iniX))
    &&(event.layerY> zone.iniY && event.layerY<zone.finY)){
      this.activeZone= zone;
      return true;
    }
  }
  return false;
};

GameBoard.prototype.dropDisk = function (event, currentDisk) {
  let lockersColumn= this.getLockersColumn();
  let lockerFree= this.getFreeLocker(lockersColumn);
  if(lockerFree!=null){
    this.insertDiskIntoLocker(currentDisk, lockerFree);
    return true;
  }
  else {
    return false;
  }

};

GameBoard.prototype.getLockersColumn = function () {
  let lockers= [];
  let column = this.activeZone.column;
  for (var i = 0; i < this.lockersCollection.length; i++) {
    if(this.lockersCollection[i].matY == column){
      lockers.push(this.lockersCollection[i]);
    }
  }
  return lockers;
};



GameBoard.prototype.getFreeLocker = function (lockers) {
  let i= lockers.length-1;
  let cut=false;
  let locker=null;
  while(!cut && i>=0){
    if(!(lockers[i].occupied)){
      cut=true;
      locker= lockers[i];
      locker.occupied=true;
    }
    i--;
  }
  return locker;

};

GameBoard.prototype.insertDiskIntoLocker = function (disk, locker) {
  disk.posX= locker.posX;
  disk.posY= locker.posY;
  disk.locker= locker;
  locker.value= disk.color;
};
