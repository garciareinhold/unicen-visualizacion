function Game() {

  this.gameBoard = new GameBoard(280, 130, 232, 204, "blue");
  this.diskCollection = [];
  this.currentDisk = null;
  this.beginX = 0;
  this.beginY = 0;
  this.turn = "red";
  this.player1 = new Player("red", "player 1");
  this.player2 = new Player("blue", "player 2");
  this.winPlay = null;

}

Game.prototype.begin = function(ctx) {
  this.gameBoard.createBoard(ctx, 15);
  this.assignDisksToPlayer(1, ctx);
  this.assignDisksToPlayer(2, ctx);
};

Game.prototype.changeNameP1 = function() {
  let inputData = document.getElementById('spanP1');
  let st = inputData.value;
  if (this.player2.name == st) {
    document.getElementById("warningP1").innerHTML = "<p>Sorry, you can´t</p>";
  } else if (st.length >= 13 || st.length == 0 || st == " ") {
    document.getElementById("warningP1").innerHTML = "<p>Too short or too long</p>";
  } else {
    document.getElementById('p1').innerHTML = st;
    inputData.value = "";
    this.player1.name = st;
  }
  setTimeout(function() {
    document.getElementById("warningP1").innerHTML = "";
  }, 2000);
};

Game.prototype.changeNameP2 = function() {
  let inputData = document.getElementById('spanP2');
  let st = inputData.value;
  if (this.player1.name == st) {
    document.getElementById("warningP2").innerHTML = "<p>Sorry, you can´t</p>";
  } else if (st.length >= 13 || st.length == 0 || st == " ") {
    document.getElementById("warningP2").innerHTML = "<p>Too short or too long</p>";
  } else {
    document.getElementById('p2').innerHTML = st;
    inputData.value = "";
    this.player2.name = st;
  }
  setTimeout(function() {
    document.getElementById("warningP2").innerHTML = "";
  }, 2000);
};

Game.prototype.canPickThatImg = function(value, src) {
  if ((value == "red" && this.player2.image != src) || (value == "green" && this.player1.image != src))
    return true;
  else
    return false;
  }
;

Game.prototype.getDisksWithValue = function(value) {
  let disks = [];
  for (var i = 0; i < this.diskCollection.length; i++) {
    if (this.diskCollection[i].color == value) {
      disks.push(this.diskCollection[i]);
    }
  }
  return disks;
};

Game.prototype.assignDisksToPlayer = function(player, ctx) {
  let ini_X;
  let ini_Y = 265;
  let pointer_X;
  let color_player;
  (player == 1)
    ? ini_X = 50
    : ini_X = 586;
  (player == 2)
    ? color_player = "green"
    : color_player = "red";
  for (var i = 0; i < 42 / 14; i++) {
    pointer_X = ini_X;
    for (var j = 0; j < 42 / 6; j++) {
      let disk = new Disk(pointer_X, ini_Y, 13.75, color_player);
      disk.draw(ctx);
      this.diskCollection.push(disk);
      pointer_X += 23;
    }
    ini_Y += 23;
  }
};

Game.prototype.updateDiskPosition = function(ctx) {
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  this.gameBoard.refreshBoard(ctx)
  for (var i = 0; i < this.diskCollection.length; i++) {
    this.diskCollection[i].draw(ctx);
  }
};

Game.prototype.reset = function(ctx) {
  this.diskCollection = [];
  this.gameBoard.createBoard(ctx, 15);
  this.assignDisksToPlayer(1, ctx);
  this.assignDisksToPlayer(2, ctx);
  this.currentDisk = null;
  this.player1.image = null;
  this.player2.image = null;

};

Game.prototype.clickOverDisk = function(disk, event) {
  let dx = event.layerX - disk.posX;
  let dy = event.layerY - disk.posY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return (dist < disk.radio);
};

