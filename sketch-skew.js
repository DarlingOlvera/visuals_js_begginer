const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const Color = require('canvas-sketch-util/color');

const seed = random.getRandomSeed()

const settings = {
  dimensions: [ 1080, 1080 ], //dimensiones del sketch, 1080x1080 para post instagram
  animate: true,
  name: seed
};

//sketch tiene acceso a las mismas propiedades que la función de render (return)
const sketch = ({ context, width, height }) => {
  
  random.setSeed(seed) //seed para los valores random
  console.log(random.value());
  console.log(random.value());
  console.log(random.value());

  //initialized, se declaran dentro de la funcion sketch pero fuera 
  //del return porque solo necesitan ser declaradas una vez, no cada
  //vez que se renderice el sketch.

  let x,y,w,h, fill,stroke,blend;
  let shadowColor;
  const num = 40;
  const degrees = -30
  const rectangles = [];

  const colors = [
    random.pick(risoColors),
    random.pick(risoColors),
  ]

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius : width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  }

  for(let i = 0; i < num; i++){

    //medidas para los rectangulos
    x = random.range(0,width);
    y = random.range(0,height);
    w = random.range(600,width);
    h = random.range(40,200);

    fill = random.pick(colors).hex;
    stroke = random.pick(colors).hex;

    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

    rectangles.push({x,y,w,h, fill,stroke,blend})
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save(); //antes de un translate
    context.translate(mask.x, mask.y);

    drawPolygon({context, radius:mask.radius, sides: mask.sides});

    
    context.clip();

    rectangles.forEach(rect => {
      const {x,y,w,h, fill, stroke} = rect;
      context.save(); //guardar el estado actual
      context.translate(-mask.x,-mask.y);
      context.translate(x,y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;
      //context.strokeRect(x * -0.5,y * -0.5,w,h); una forma de dibujar el rectangulo
      
      context.globalCompositeOperation = blend;

      drawSkewedRect({context,w,h, degrees});
      shadowColor = Color.offsetHSL(fill,0,0,-20); //HSL mejor para sombra e iluminación de un mismo color base
      shadowColor.rgba[3] = 0.5;

      context.shadowColor =Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill();
      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();
      //despues del translate
      context.restore();
      
    });
      
   

    context.restore();

    //polygon outline
    context.save()
    context.translate(mask.x,mask.y)
    context.lineWidth = 20;
    drawPolygon({context, radius:mask.radius - context.lineWidth, sides: mask.sides});
    context.globalCompositeOperation = 'color-burn'
    context.strokeStyle = colors[0].hex;
    context.stroke();
    context.restore()
  };
};

//Función para dibujar un romboide
const drawSkewedRect = ({context,w = 600,h = 200,degrees = -45}) =>{
  //SkewedRect = rectangulo sesgado = romboide

  //un poco de trigonometria
  const angle = math.degToRad(degrees);

  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5,(ry + h) * -0.5);
  
  //otra forma de dibujar el rectangulo
  context.beginPath();
  context.moveTo(0,0); //moverse al punto deseado para empezar el trazo
  context.lineTo(rx,ry); //dibuja una linea del inicio al segundo punto
  context.lineTo(rx,ry + h);
  context.lineTo(0,h);
  context.closePath();
  //context.stroke();  //muestra los trazos en el canvas
  context.restore();
}

//Funcón para dibujar poligonos
const drawPolygon = ({context, radius = 100, sides = 3}) =>{
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for(let i = 1; i < sides; i++){
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta)*radius);
  }

  context.closePath();
}

//Llamar canvasSketch
canvasSketch(sketch, settings);
