$(document).ready(function() {


  let game= new Game();
  game.begin();

  $(document).on("keydown", function(event){
      game.plane.move(event);
  });

});
