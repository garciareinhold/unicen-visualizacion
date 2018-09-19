la idea para arrastrar::::

1--- método que dibuje la figura, lo llamo por cada cambio en on mousemove
2--- on mousedown--> if((fig.x < event.clientX) y (fig.width+fig.x >event.clientX) y(fig.y<event.clientY)y (fig.height+fig.y >event.clientY))
                        inicioY= event.clientY -  fig.y
                        inicioX= event.clientX - fig.x
                        figActual= fig
(tiene que buscar así por cada figura que haya)
3--- on mousemove--> if (figActual)
                        figActual.x= event.clientX-inicioX
                        figActual.y= event.clientY-inicioY

4--- on mouseup figActual=null


isclicked(x,y){

  nx= x-x0;
  ny= y-y0;
  d= math.sqrt(nx*nx + nY*nY);
  if (this.radio>d) return true;
  else return false;
}



si x, y esta dentro del width, height
