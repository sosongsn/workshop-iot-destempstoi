//Declaration of particules variables
//Snow variables
let snow = [];
let gravity;
let zOff = 0;
let spritesheet;
let textures = [];

//Leaves variables
let feuille = [];
let gravity2;
let zOff2 = 0;
let spritesheet2;
let textures2 = [];

//Spot variables
let tache = [];
let gravity3;
let zOff3 = 0;
let spritesheet3;
let textures3 = [];

//Create a variable to control the opacity of the screen
let sliderOpacity;

//Create background variables 
let listImgs = [];
let indexImg = 0;
let bg;

//Declaration of songs variables
let song ;
let listSongs = ['alice.ogg', 'fantaisy.ogg', 'foret.ogg', 'oiseau.ogg', 'piano.ogg', 'glass.ogg', 'pluie.ogg', 'zelda.ogg'];
let indexSong = 0;
let previousSongIndex = 0;
let mesSons = [];
let jeVeuxDuSon = false;

//Create a variable to control the song volume
let slider ;

//Steps
// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 0;
// Where are we now and where were we?
let current;
let previous;

//Activation
let onNeige = false;
let onFeuille = false;
let onTache = false;


function preload() {
  spritesheet = loadImage('flakes32.png');
  spritesheet2 = loadImage('feuille1.png');
  spritesheet3 = loadImage('tache.png');

  listImgs = [loadImage("/libraries/img/enneige.jpg"), loadImage("/libraries/img/foret.jpg"), loadImage("/libraries/img/sombre.jpg")];

  song = loadSound('libraries/son/piano.mp3');

  for (let index = 0; index < listSongs.length; index++) 
  {
    mesSons[index] = loadSound('/libraries/son/' + listSongs[index]);
  }
  console.log(mesSons);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Bg img
  bg = listImgs[indexImg];

  slider = createSlider(0, 1, 0.5, 0.01);

  //Snow
  gravity = createVector(0, 0.3);
  for (let x = 0; x < spritesheet.width; x += 32) {
    for (let y = 0; y < spritesheet.height; y += 32) {
      let img = spritesheet.get(x, y, 32, 32);
      image(img, x, y);
      textures.push(img);
    }
  }

  for (let i = 0; i < 400; i++) {
    let x = random(width);
    let y = random(height);
    let design = random(textures);
    snow.push(new Snowflake(x, y, design));
  }

  //Leaves
  gravity2 = createVector(0, 0.3);
  for (let x = 0; x < spritesheet2.width; x += 32) {
    for (let y = 0; y < spritesheet2.height; y += 32) {
      let img = spritesheet2.get(x, y, 32, 32);
      image(img, x, y);
      textures2.push(img);
    }
  }

  for (let i = 0; i < 400; i++) {
    let x = random(width);
    let y = random(height);
    let design = random(textures2);
    feuille.push(new Snowflake(x, y, design));
  }

  //Spots
  gravity3 = createVector(0, 0.3);
  for (let x = 0; x < spritesheet3.width; x += 32) {
    for (let y = 0; y < spritesheet3.height; y += 32) {
      let img = spritesheet3.get(x, y, 32, 32);
      image(img, x, y);
      textures3.push(img);
    }
  }

  for (let i = 0; i < 400; i++) {
    let x = random(width);
    let y = random(height);
    let design = random(textures3);
    tache.push(new Snowflake(x, y, design));
  }

  //Steps
  current = createVector(0, 0);
  previous = createVector(0, 0);

  //SliderOpacity
  sliderOpacity = createSlider(0, 255, 127);
}

function draw() {
  background(bg);

  if (onNeige===true) {
    neige();
  }

  if (onFeuille===true) {
    leaves();
  }

  if (onTache===true) {
    spot();
  }

  //background opacity
  let backgroundOpacity = color(0, 0, 0, sliderOpacity.value());
  fill(backgroundOpacity);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
  sliderOpacity.position(50, 150);
  sliderOpacity.style("transform", "rotate(90deg)");

  if (jeVeuxDuSon==true) {

    if (!mesSons[indexSong].isPlaying())
    { 
      mesSons[previousSongIndex].stop();
      mesSons[indexSong].play();
    }
  } else
  {
    mesSons[previousSongIndex].stop();
    mesSons[indexSong].stop();
  }

  mesSons[indexSong].setVolume(slider.value());
  slider.position(50, 350);

  //Steps
  //If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0);

    // Add new particle
    paths[paths.length - 1].add(current, force);

    // Schedule next circle
    next = millis() + random(500);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for ( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

//Function neige
function neige() {
  //snow.push(new Snowflake());
  zOff += 0.1;

  for (var flake of snow) {
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    flake.applyForce(gravity);
    flake.applyForce(wind);
    flake.update();
    flake.render();
  }
}

//Function leaves
function leaves() {
  //snow.push(new Snowflake());
  zOff2 += 0.1;

  for (var flake of feuille) {
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff2) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    flake.applyForce(gravity2);
    flake.applyForce(wind);
    flake.update();
    flake.render();
  }
}

//Function spot
function spot() {
  //snow.push(new Snowflake());
  zOff3 += 0.1;

  for (var flake of tache) {
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff3) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(0.1);

    flake.applyForce(gravity3);
    flake.applyForce(wind);
    flake.update();
    flake.render();
  }
}

function keyTyped() {
  if (key === 'a') {
    onNeige = !onNeige;
  }

  if (key === 'z') {
    onFeuille = !onFeuille;
  }

  if (key === 'e') {
    onTache = !onTache;
  }

  if (key === "o") {
    jeVeuxDuSon = true;
  } 

  if (key === "p") {
    jeVeuxDuSon = false;
  }


  if (key === "x" ) {
    indexImg++ ;
    if (indexImg > listImgs.length-1) {
      indexImg=0;
    }
    bg = listImgs[indexImg];
  } 

  if (key === "w") {
    indexImg-- ;
    if (indexImg < 0) {
      indexImg=listImgs.length-1;
    }
    bg = listImgs[indexImg];
  }


  if (key === "q" ) {
    previousSongIndex = indexSong;
    indexSong++ ;
    if (indexSong > listSongs.length-1) {
      indexSong=0;
    }
    console.log (indexSong, previousSongIndex);
  } 

  if (key === "s") {
    previousSongIndex = indexSong;
    indexSong-- ;
    if (indexSong < 0) {
      indexSong=listSongs.length-1;
    }
    console.log (indexSong, previousSongIndex);
  }
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }

  // Display plath
  update() {  
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }  

  // Display plath
  display() {    
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
        // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }
  }
}

// Particles along the path
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 1;
    this.lifespan = 100;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan = this.lifespan-0.8;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    stroke(0, this.lifespan);
    fill(0, this.lifespan/2);    
    ellipse(this.position.x, this.position.y, 60, 20);
  }
}
