document.addEventListener('DOMContentLoaded', function(e) {

let canvas= document.getElementById('canvas');
let ctx= canvas.getContext("2d");
let image = new Image();
image.src= "img.jpeg";
image.onload= function () {
  let rect1= new Rectangle(100,50,50,60,"rgb(131, 16, 1)" );
  rect1.draw(ctx, this);
}


// let circle1= new Circle(4,4,10, "rgb(219, 53, 179)")
// circle1.draw(ctx);
let click= document.onclick= function (event) {

  console.log(event.pageX);
  console.log(event.pageY);

}




});
