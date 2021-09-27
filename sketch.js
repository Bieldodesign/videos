let img;
let msc,fft;
let canais;
let cam;
let reverb;

//terreninho
var col,lin;
var fly = 0;
var scl = 30;
var terreno = [] ;


function preload(){//carrega as texturas  e a musica
  img = loadImage('fundo1.PNG');
  msc = loadSound('nill.mp3'); 
  //msc = loadSound('lune.mp3');
}

function setup() {
    
  reverb = new p5.Reverb();
  reverb.process(msc, 3, 2);
  reverb.drywet(0.5);
  
  createCanvas(710, 400, WEBGL);
  canais = 64;
  //msc.play();//inicia a musica
  fft = new p5.FFT(0.99,canais);
  fft.setInput(msc);
  
  noStroke(); 
  ambientMaterial(250);//material da lateral
  perspective(PI / 3.0, width / height, 0.1, 5000);//perpectiva 'padrão'
  
  //terreninho
  let w = 1600;
  let h = 1600;
  
  col = w /scl;
  lin = h / scl;
  for(a=0;a<lin ;a++){
    terreno[a] = [];
  }
  
}
function draw() {
  randomSeed(99);
  background(0);
  let estrela = 0;
  lights();//iluminação 
  let constellation = fft.analyze();
  for(a=0; a<canais; a++){
    tx = constellation [a];
    estrela = estrela + tx;
    let y = -(tx^2)/1+tx*6;
    //let z = (a * 64)-32;
    let z = tan((frameCount*0.001))*random(0,2048)
    let x = 400-tx*1.55;
    let tam = map(tx,0,255,10,32);
    let cor = map(tx,0,255,30,1000);
    push();
    translate(-x,-y,z);
    fill(cor);
    sphere(tam);
    translate(x+400,-y/3,z);
    sphere(tam);
    pop();
  }
  let bliu = map(dist(mouseX,mouseY,height/2,width/2),0,height*width/4,1,100);//smoth na visão
  let camX = map (mouseX-(width/2) ,-width/2, width/2,-360*bliu,360*bliu);//variação camera X
  let camY = map (mouseY-(height/2) ,-height/2, height/2,-360*bliu,360*bliu);//variação cameraY
  
  //orbitControl();//camera livre
  
  //camera (0, 0, 2000 - ((height/2) / tan(PI/6)*frameCount*0.025), camX,camY,0,0,1,0);//camera no trilho
  
   camera (0,-200, 1100 -(height/2 + sin(frameCount*0.05)*(height/3)), camX,camY,0,0,1,0);//camera trilho vem e vai
  
  if (frameCount < 500){
    push()
    translate(0,-100,0);
    texture(img);//textura 'creditos'
    plane(200, 200); // Back wall  
    texture(0);// volta ao 'normal'
    pop();
  }
    for(b=0;b<200;b++){
    push();
    fill('WHITE');
    let t = b % canais;
translate(random(-2000,2000),random(-1000,1000),random(-1000,1000));
      sphere(map(constellation[t],0,255,10,32)); 
      pop();
  }
  
  fly -= 0.1;
   var yoff = fly;
   for(y=0;y<lin;y++){
     var xoff = 0;
    for(x=0;x<col;x++){
      terreno [x][y] = map(noise( xoff, yoff),0,1,-150,150);
      xoff += 0.2;
    }
     yoff += 0.2;
  }
  
  //terreninho 
  
  translate(-width,height/2);
  rotateX(PI/3);
  
  noFill();

  
  
  for(y=0;y<lin-1;y++){
    beginShape(TRIANGLE_STRIP)
    for(x=0;x<col;x++){
      vertex (x*scl,y*scl,terreno[x][y]);
      stroke(map(terreno[x][y],-150,150,0,255));
      vertex (x*scl,(y+1)*scl,terreno[x][y+1]);
      stroke(map(terreno[x][y],-150,150,0,255));
    }
    endShape();
  }
  
  fill(255);
  noStroke();
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
      let fs = fullscreen();
        fullscreen(!fs);
}
}

 function mousePressed() {
  if (msc.isPlaying()) {
    // .isPlaying() returns a boolean
    msc.stop();
    background(255, 0, 0);
  } else {
    msc.play();
    background(0, 255, 0);
  }
  }
  