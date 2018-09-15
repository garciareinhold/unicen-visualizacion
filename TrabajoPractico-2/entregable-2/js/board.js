function GameBoard(posx, posy, width, height, color) {
  this.posX=posx;
  this.posY=posy;
  this.width= width;
  this.height=height;
  this.color=color;
  this.lockersCollection=[];
  this.dropzones=[];
  this.activeZone=null;
}

GameBoard.prototype.board = function (ctx) {
  ctx.fillStyle= this.color;
  ctx.fillRect(this.posX, this.posX, this.width, this.height);
};

GameBoard.prototype.createBoard = function (ctx) {
  this.board(ctx);
  this.createLockers(ctx, 5.05);

};

GameBoard.prototype.refreshBoard = function (ctx) {
  this.board(ctx)
  for (var i = 0; i < this.lockersCollection.length; i++) {
    this.lockersCollection[i].draw(ctx);
  }
};
/*
  HACER UNA FUNCION QUE CREE EL BOARD Y CREE LOS LOCKERS, DESPUES UNA FUNCION DE
  REFRESCAR QUE PINTE A CADA LOCKER EN SU POSICION EN VEZ DE VOLVERLOS A CREAR ASI
  NO SE PIERDE EL BOOLEANO DE OCUPADO
  --->refreshBoard(vuelve a pintar el board y los lockers en el array de lockers) y createBoard(crea el board y crea los lockers,
      aqui defino tambien el establishDropzones)
*/

GameBoard.prototype.createLockers = function (ctx, radio) {
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
  this.establishDropzones();
};

GameBoard.prototype.establishDropzones = function () {
  for (var i = 0; i < 7; i++) {
    let locker= this.lockersCollection[i];
    let iniX= locker.posX-locker.radio;
    let finX= locker.posX+locker.radio;
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
  console.log(lockersColumn);
  console.log(this.lockersCollection);
  let lockerFree= this.getFreeLocker(lockersColumn);
  console.log(lockerFree);
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
    console.log(!lockers[i].occupied);
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
  console.log(disk);
  console.log(locker);
};
