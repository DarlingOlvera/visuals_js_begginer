const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1300, 1300 ],
  animate: true,
  fps: 60,
  
};

const sketch = ({ context, width, height }) => {

  //only runs once
  let x = 0;
  let y = 0;

  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  return ({ context, width, height, frame }) => {
    //inside here runs 60 fps

    if(frame > 800) return;
    x += 10;

    if(x > 1200){
      y += 240;
      x = 0;
    }

    context.fillStyle = (frame % 2) ? 'black' : 'white';
    context.strokeStyle = context.fillStyle;
    
    //set line with
    context.lineWidth = 10;

    //wall
    context.strokeRect(x + 75, y + 140,150,110);

    //door
    context.fillRect(x + 130, y + 190,40,60);

    //roof
    context.beginPath();
    context.moveTo(x + 50, y + 140);
    context.lineTo(x + 150, y + 60);
    context.lineTo(x + 250, y + 140);
    context.closePath();
    context.stroke();
    
  };
};

canvasSketch(sketch, settings);
