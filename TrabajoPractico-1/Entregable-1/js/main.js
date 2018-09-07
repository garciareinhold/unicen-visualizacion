document.addEventListener("DOMContentLoaded", function() {

//cursor patch, :(
  $('body').awesomeCursor('pencil', {
    hotspot: 'bottom left'
  });
  $('body').css('cursor', '');



  let ctx = document.getElementById("canvas-js").getContext("2d");
  let btn_save = document.getElementById('savePicture-js');
  btn_save.onclick = savePicture;

  let btn_load = document.getElementById("loadPicture-js");
  btn_load.onchange = loadPicture;

  let imageData;


////////////////////////////////////////////////////////////////////////////////

  //SAVING/LOADING PICTURE

////////////////////////////////////////////////////////////////////////////////

  function savePicture() {

    let link_download = document.createElement('a');
    let url = ctx.canvas.toDataURL('image/png');
    link_download.href = url;
    link_download.download = 'tudai.png';
    let ev = document.createEvent('MouseEvents');
    ev.initEvent('click', true, false);
    link_download.dispatchEvent(ev);

  }

  //For loading pictures
  function loadPicture(event) {

    let image = new Image();
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
      image.src = event.target.result;
    }

    reader.readAsDataURL(file);
    image.crossOrigin = "anonymous";
    image.onload = function() {

      clear_draw_data();

      let canvas = document.getElementById("canvas-js");


      let w1= image.width;//imagen que insertas
      let h1= image.height;

      let w2= canvas.width;//canvas actual
      let h2= canvas.height;

      let a= w1/h1;

      if(w1>h1){
        canvas.setAttribute("width", w2);
        canvas.setAttribute("height", w2/a);
	       ctx.drawImage(image, 0, 0, w2, w2/a);
      }
       else{
         canvas.setAttribute("width", h2*a);
         canvas.setAttribute("height", h2);
	        ctx.drawImage(image, 0, 0, h2*a, h2);
      }



      imageData= ctx.getImageData(0, 0, this.width, this.height);
      bindFilters();

      //Restoring original image
      $('#restore').click(function (event) {
        event.preventDefault();
        ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        clear_draw_data();
      })
    }
  }

//Clearing canvas
  $('#clear').click(function (event) {
    event.preventDefault();
  let canvas= document.getElementById('canvas-js');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clear_draw_data();
  })


////////////////////////////////////////////////////////////////////////////////

  //BIND FILTERS

////////////////////////////////////////////////////////////////////////////////

  function bindFilters() {
    //basic filters...
    $('.filters-js').change( function(event) {
      event.preventDefault();
      let data = $(this).data("id");
      let value= null;
      runBasicFilter(data, value);
    })

    $('.brightness').click(function (event) {
      event.preventDefault();
      let data= "brightness";
      let value=  $(this).data("value");
      runBasicFilter(data, value);
    })

    //convolution filters...
    $('.filtersConvolute-js').change(function(event) {
      event.preventDefault();
      let data = $(this).data("id");
      let mat;
      switch (data) {
        case "box_blur":
            mat= [1/9,1/9,1/9,
                 1/9,1/9,1/9,
                 1/9,1/9,1/9];
          convolute(mat);
          break;
          case "sharpen":
              mat= [1,-2,1,
                   -2,5,-2,
                   1,-2,1];
            convolute(mat);
            break;
            case "focus":
                mat= [0,-1,0,
                     -1,5,-1,
                     0,-1,0];
              convolute(mat);
              break;
          case "edge_detection":
          //la primer parte del arreglo (9) es edge_vertical la segunda edge_horizontal
               mat= [-1,0,1,
                   -2,0,2,
                   -1,0,1,
                   -1,-2,-1,
                    0,0,0,
                    1,2,1]
            convolute(mat);
            break;
      }

    })
  }

////////////////////////////////////////////////////////////////////////////////

  //RUN BASIC FILTER
//all filters are applied over a copy of the original picture
////////////////////////////////////////////////////////////////////////////////

  function runBasicFilter(data, value) {

    clear_draw_data();


    let filter_choosen = null;

    switch (data) {
      case "negative":
        filter_choosen = filter_Negative;
        break;
      case "brightness":
        filter_choosen = filter_Brightness;
        break;
      case "grayscale":
        filter_choosen = filter_Grayscale;
        break;
      case "binarizacion":
        filter_choosen = filter_Binarizacion;
        break;
      case "sepia":
        filter_choosen = filter_Sepia;
        break;
    }

    let a = 255;
    let copy_image = getCopyImage(imageData);

    for (let i = 0; i < imageData.width; i++) {
      for (let j = 0; j < imageData.height; j++) {

        let index = (i + j * (imageData.width)) * 4;
        let r = getPixelRed(imageData, i, j);
        let g = getPixelGreen(imageData, i, j);
        let b = getPixelBlue(imageData, i, j);

        filter_choosen(copy_image, index, r, g, b, a, value);
      }
    }
    ctx.putImageData(copy_image, 0, 0);
  }


////////////////////////////////////////////////////////////////////////////////

//BASIC FILTERS

////////////////////////////////////////////////////////////////////////////////

  function filter_Negative(imageData, index, r, g, b, a, value) {
    imageData.data[index + 0] = 255 - r;
    imageData.data[index + 1] = 255 - g;
    imageData.data[index + 2] = 255 - b;
    imageData.data[index + 3] = a;
  }

  function filter_Grayscale(imageData, index, r, g, b, a, value) {
    let result = (r + g + b) / 3;
    imageData.data[index + 0] = result;
    imageData.data[index + 1] = result;
    imageData.data[index + 2] = result;
    imageData.data[index + 3] = a;
  }

  function filter_Binarizacion(imageData, index, r, g, b, a, value) {
    (r > 128)
      ? imageData.data[index + 0] = 255
      : imageData.data[index + 0] = 0;
    (g > 128)
      ? imageData.data[index + 1] = 255
      : imageData.data[index + 1] = 0;
    (b > 128)
      ? imageData.data[index + 2] = 255
      : imageData.data[index + 2] = 0;
    imageData.data[index + 3] = a;
  }

  function filter_Sepia(imageData, index, r, g, b, a, value) {
    imageData.data[index + 0] = (r * .393) + (g * .769) + (b * .189);
    imageData.data[index + 1] = (r * .349) + (g * .686) + (b * .168);
    imageData.data[index + 2] = (r * .272) + (g * .534) + (b * .131);
    imageData.data[index + 3] = a;
  }

  function filter_Brightness(imageData, index, r, g, b, a, value) {
    if (value>0){
      imageData.data[index + 0] = r + (r*value/100);
      imageData.data[index + 1] = g + (g*value/100);
      imageData.data[index + 2] = b + (b*value/100);
      imageData.data[index + 3] = a;
    }
    else {
      value= Math.abs(value);
      imageData.data[index + 0] = r - (r*value/100);
      imageData.data[index + 1] = g - (g*value/100);
      imageData.data[index + 2] = b - (b*value/100);
      imageData.data[index + 3] = a;
    }
  }



////////////////////////////////////////////////////////////////////////////////

//RUN CONVOLUTION FILTERS

////////////////////////////////////////////////////////////////////////////////

//Convolution with an average value of pixel colors.
/*function convolute(mat) {
  let a= 255;
  let copy_image= getCopyImage(imageData);

  for (var x = 0; x < imageData.width; x++) {
    for (var y = 0; y < imageData.height; y++) {
      let pixelUpLeft = (getPixelRed(imageData, x - 1, y - 1)+getPixelGreen(imageData, x - 1, y - 1)+getPixelBlue(imageData, x - 1, y - 1))/3;
      let pixelUpRight = (getPixelRed(imageData, x + 1, y - 1)+getPixelGreen(imageData, x + 1, y - 1)+getPixelBlue(imageData, x + 1, y - 1))/3;
      let pixelUp = (getPixelRed(imageData, x, y - 1)+getPixelGreen(imageData, x, y - 1)+getPixelBlue(imageData, x, y - 1))/3;
      let pixelDownLeft = (getPixelRed(imageData, x - 1, y + 1)+getPixelGreen(imageData, x - 1, y + 1)+getPixelBlue(imageData, x - 1, y + 1))/3;
      let pixelLeft = (getPixelRed(imageData, x - 1, y)+getPixelGreen(imageData, x - 1, y)+getPixelBlue(imageData, x - 1, y))/3;
      let pixelDownRight = (getPixelRed(imageData, x - 1, y + 1)+getPixelGreen(imageData, x - 1, y + 1)+getPixelBlue(imageData, x - 1, y + 1))/3;
      let pixelRight = (getPixelRed(imageData, x + 1, y)+getPixelGreen(imageData, x + 1, y)+getPixelBlue(imageData, x + 1, y))/3;
      let pixelDown = (getPixelRed(imageData, x, y + 1)+getPixelGreen(imageData, x, y + 1)+getPixelBlue(imageData, x, y + 1))/3;
      let originalPixel= (getPixelRed(imageData, x, y)+getPixelGreen(imageData, x, y)+getPixelBlue(imageData, x, y))/3;
      let imagePixels= [pixelUpLeft,pixelUp,pixelUpRight, pixelLeft, originalPixel, pixelRight, pixelDownLeft, pixelDown, pixelDownRight];
      let result=0;
      for (var i = 0; i < imagePixels.length; i++) {
         result+= imagePixels[i]* mat[i];
      }
      if(mat.length>imagePixels.length){
        for (var i = 0, j=9; i < imagePixels.length; i++, j++) {
           result+= imagePixels[i]* mat[j];
        }
      }
      let index = (x + y * (imageData.width)) * 4;
      copy_image.data[index+0]=result;
      copy_image.data[index+1]=result;
      copy_image.data[index+2]=result;
      copy_image.data[index+3]=a;
    }
  }
  ctx.putImageData(copy_image, 0, 0);
}*/

//Convolution with each color of the choosen pixel
function convolute(mat) {
  clear_draw_data();
  let a= 255;
  let copy_image= getCopyImage(imageData);

  for (var x = 0; x < imageData.width; x++) {
    for (var y = 0; y < imageData.height; y++) {
      let pixelUpLeft = getPixel(imageData, x - 1, y - 1);
      let pixelUpRight =getPixel(imageData, x + 1, y - 1);
      let pixelUp = getPixel(imageData, x, y - 1);
      let pixelDownLeft = getPixel(imageData, x - 1, y + 1);
      let pixelLeft = getPixel(imageData, x - 1, y);
      let pixelDownRight = getPixel(imageData, x - 1, y + 1);
      let pixelRight = getPixel(imageData, x + 1, y);
      let pixelDown = getPixel(imageData, x, y + 1);
      let originalPixel= getPixel(imageData, x, y);
      let imagePixels= [pixelUpLeft,pixelUp,pixelUpRight, pixelLeft, originalPixel, pixelRight, pixelDownLeft, pixelDown, pixelDownRight];
      let resultR=0;
      let resultG=0;
      let resultB=0;
      for (var i = 0; i < imagePixels.length; i++) {
        let pixel= imagePixels[i];
        resultR+= pixel.red* mat[i];
        resultG+= pixel.green* mat[i];
        resultB+= pixel.blue* mat[i];
      }
      if(mat.length>imagePixels.length){
        for (var i = 0, j=9; i < imagePixels.length; i++, j++) {
          let pixel= imagePixels[i];
          resultR+= pixel.red* mat[j];
          resultG+= pixel.green* mat[j];
          resultB+= pixel.blue* mat[j];
        }
      }
      let index = (x + y * (imageData.width)) * 4;
      copy_image.data[index+0]=resultR;
      copy_image.data[index+1]=resultG;
      copy_image.data[index+2]=resultB;
      copy_image.data[index+3]=a;
    }
  }
  ctx.putImageData(copy_image, 0, 0, 0, 0, imageData.width, imageData.height);
}


//Getting color value from pixel

  function getPixelRed(imageData, x, y) {
    let index = (x + y * (imageData.width)) * 4;
    return imageData.data[index + 0];
  }
  function getPixelGreen(imageData, x, y) {
    let index = (x + y * (imageData.width)) * 4;
    return imageData.data[index + 1];
  }
  function getPixelBlue(imageData, x, y) {
    let index = (x + y * (imageData.width)) * 4;
    return imageData.data[index + 2];
  }

//Getting a pixel with its color values

  function getPixel(imageData, x, y) {
    let index = (x + y * (imageData.width)) * 4;
    let pixel ={}
    let r= imageData.data[index + 0];
    let g= imageData.data[index + 1];
    let b= imageData.data[index + 2];
    pixel.red=r;
    pixel.green=g;
    pixel.blue=b;
    return pixel;
  }

// Getting a copy of the original imageData
  function getCopyImage(imageData) {
    let copy= ctx.createImageData(imageData.width, imageData.height);
    for (var x = 0; x < imageData.width; x++) {
      for (var y = 0; y < imageData.height; y++) {
        let r= getPixelRed(imageData, x, y);
        let g= getPixelGreen(imageData, x, y);
        let b= getPixelBlue(imageData, x, y);
        let index = (x + y * (imageData.width)) * 4;
        copy.data[index + 1] =r;
        copy.data[index + 2] =g;
        copy.data[index + 3] =b;
      }
      }
      return copy;
  }

////////////////////////////////////////////////////////////////////////////////

  //DRAW FUNCTIONS

////////////////////////////////////////////////////////////////////////////////

  let user_choice = {
    'isDrawing': false,
    'pencil': false,
    'pencil_size': $('input[name="pencil_size"]:checked').val(),
    'eraser': false,
    'eraser_size': $('input[name="eraser_size"]:checked').val(),
    'color': "rgb(0, 0, 0)"
  };

  let draw_data = {
    'clickCoordX': [],
    'clickCoordY': [],
    'drag': []
  }

  function clear_draw_data() {
    draw_data.clickCoordX = [];
    draw_data.clickCoordY = [];
    draw_data.drag = [];
  }

  $('input:radio[name=pencil_size]').change(function() {
    user_choice.pencil_size = this.value;
    let b=$(this).data("value");
    clear_draw_data();
    if(user_choice.pencil){
      $('body').awesomeCursor('pencil', {
        hotspot: 'bottom left',
        color: $('input[name="options"]:checked').data("id"),
        size: $(this).data("value")
      });
    }


  })
  $('input:radio[name=eraser_size]').change(function() {
    user_choice.eraser_size = this.value;
    clear_draw_data();
    if(user_choice.eraser){
      $('body').awesomeCursor('eraser', {
        hotspot: 'bottom left',
        size: $('input[name="eraser_size"]:checked').data("value")
      });
    }
  })

  $('#eraser').bind("click", function(event) {
    let eraserOn = user_choice.eraser;
    if (eraserOn) {
      user_choice.eraser = false;
      $('body').css('cursor', '');
    } else {
      user_choice.eraser = true;
      $('body').awesomeCursor('eraser', {
        hotspot: 'bottom left',
        size: $('input[name="eraser_size"]:checked').data("value")
      });
      user_choice.pencil = false;
    }
    clear_draw_data();
  })
  $('#pencil').bind("click", function(event) {
    let pencilOn = user_choice.pencil;
    if (pencilOn) {
      user_choice.pencil = false;
      $('body').css('cursor', '');

    } else {
      user_choice.pencil = true;
      $('body').awesomeCursor('pencil', {
        hotspot: 'bottom left',
        color: $('input[name="options"]:checked').data("id"),
        size: $('input[name="pencil_size"]:checked').data("value")
      });

      user_choice.eraser = false;
    }
    clear_draw_data();
  })

  $('.pencil_color').change(function(event){
    event.preventDefault();
    let data = $(this).data("id");
    user_choice.color= data;
    if(user_choice.pencil){
      $('body').awesomeCursor('pencil', {
        hotspot: 'bottom left',
        color: data,
        size: $('input[name="pencil_size"]:checked').data("value")
      });
    }
    clear_draw_data();

  })
  $('#canvas-js').mousedown(function(event) {
    let coordX = event.pageX - this.offsetLeft;
    var coordY = event.pageY - this.offsetTop;
    if (user_choice.pencil || user_choice.eraser) {
      user_choice.isDrawing = true;
      saveClick(coordX, coordY);
      draw();
    }
  });

  $('#canvas-js').mousemove(function(event) {
    if (user_choice.isDrawing) {
      let coordX = event.pageX - this.offsetLeft;
      var coordY = event.pageY - this.offsetTop;
      saveClick(coordX, coordY, true);
      draw();
    }
  });

  $('#canvas-js').mouseup(function(e) {
    user_choice.isDrawing = false;
  });

  $('#canvas-js').mouseleave(function(e) {
    user_choice.isDrawing = false;
  });

  function saveClick(x, y, isDragging) {
    draw_data.clickCoordX.push(x);
    draw_data.clickCoordY.push(y);
    draw_data.drag.push(isDragging);
  }

  function draw() {
    let color = user_choice.color;
    if (user_choice.pencil) {
      ctx.lineWidth = user_choice.pencil_size;
    } else if (user_choice.eraser) {
      color = "white";
      ctx.lineWidth = user_choice.eraser_size;
    }
    ctx.lineJoin = "round";
    for (var i = 0; i < draw_data.clickCoordX.length; i++) {
      ctx.beginPath();
      if (draw_data.drag[i] && i) {
        ctx.moveTo(draw_data.clickCoordX[i - 1], draw_data.clickCoordY[i - 1]);
      } else {
        ctx.moveTo(draw_data.clickCoordX[i] - 1, draw_data.clickCoordY[i]);
      }
      ctx.lineTo(draw_data.clickCoordX[i], draw_data.clickCoordY[i]);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

});
