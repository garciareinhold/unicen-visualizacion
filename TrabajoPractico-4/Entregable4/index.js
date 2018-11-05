$(document).ready(function() {
  let game;
  let score=[];
  $(".start-menu").css("z-index", 99999);


  $(document).on("keydown", function(event){
      if(game!=null){
        game.plane.move(event);

      }
  });

  $(".options-item").on("click", function(event){
    event.preventDefault();
    let option= $(this).data("id");
    switch (option) {
      case "difficulty":
        if($("#difficulty").val()=="NORMAL"){
          $("#difficulty").attr('value', "HARD");
        }
        else if ($("#difficulty").val()=="HARD") {
          $("#difficulty").attr('value', "EASY");        }
        else {
          $("#difficulty").attr('value', "NORMAL");        }
        break;

      case "music":
        if ($("#music").val()=="ON") {
          $("#music").attr('value', "OFF");
        }
        else {
          $("#music").attr('value', "ON");
        }
        break;

        case "sound-effect":
          if ($("#sound-effect").val()=="ON") {
            $("#sound-effect").attr('value', "OFF");
          }
          else {
            $("#sound-effect").attr('value', "ON");
          }
          break;
          default:
          $('.options').css("z-index", 99998);
          $(".start-menu").css("z-index", 99999);



    }
  })

  $('.menu-item').on("click", function(event){
    event.preventDefault();
    let option= $(this).data("id");
    switch (option) {
      case "play":
        play();
        break;
      case "options":
      options();
        break;
      case "hi-score":
        hiScore();
        break;
      default:
    }
  })

  function hiScore(){
    $(".start-menu").css("z-index", 99998);
    $('.hi-score').css("z-index", 99999);
  }

  function play() {
    $(".start-menu").css("z-index", 99998);
    $('.game-background').css("z-index", 99999);
    let optionsDifficulty= getOptionsDif();
    let optionsMusicSound= getOptionsMusicSound();
    let optionsUser= {
      "difficulty": optionsDifficulty,
      "music": optionsMusicSound
    }
    game= new Game();
    game.setOptionsUser(optionsUser);
    game.begin();
  }

  function options() {
      $('.options').css("z-index", 99999);
  }

  function getOptionsMusicSound() {
    let music= $("#music").val();
    let sound= $("#sound-effect").val();
    let optionsMusic= {
      "music": music,
      "sound": sound
    }
    return optionsMusic;
  }
  function getOptionsDif() {
    let difValue;
    let inscreaseDif;
    let enemiesVelocity;
    let difficulty= $("#difficulty").val();
    if (difficulty=="NORMAL"){
      difValue= 6000;
      increaseDif= 200;
      enemiesVelocity=6;
    }
    else if (difficulty=="HARD"){
      difValue= 4000;
      increaseDif= 300;
      enemiesVelocity=4;
    }
    else{
      difValue= 10000;
      increaseDif= 100;
      enemiesVelocity=8;
    }
    let options= {
      "difficulty" : difValue,
      "increase": increaseDif,
      "enemies": enemiesVelocity
    }
    return options;
  }

  $("#submit-score").on("click", function(event){
    event.preventDefault();
    let register= {
      "name": $("#namePlayer").val(),
      "points": $("#finalScore").val()
    }
    score.push(register);
    let orderScore= sortJSON(score, "points");

    let tbody= document.createElement("tbody");
    for (let i = 0; i < score.length; i++){
    let obj = score[i];
    let tr= document.createElement("tr");
    for (let key in obj){
        let attrName = key;
        let attrValue = obj[key];
        $(tr).append("<td>"+attrValue+"</td>");
    }
    $(tbody).append(tr);
}
  })

  function sortJSON(data, key) {
    return data.sort(function (a, b) {
        let x = a[key],
        y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
});
