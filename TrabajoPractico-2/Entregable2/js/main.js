document.addEventListener("DOMContentLoaded", function() {
  $('body').awesomeCursor('hand-o-up');
  $('body').css('cursor', '');

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
let player1= new Player("red", "player 1");
let player2= new Player("blue", "player 2");
let winPlay=null;

  gameBoard.createBoard(ctx,15);
  assignDisksToPlayer(1);
  assignDisksToPlayer(2);

document.getElementById('nameP1').onclick= function (event) {
  event.preventDefault();
  let inputData= document.getElementById('spanP1')
  let st= inputData.value;
  if(player1.name==st){
    document.getElementById("warningP1").innerHTML="<p>Sorry, you can´t</p>";
  }
  else if(st.length>=8 || st.length==0){
    document.getElementById("warningP1").innerHTML="<p>Too short or too long</p>";
  }
  else{
    document.getElementById('p1').innerHTML=st;
    inputData.value="";
    player1.name= st;
  }
  setTimeout(function () {
      document.getElementById("warningP1").innerHTML="";
  }, 2000);


}
document.getElementById('nameP2').onclick= function (event) {
  event.preventDefault();
  let inputData= document.getElementById('spanP2')
  let st= inputData.value;
  if(player1.name==st){
    document.getElementById("warningP2").innerHTML="<p>Sorry, you can´t</p>";
  }
  else if(st.length>=8 || st.length==0){
    document.getElementById("warningP2").innerHTML="<p>Too short or too long</p>";
  }
  else{
    document.getElementById('p2').innerHTML=st;
    inputData.value="";
    player1.name= st;
  }
  setTimeout(function () {
      document.getElementById("warningP2").innerHTML="";
  }, 2000);

}

////////////////////////////////////////////////////////////////////////////

//INSERT IMAGE INTO DISK

///////////////////////////////////////////////////////////////////////////
$('.images').click("bind", function (event) {
  event.preventDefault();
  let value= $(this).data('value');
  let imgSource=  $(this).data('src');
  if(canPickThatImg(value, imgSource)){
    (value=="red")? player1.image= imgSource : player2.image= imgSource;
    let disks= getDisksWithValue(value);
    for (var i = 0; i < disks.length; i++) {
      let newImage= new Image();
      newImage.src= imgSource;
      disks[i].image= newImage;
    }
    disks[disks.length-1].onload= updateDiskPosition();
  }
  else {
    let playerWarning;
    (value=="red")? playerWarning= "warningP1" : playerWarning="warningP2";
    document.getElementById(playerWarning).innerHTML="<p>Can´t pick that!</p>";

    setTimeout(function () {
        document.getElementById('warningP1').innerHTML="";
        document.getElementById('warningP2').innerHTML="";
    }, 2000);

  }

})

function canPickThatImg(value, src) {
  if((value=="red" && player2.image!=src)||(value=="green" && player1.image!=src )) return true;
  else return false;
}

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
  (value=="red")? player1.image=null : player2.image=null;
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
canvas.onmouseenter= function () {
  $('#canvas') .awesomeCursor('hand-o-up', {
    color: 'black',
    size: 24,
    hotspot: "center"
  });
}
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
        if(winner()){ setWinner()}
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
  $('body').css('cursor', '');
}

function reset(event) {
  diskCollection=[];
  gameBoard.createBoard(ctx,15);
  gameBoard.resetLockers();
  assignDisksToPlayer(1);
  assignDisksToPlayer(2);
  currentDisk= null;
}
document.getElementById('reset').onclick= reset;

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
  if(fourBelow()){
    winPlay="Four Verticaly";
    return true;
  }
  else if(fourOnSides()){
    winPlay= "Four Horizontaly";
    return true;
  }
  else if(fourOnDiagonalLeft()){
    winPlay="Four on Diagonal Left";
    return true;
  }
  else if(fourOnDiagonalRight()){
    winPlay="Four on Diagonal Right";
    return true;
  }
  else {
    return false;
  }
  // if(fourBelow() || fourOnSides() || fourOnDiagonalLeft() || fourOnDiagonalRight()){
  //   return true
  // }
  // else{
  //    return false;
  // }
}



function setWinner() {
  let winner=null;
  if (currentDisk.color=="red"){
    winner=player1;
    player1.wins+=1;
    document.getElementById('contadorP1-js').innerHTML= player1.wins;
  }
  else{
    winner=player2;
    player2.wins+=1;
    document.getElementById('contadorP2-js').innerHTML= player2.wins;
  }

    let modal= document.getElementById('modalWin');
    modal.style.display= "block";
    let modalContent= document.getElementsByClassName('modal-content')[0];
    modalContent.innerHTML= "<p>Player: "+winner.name+" wins with: "+winPlay+"</p>";
  setTimeout(function () {
      document.getElementById('modalWin').style.display= "none";
      reset();
  }, 3500);


}
function remarkWinner(winner) {
  console.log("entre");
  console.log(winner);
  let elem= null;
  if (winner.color=="red"){
     elem=document.getElementById('p1');
  }
  else{
     elem=document.getElementById('p2');
  }
  elem.classList.toggle("remarked");
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
