document.addEventListener("DOMContentLoaded", function() {



  $('body').awesomeCursor('hand-o-up');
  $('body').css('cursor', '');
  document.getElementById('p1').classList.add("remarked");

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext("2d");

  let game = new Game();
  game.begin(ctx);

  if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
       alert("La mayoría de las funcionalidades de Line Up 4 no funcionan en Mozilla, por favor use Chrome")
  }

  let nameP1 = document.getElementById('nameP1');
  nameP1.onclick =function () {
    game.changeNameP1();
  }

  let nameP2 = document.getElementById('nameP2');
  nameP2.onclick = function () {
    game.changeNameP2();
  }

  $('.images').click("bind", function(event) {
    event.preventDefault();
    let value = $(this).data('value');
    let imgSource = $(this).data('src');
    if (game.canPickThatImg(value, imgSource)) {
      (value == "red")
        ? game.player1.image = imgSource
        : game.player2.image = imgSource;
      let disks = game.getDisksWithValue(value);
      for (var i = 0; i < disks.length; i++) {
        let newImage = new Image();
        newImage.src = imgSource;
        disks[i].image = newImage;
      }
      disks[disks.length - 1].onload = game.updateDiskPosition(ctx);
    }
    else {
      let playerWarning;
      (value == "red")
        ? playerWarning = "warningP1"
        : playerWarning = "warningP2";
      document.getElementById(playerWarning).innerHTML = "<p>Can´t pick that one!</p>";

      setTimeout(function() {
        document.getElementById('warningP1').innerHTML = "";
        document.getElementById('warningP2').innerHTML = "";
      }, 2000);

    }
  })

    $('.clear').click("bind", function(event) {
      event.preventDefault();
      let value = $(this).data('value');
      (value == "red")
        ? game.player1.image = null
        : game.player2.image = null;
      let disks = game.getDisksWithValue(value);
      for (var i = 0; i < disks.length; i++) {
        disks[i].image = null;
      }
      game.updateDiskPosition(ctx);
    })

    canvas.onmouseenter = function() {
      $('#canvas').awesomeCursor('hand-o-up', {
        color: 'black',
        size: 24,
        hotspot: [10,4]  
      });
    }

    canvas.onmousedown = function(event) {
      event.preventDefault();
      let cut = false;
      let i = 0;
      while (!cut && i < game.diskCollection.length) {
        if (game.clickOverDisk(game.diskCollection[i], event) && game.diskCollection[i].color == game.turn && game.diskCollection[i].assigned == false) {
          game.currentDisk = game.diskCollection[i];
          game.currentDisk.originalPosX = game.currentDisk.posX;
          game.currentDisk.originalPosY = game.currentDisk.posY;
          game.beginX = event.layerX - game.diskCollection[i].posX;
          game.beginY = event.layerY - game.diskCollection[i].posY;
          cut = true;
        }
        i++;
      }
    }
    canvas.onmousemove = function(event) {
      if (game.currentDisk != null) {
        game.currentDisk.posX = event.layerX - game.beginX;
        game.currentDisk.posY = event.layerY - game.beginY;
        game.updateDiskPosition(ctx);
      }
    }
    canvas.onmouseup = function(event) {
      if (game.currentDisk != null) {
        if (game.gameBoard.isDropzone(event, game.currentDisk.radio) && !game.currentDisk.assigned) {
          let success = game.gameBoard.dropDisk(event, game.currentDisk);
          if (success) {
            game.updateDiskPosition(ctx);
            game.currentDisk.assigned = true;
            if (game.winner()) {
              game.setWinner(ctx);
            }
            game.changeTurn();
          } else {
            game.restoreDisk(ctx);
          }
        } else {
          game.restoreDisk(ctx);
        }
        game.currentDisk = null;
      }
    }

    canvas.onmouseleave = function() {
      if (game.currentDisk != null) {
        game.restoreDisk(ctx);
        game.currentDisk = null;
      }
      $('body').css('cursor', '');
    }

    document.getElementById('reset').onclick = function () {
      game.reset(ctx);
    }

  })
