let canvas= document.getElementById('canvas');

canvas.onclick= function (event) {
  console.log(event.layerX);
  console.log(event.layerY);
}

let ctx= canvas.getContext("2d");

let gameBoard= new GameBoard(240, 240, 120, 120, "blue");
gameBoard.board(ctx);
gameBoard.lockers(ctx, 5);


//creacion fichas
let diskCollection= [];

function updateDisk() {
    for (var i = 0; i < diskCollection.length; i++) {
      cx.fillStyle = diskCollection[i].color;
      /*************************************************

      ACA QUEDÉ! tengo que hacer draggeable los disks,
      definir la dropzone del board y configurar las posiciones
      de los lockers de acuerdo a mi matriz board, tengo que hacer
      la matriz board en GameBoard

      ***************************************************/
      cx.fillRect(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height);
    }
}
let disk1= new Disk(100, 295, 5, "red");
let disk2= new Disk(115, 295, 5, "red");
disk1.draw(ctx);
disk2.draw(ctx);

diskCollection.push(disk1);
diskCollection.push(disk2);

cv.onmousedown = function(event){
  for (var i = 0; i < objetos.length; i++){
  if(objetos[i].x < event.clientX
  && (objetos[i].width + objetos[i].x > event.clientX)
  && objetos[i].y < event.clientY
  && (objetos[i].height + objetos[i].y > event.clientY)){
  objetoActual = objetos[i];
  inicioY = event.clientY - objetos[i].y;
  inicioX = event.clientX - objetos[i].x;
  break;
  }
  }
};
cv.onmousemove = function(event){
if(objetoActual != null){
  objetoActual.x = event.clientX - inicioX;
  objetoActual.y = event.clientY - inicioY;
  actualizar();
}

};
cv.onmouseup = function(event){

  objetoActual = null;
}
