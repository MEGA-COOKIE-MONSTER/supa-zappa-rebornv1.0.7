var space, spaceImg
var spaceshipImg, player1
var enemyshipImg, enemyship, enemies,gameoverImg
var bullet, bullets, specBullets, specBulletAmmo, specBulletEarn, specBulletEarns, specBulletEarnImg
var score , lives, gamestate
var img1,img2,img3,img4,img5,img6,img7,img8,img9,img0, scorevar, numbers
var specBulletSound, gameoverSound, powerupSound

var r =0
// to preload assets
function preload(){
    spaceImg = loadImage("assets/space-bg.png")
    spaceshipImg = loadImage("assets/spaceship.png")
    enemyshipImg = loadImage("assets/enemyship.png")
    gameoverImg = loadImage("assets/go.png")
    specBulletEarnImg = loadImage("assets/ammo.png")
    img1 = loadImage("assets/1.png")
    img2 = loadImage("assets/2.png")
    img3 = loadImage("assets/3.png")
    img4 = loadImage("assets/4.png")
    img5 = loadImage("assets/5.png")
    img6 = loadImage("assets/6.png")
    img7 = loadImage("assets/7.png")
    img8 = loadImage("assets/8.png")
    img9 = loadImage("assets/9.png")
    img0 = loadImage("assets/10.png")
    powerupSound = loadSound("assets/powerupsound.mp3")
    specBulletSound = loadSound("assets/bulletsound.mp3")
    gameoverSound = loadSound("assets/gameoversound.mp3")
    
}

// to setup sprites
function setup(){
    createCanvas(675,630)
    player1 = createSprite(300, 300)
    player1.addImage(spaceshipImg)
    player1.scale = 0.125
    angleMode(DEGREES)
    bullets = createGroup()
    enemies = createGroup()
    specBullets= createGroup()
    specBulletEarns= createGroup()
    score = 0
    lives = 10
    specBulletAmmo = 5
    gamestate = "play"
    
    textSize(20)
    fill("yellow")
    
    numbers = [img0,img1, img2, img3,img4,img5,img6,img7,img8, img9]
  
}

// draw runs every frame-count
function draw(){
    background(spaceImg)
    if(gamestate == "play"){

        
        

        if(keyDown("W")){
            player1.x += 20*cos(player1.rotation - 90)
            player1.y += 20*sin(player1.rotation - 90)
        }
        if(keyDown("S")){
            player1.x -= 10*cos(player1.rotation - 90)
            player1.y -= 10*sin(player1.rotation - 90)
        }
        if(keyDown("A")){
            player1.rotation -= 10
        }
        if(keyDown("D")){
            player1.rotation += 10
        }
        if(keyWentDown("space")){
            bullet = createSprite(player1.x, player1.y, 20, 20)
            bullet.shapeColor = "yellow"
            var angle = player1.rotation - 90
            bullet.velocityY = 30 * sin(angle)
            bullet.velocityX =  30 * cos(angle)
            bullet.rotation = angle
            bullet.lifetime = 30
            bullets.add(bullet)
        }
        if(keyWentDown("F")&& specBulletAmmo > 0){
            specBulletSound.play()
        }
        if(keyWentDown("F") && specBulletAmmo > 0){
           
            var angle = player1.rotation - 90
            for(i = 0; i <= 365;i++){
                bullet = createSprite(player1.x, player1.y, 50, 50)
                bullet.shapeColor = rgb(0, 0, random(0, 255))
                
                bullet.velocityY = 50 * sin(angle*1+i)
                bullet.velocityX =  50 * cos(angle*1+i)

                bullet.rotation = angle*1+i
                bullet.lifetime = 10
                    
                specBullets.add(bullet )
                
            }

            specBulletAmmo --
        }

        checkInScreen(player1)
        checkInScreen(bullets)
        checkInScreen(specBullets)
    
        if(frameCount % 25 == 0){
            createEnemies()
        }
        if(frameCount % 500 == 0){
            var specBulletEarn = createSprite(random(50,625), random(50,605), 50,50)
            specBulletEarn.addImage(specBulletEarnImg)
            specBulletEarn.scale = 0.15
            specBulletEarn.lifetime = 90
            specBulletEarns.add(specBulletEarn)
        }
        
        
        if(player1.isTouching(specBulletEarns)){
            powerupSound.play()
            specBulletAmmo++
            specBulletEarns.destroyEach()
        }
        
        for(var i = 0; i < enemies.length ; i++){
            if(player1.isTouching(enemies[i])){
                lives--
                enemies[i].destroy()
                
                scorevar = createSprite(315,-50)
                scorevar.addImage(numbers[lives])
                scorevar.velocityY= 30
                scorevar.scale = 7
            }
            
        }

        for(var i = 0; i < enemies.length ; i++){
            for(var j = 0; j < bullets.length; j++){
                if(bullets.isTouching(enemies[i])){
                    score++
                    enemies[i].destroy()
                    bullets[j].destroy()
                }
            }
        }
        for(var i = 0; i < enemies.length ; i++){
            if(specBullets.isTouching(enemies[i])){
                score++ 
                enemies[i].destroy()
            }
        }
        
        if(lives == 0){
            player1.destroy()
            gamestate = "end"
            gameoverSound.play()
            gameoverSound.setVolume(0.1)
        }
    }
    if(gamestate == "end"){
        enemyship = createSprite(random(0,675),650)
        enemyship.addImage(enemyshipImg)
        enemyship.scale = 0.125

        enemyship.velocityY = -50
        var gameover = createSprite(300,300)
        gameover.addImage(gameoverImg)
        gameover.scale = 0.75
    }

    drawSprites()
    text("Score: " + score, 120,30)
    text("Lives: "+ lives, 290,30)
    text("Power Bullets: "+ specBulletAmmo, 440, 30)
    

}


function createEnemies(){
    enemyship = createSprite(random(0,675),650)
    enemyship.addImage(enemyshipImg)
    enemyship.scale = 0.125     

    var px = player1.x - enemyship.x
    var py = player1.y - enemyship.y

    var angleToPlayer = atan2(py, px)
    enemyship.rotation = angleToPlayer + 90

    enemyship.velocityX =cos(angleToPlayer)*15
    enemyship.velocityY = sin(angleToPlayer)*15
    enemyship.lifetime = 70

    enemies.add(enemyship)
}
 
function checkInScreen(entity){
    if(entity.x>710){
        entity.x = -40
    }if(entity.x<-40){
        entity.x = 710
    }if(entity.y>670){
        entity.y = -40
    }if(entity.y<-40){
        entity.y = 670
    }
}