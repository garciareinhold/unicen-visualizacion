document.addEventListener("DOMContentLoaded", function() {

const TOTAL_DISKS=42;
const RADIO_DISK= 13.75;
const GAP_BTW_DISKS= 23;
const COLOR_P_ONE= "red";
const COLOR_P_TWO= "green";
let canvas= document.getElementById('canvas');
let ctx= canvas.getContext("2d");
let gameBoard= new GameBoard(280, 130, 232, 204, "blue");
let diskCollection= [];
let currentDisk= null;
let beginX=0;
let beginY=0;
let turn="red";


  gameBoard.createBoard(ctx,15);
  assignDisksToPlayer(1);
  assignDisksToPlayer(2);

document.getElementById('nameP1').onclick= function (event) {
  event.preventDefault();
  let st= document.getElementById('p1').value;
  document.getElementById('spanP1').innerHTML=st;
}
document.getElementById('nameP2').onclick= function (event) {
  event.preventDefault();
  let st= document.getElementById('p2').value;
  document.getElementById('spanP2').innerHTML=st;
}

////////////////////////////////////////////////////////////////////////////

//INSERT IMAGE INTO DISK

///////////////////////////////////////////////////////////////////////////
$('.images').click("bind", function (event) {
  event.preventDefault();
  let value= $(this).data('value');
  let imgSource=  $(this).data('src');
  let disks= getDisksWithValue(value);
  for (var i = 0; i < disks.length; i++) {
    let newImage= new Image();
    newImage.src= imgSource;
    disks[i].image= newImage;
  }
  disks[disks.length-1].onload= updateDiskPosition();
})

function getDisksWithValue(value) {
  let disks= [];
  for (var i = 0; i < diskCollection.length; i++) {
    if(diskCollection[i].color==value){
      disks.push(diskCollection[i]);
    }
  }
  return disks;
}

$('.clear').click("bind", function (event) {
  event.preventDefault();
  let value= $(this).data('value');
  let disks= getDisksWithValue(value);
  for (var i = 0; i < disks.length; i++) {
    disks[i].image=null;
  }
  updateDiskPosition();
})
/////////////////////////////////////////////////////////////////////////////

//DRAWING PLAYER´S DISKS

////////////////////////////////////////////////////////////////////////////
function assignDisksToPlayer(player) {
  //pasar a clase Juego
    let ini_X;
    let ini_Y= 265;
    let pointer_X;
    let color_player;
    (player==1)? ini_X=50 : ini_X=586;
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


function updateDiskPosition() {
  //pasar a clase disk
  ctx.fillStyle= "orange";
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
  event.preventDefault();
  let cut= false;
  let i=0;
  while (!cut && i<diskCollection.length) {
    if(clickOverDisk(diskCollection[i], event)  && diskCollection[i].color==turn && diskCollection[i].assigned==false){
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

canvas.onmouseleave = function () {
  if(currentDisk!=null){
    restoreDisk();
    currentDisk= null;
  }
}

document.getElementById('reset').onclick= function (event) {
  event.preventDefault();
  diskCollection=[];
  gameBoard.createBoard(ctx,15);
  gameBoard.resetLockers();
  assignDisksToPlayer(1);
  assignDisksToPlayer(2);
  currentDisk= null;
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
  if(fourBelow()){ gameBoard.paintBelow(currentDisk);}
  else if(fourOnSides()){ gameBoard.paintSides(currentDisk)}
  else if (fourOnDiagonalRight()) {gameBoard.paintDiagonalRight(currentDisk)}
  else if (fourOnDiagonalLeft()) {gameBoard.paintDiagonalLeft(currentDisk)}
}

function fourOnDiagonalRight() {
  let x= currentDisk.locker.matX;
  let y= currentDisk.locker.matY;
  let value= currentDisk.color;
  let disksDiagonalRight=1;
  disksDiagonalRight += gameBoard.getLockersUpRight(x, y, value);
  disksDiagonalRight+= gameBoard.getLockersDownLeft(x, y, value);
  return (disksDiagonalRight>=4);
}

function fourOnDiagonalLeft() {
  let x= currentDisk.locker.matX;
  let y= currentDisk.locker.matY;
  let value= currentDisk.color;
  let disksDiagonalLeft=1;

  disksDiagonalLeft+= gameBoard.getLockersUpLeft(x, y, value);
  disksDiagonalLeft+= gameBoard.getLockersDownRight(x, y, value);


  return (disksDiagonalLeft>=4);
}

function fourOnSides() {
  let x= currentDisk.locker.matX;
  let y= currentDisk.locker.matY;
  let value= currentDisk.color;
  let disks=1;
  disks += gameBoard.getLockersOnRight(x, y, value);
  disks+= gameBoard.getLockersOnLeft(x, y, value);
  return (disks>=4);
}

function fourBelow() {
 let x= currentDisk.locker.matX;
 let y= currentDisk.locker.matY;

 let lockersBelow= gameBoard.getLockersBelow(x, y);
 let sum=1;
 for (var i = 0; i < lockersBelow.length; i++) {
   if(lockersBelow[i].value== currentDisk.color){
     sum++;
   }
   else{
     sum=1;
   }
 }
 return (sum>=4);
}

function changeTurn() {
  (turn==COLOR_P_ONE)? turn=COLOR_P_TWO : turn=COLOR_P_ONE;
}



})
