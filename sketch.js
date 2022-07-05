const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit,rope;
var fruit_con;
var backgroundImage, melonImage, rabbitImage1;
var rabbit,button,mute_button;
var blink,eat,sad;
var bgSound,sadSound,cutSound,eatingSound,airSound;
var balloon;

function preload() {
  backgroundImage = loadImage("background.png");
  melonImage = loadImage("melon.png");
  rabbitImage1 = loadImage("Rabbit-01.png");

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blink.playing = true;
  eat.playing = true;
  eat.looping = true;

  bgSound = loadSound("sound1.mp3");
  sadSound = loadSound("sad.wav");
  cutSound = loadSound("rope_cut.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");
}

function setup() {
  createCanvas(500,700);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  bgSound.play();
  bgSound.setVolume(0.5);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  ground = new Ground(200,680,600,20);

  rope = new Rope(7,{x:245,y:30});
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  rabbit = createSprite(250,600,100,100);
  rabbit.addAnimation("blinking",blink);
  rabbit.addAnimation("eating",eat);
  rabbit.addAnimation("crying",sad);
  rabbit.changeAnimation("blinking",blink);
  rabbit.scale = 0.2;

  button = createImg("cut_button.png");
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  balloon = createImg("balloon.png");
  balloon.position(10,250);
  balloon.size(150,100);
  balloon.mouseClicked(airblow);

  mute_button = createImg("mute.png");
  mute_button.position(450,20);
  mute_button.size(50,50);
  mute_button.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);
}

function draw() {
  background(51);
  image(backgroundImage,width/2,height/2,500,700);

  rope.show();

  imageMode(CENTER);

  if(fruit != null) {
    image(melonImage,fruit.position.x,fruit.position.y,50,50);
  }

  Engine.update(engine);
  
  ground.show();

  if(collide(fruit,rabbit) == true) {
    rabbit.changeAnimation("eating");
    eatingSound.play();
  }

  if(collide(fruit,ground.body) == true) {
    rabbit.changeAnimation("crying");
    sadSound.play();
  }

  drawSprites();
}

function drop() {
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutSound.play();
}

function collide(body,sprite) {
  if(body != null) {
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d <= 80) {
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function airblow() {
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.08,y:0});
  airSound.play();
}

function mute() {
  if(bgSound.isPlaying()) {
    bgSound.stop();
  } else {
    bgSound.play();
  }
}
