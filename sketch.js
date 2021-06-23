const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var percy, pImg;
var ground, invisibleGround, gImg;

var fighting, pFighting;
var trident, tImg;

var coinGroup, coinImage;
var drachma;

var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var fury, hhound, hydra;

var score=0;
var point=0;

var gameOver, restart;
var goImg, rImg;

localStorage["HighestScore"] = 0;

function preload()
{

	pImg = loadImage("percy.png");
  gImg = loadImage("ground.png")

  fury = loadImage("fury.png")
  hhound = loadImage("hellhound.png")
  hydra = loadImage("hydra.png")

  drachma = loadImage("drachma.png")

  pFighting = loadImage("percy fighting.png")

  goImg = loadImage("gameover.png")
  rImg = loadImage("restart.png")
}

function setup() {
	canvas = createCanvas(windowWidth,windowHeight);
    engine = Engine.create();
	world = engine.world;

	//Create the Bodies Here.

  

	ground = createSprite(950,910,1900,20)
  ground.addImage(gImg); 
  ground.scale = 1.5

  invisibleGround = createSprite(950,860,7000,20);
  invisibleGround.visible = false;
 
   
  percy = createSprite(140,500,20,50)
  percy.addImage(pImg);
  percy.scale = 0.8
  percy.visible = true;

  percy.setCollider("rectangle",0,-10,200,300)


  fighting = createSprite(140,800,20,50);
  fighting.addImage(pFighting);
  fighting.scale = 0.8
  fighting.visible = false;
  
  fighting.setCollider("rectangle",0,-10,250,300)

    
  coinGroup = new Group();
  obstaclesGroup = new Group();
  obstaclesGroup.visible = true;

  gameOver = createSprite(950,400);
  gameOver.addImage(goImg);
  
  restart = createSprite(950,500);
  restart.addImage(rImg);
  restart.scale = 0.5

  gameOver.visible = false;
  restart.visible = false;

  point=0;

}


function draw() {
  rectMode(CENTER);
  background(204, 243, 255);
  
  textSize(15)
  text("Number of coins:" + score, 1700,70);
  text("Points:" + point, 1700, 90)
  text("Press 'space' to jump",100,80)
  text("Press 'f' to fight",100,100)
  textSize(19)
  text("Instructions",120,50)

  if (gameState===PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    point = point + Math.round(getFrameRate()/60);

    if(percy.isTouching(coinGroup)||(fighting.isTouching(coinGroup))){ 
      score = score + Math.round(getFrameRate()/60)
    }
    
    
      if(keyDown(70)){
       percy.visible = false;
       fighting.visible = true;
      } else {
      percy.visible = true;
      fighting.visible = false;
      }

    if(point <= 500){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
    
    if(keyDown("space") && percy.y >=  500) {
      percy.velocityY = -14
    }
    if(keyDown("space") && fighting.y >=  500) {
      fighting.velocityY = -14
    }
    
    percy.velocityY = percy.velocityY + 0.8
    fighting.velocityY = fighting.velocityY + 0.8

  
    
    if (ground.x < 400){
      ground.x = ground.width/2;
    }

   fighting.collide(invisibleGround);
   percy.collide(invisibleGround);


   if(percy.isTouching(obstaclesGroup)){
     gameState = END;
     } else if (fighting.isTouching(obstaclesGroup) && keyDown(70)){
      obstaclesGroup.destroyEach()
     } 

  }

  else if (gameState === END ) {

    gameOver.visible = true;
    restart.visible = true;
    coinGroup.depth= gameOver.depth
    fighting.depth = gameOver.depth + 1;
    obstaclesGroup.depth = gameOver.depth
    fighting.depth = gameOver.depth + 1;

    gameOver.depth = restart.depth;
   
    ground.velocityX = 0;
    percy.velocityY = 0;
    fighting.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);   
    coinGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
  }

  if(mousePressedOver(restart)) {
    reset();
  }

 spawnObstacles();
 spawnCoins();

 Engine.run(engine);
  drawSprites();
 
}

function spawnObstacles() {
  if(frameCount % 400 === 0) {
    var obstacle = createSprite(1900,760,10,40);

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(fury);
              obstacle.y = Math.round(random (400,600));
              obstacle.scale = 0.3;
              break;
      case 2: obstacle.addImage(hhound);
              obstacle.scale = 0.2;
              break;
      case 3: obstacle.addImage(hydra);
              obstacle.scale = 0.5;
              obstacle.y = 700
              break;
    }

    obstacle.velocityX = -(4 + score/100)
    console.log(rand)

    obstacle.lifetime = 475;

    obstacle.depth = percy.depth;
    percy.depth = percy.depth + 1;

    obstaclesGroup.add(obstacle);
  }
}

function spawnCoins() {

  if (frameCount % 150 === 0) {
    var coin = createSprite(1900,120,40,10);
    coin.y = Math.round(random(400,700));
    coin.addImage(drachma);
    coin.scale = 0.1;
    coin.velocityX = -4;

    coin.lifetime = 475;

    coin.depth = percy.depth;
    percy.depth = percy.depth + 1;

    percy.depth = fighting.depth
    fighting.depth = fighting.depth + 1;

    coinGroup.add(coin);
  }

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  point = 0;


} 