Game.prototype.winner = function() {
  if (this.fourBelow()) {
    this.winPlay = "Four Vertically";
    return true;
  } else if (this.fourOnSides()) {
    this.winPlay = "Four Horizontally";
    return true;
  } else if (this.fourOnDiagonalLeft()) {
    this.winPlay = "Four on Diagonal Left";
    return true;
  } else if (this.fourOnDiagonalRight()) {
    this.winPlay = "Four on Diagonal Right";
    return true;
  } else {
    return false;
  }
};

Game.prototype.setWinner = function(ctx) {
  let winner = null;
  if (this.currentDisk.color == "red") {
    winner = this.player1;
    this.player1.wins += 1;
    document.getElementById('contadorP1-js').innerHTML = this.player1.wins;
  } else {
    winner = this.player2;
    this.player2.wins += 1;
    document.getElementById('contadorP2-js').innerHTML = this.player2.wins;
  }
  let name= winner.name;
  let modal = document.getElementById('modalWin');
  modal.style.display = "block";
  let modalContent = document.getElementsByClassName('modal-content')[0];
  modalContent.innerHTML = "<p>" + name + " wins with " + this.winPlay + "</p>";
  setTimeout(function() {
    document.getElementById('modalWin').style.display = "none";
  }, 3000);
  this.reset(ctx);
};

Game.prototype.remarkWinner = function(winner) {
  let elem = null;
  if (winner.color == "red") {
    elem = document.getElementById('p1');
  } else {
    elem = document.getElementById('p2');
  }
  elem.classList.toggle("remarked");
};

Game.prototype.fourOnDiagonalRight = function() {
  let x = this.currentDisk.locker.matX;
  let y = this.currentDisk.locker.matY;
  let value = this.currentDisk.color;
  let disksDiagonalRight = 1;
  disksDiagonalRight += this.gameBoard.getLockersUpRight(x, y, value);
  disksDiagonalRight += this.gameBoard.getLockersDownLeft(x, y, value);
  return (disksDiagonalRight >= 4);
};

Game.prototype.fourOnDiagonalLeft = function() {
  let x = this.currentDisk.locker.matX;
  let y = this.currentDisk.locker.matY;
  let value = this.currentDisk.color;
  let disksDiagonalLeft = 1;

  disksDiagonalLeft += this.gameBoard.getLockersUpLeft(x, y, value);
  disksDiagonalLeft += this.gameBoard.getLockersDownRight(x, y, value);

  return (disksDiagonalLeft >= 4);
};

Game.prototype.fourOnSides = function() {
  let x = this.currentDisk.locker.matX;
  let y = this.currentDisk.locker.matY;
  let value = this.currentDisk.color;
  let disks = 1;
  disks += this.gameBoard.getLockersOnRight(x, y, value);
  disks += this.gameBoard.getLockersOnLeft(x, y, value);
  return (disks >= 4);
};

Game.prototype.fourBelow = function() {
  let x = this.currentDisk.locker.matX;
  let y = this.currentDisk.locker.matY;

  let lockersBelow = this.gameBoard.getLockersBelow(x, y);
  let sum = 1;
  for (var i = 0; i < lockersBelow.length; i++) {
    if (lockersBelow[i].value != this.currentDisk.color) {
      break;
    } else {
      sum++;
    }
  }
  return (sum >= 4);
};

Game.prototype.changeTurn = function() {
  if (this.turn == "red") {
    this.turn = "green";
    document.getElementById('p2').classList.add("remarked");
    document.getElementById('p1').classList.remove("remarked");
  } else {
    this.turn = "red";
    document.getElementById('p1').classList.add("remarked");
    document.getElementById('p2').classList.remove("remarked");
  }
};

Game.prototype.restoreDisk = function (ctx) {
  this.currentDisk.posX = this.currentDisk.originalPosX;
  this.currentDisk.posY = this.currentDisk.originalPosY;
  this.updateDiskPosition(ctx);
};
