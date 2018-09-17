document.addEventListener("DOMContentLoaded", function() {

const TOTAL_DISKS=42;
const RADIO_DISK= 5;
const GAP_BTW_DISKS= 15;
const COLOR_P_ONE= "red";
const COLOR_P_TWO= "green";
let canvas= document.getElementById('canvas');
let ctx= canvas.getContext("2d");
let gameBoard= new GameBoard(240, 240, 120, 120, "blue");
let diskCollection= [];
let currentDisk= null;
let beginX=0;
let beginY=0;
let turn="red";

gameBoard.createBoard(ctx, 5.05);


/////////////////////////////////////////////////////////////////////////////

//DRAWING PLAYER´S DISKS


function assignDisksToPlayer(player) {
  //pasar a clase Juego
    let ini_X;
    let ini_Y= 295;
    let pointer_X;
    let color_player;
    (player==1)? ini_X=100 : ini_X=410;
    (player==2)? color_player=COLOR_P_TWO : color_player=COLOR_P_ONE;
      for (var i = 0; i <TOTAL_DISKS/14 ; i++) {
        pointer_X= ini_X;
        for (var j = 0; j < TOTAL_DISKS/6; j++) {
          let disk= new Disk(pointer_X, ini_Y, RADIO_DISK, color_player);
          disk.draw(ctx);
          diskCollection.push(disk);
          pointer_X+=GAP_BTW_DISKS;
        }
        ini_Y+=GAP_BTW_DISKS;
      }
    }
assignDisksToPlayer(1);
assignDisksToPlayer(2);

function updateDiskPosition() {
  //pasar a clase disk
  ctx.fillStyle= "white";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  gameBoard.refreshBoard(ctx)
  for (var i = 0; i < diskCollection.length; i++) {
    diskCollection[i].draw(ctx);
  }

}

function restoreDisk() {
  //pasar a clase disk
  currentDisk.posX= currentDisk.originalPosX;
  currentDisk.posY= currentDisk.originalPosY;
  updateDiskPosition();
}
/////////////////////////////////////////////////////////////////////////////

//DRAGGING EVENTS

////////////////////////////////////////////////////////////////////////////
canvas.onmousedown = function (event) {
  let cut= false;
  let i=0;
  while (!cut && i<diskCollection.length) {
    if(clickOverDisk(diskCollection[i], event)  && diskCollection[i].color==turn){
      currentDisk=diskCollection[i];
      currentDisk.originalPosX= currentDisk.posX;
      currentDisk.originalPosY= currentDisk.posY;
      beginX=event.layerX- diskCollection[i].posX;
      beginY=event.layerY- diskCollection[i].posY;
      cut=true;
    }
    i++;
  }
}
canvas.onmousemove= function (event) {
  if (currentDisk!=null) {
    currentDisk.posX= event.layerX-beginX;
    currentDisk.posY= event.layerY- beginY;
    updateDiskPosition();
  }
}
canvas.onmouseup = function (event) {
  if(currentDisk!=null){
    if(gameBoard.isDropzone(event, currentDisk.radio) && !currentDisk.assigned){
      let success= gameBoard.dropDisk(event, currentDisk);
      if (success) {
        updateDiskPosition();
        currentDisk.assigned=true;
        winner();
        changeTurn();
        console.log(turn);
      }
      else {
        restoreDisk();
      }
    }
    else{
      restoreDisk();
    }
    currentDisk=null;
  }
}
function clickOverDisk(disk, event) {
  //pasar a clase disk
  let dx = event.layerX - disk.posX;
  let dy = event.layerY - disk.posY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return (dist<disk.radio);
}



/////////////////////////////////////////////////////////

//FUNCIÓN GANAR, PASARLA A CLASE JUEGO Y APLICAR STRATEGY!!!

////////////////////////////////////////////////////////
function winner() {
   if(fourBelow() || fourOnBothSides()){
     alert("We´ve a winner!!!")
   }
}

function fourOnBothSides() {
  let x= currentDisk.locker.matX;
  let y= currentDisk.locker.matY;

  let lockersSides= gameBoard.getLockersOnBothSides(x, y);
  let sum=0;
  for (var i = 0; i < lockersSides.length; i++) {
    if(lockersSides[i].value== currentDisk.color){
      sum++;
    }
  }
  return (sum>=3);

}

function fourBelow() {
 let x= currentDisk.locker.matX;
 let y= currentDisk.locker.matY;

 let lockersBelow= gameBoard.getLockersBelow(x, y);
 let sum=0;
 for (var i = 0; i < lockersBelow.length; i++) {
   if(lockersBelow[i].value== currentDisk.color){
     sum++;
   }
 }
 return (sum>=3);
}

function changeTurn() {
  (turn==COLOR_P_ONE)? turn=COLOR_P_TWO : turn=COLOR_P_ONE;
}



})
