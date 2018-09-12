document.addEventListener("DOMContentLoaded", function() {

let example= document.getElementById('example');
let container= document.getElementById('container');

example.addEventListener('click', function (event) {
  console.log(this);
  this.style.color= 'red';
})

example.addEventListener('drag', function (event) {
  this.style.color='yellow';
})

example.addEventListener('mouseenter', function (event) {
  this.style.color= "green";
})



})
