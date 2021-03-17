let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        width: 1280,
        height: 720
    },
    parent: 'game-container',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('background', 'img/background.png');
    this.load.image('ground', 'img/ground.png');
    this.load.image('logo1', 'img/mcdonalds_logo.png');
    this.load.image('logo2', 'img/vucko_logo.png');
    this.load.image('logo3', 'img/milky_logo.png');
    this.load.image('logo4', 'img/zmaj_logo.png');
    this.load.image('logo5', 'img/caribou_logo.png');
    this.load.image('logo6', 'img/metropolis_logo.png');
    this.load.image('logo7', 'img/mutvak_logo.png');

    this.load.spritesheet('runner',
        'img/runner.png', {
            frameWidth: 100,
            frameHeight: 130
        }
    );

    this.load.audio('fail', 'sound/fail.mp3');
    this.load.audio('collect', 'sound/collect.mp3');
    this.load.audio('run', 'sound/run.mp3');
    this.load.audio('jump', 'sound/jump.mp3');
}

let cursors;

let runner;
let logos;
let scoreText;
let score = 0;

let collectSound;
let failSound;
let runSound;
let jumpSound;

function create() {

    this.add.image(640, 360, 'background');

    let ground = this.physics.add.staticImage(640, 665, 'ground');

    runner = this.physics.add.sprite(100, 450, 'runner');
    runner.setBounce(0.2);
    runner.setCollideWorldBounds(true);

    this.physics.add.collider(runner, ground);
    ground.body.setOffset(0, 60);
    runner.body.setGravityY(1000);

    this.anims.create({
        key: 'stand',
        frames: this.anims.generateFrameNumbers('runner', {
            start: 0,
            end: 1
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('runner', {
            start: 2,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();


    logos = this.physics.add.group();
    this.physics.add.collider(logos, ground, gameOver, null, this);
    this.physics.add.overlap(runner, logos, collectLogo, null, this);

    releaseLogo(this);


    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: 'white'
    });

    scoreText.setDepth(1);


    collectSound = game.sound.add("collect");
    failSound = game.sound.add("fail");
    runSound = game.sound.add("run");
    jumpSound = game.sound.add("jump");

}

function collectLogo(runner, logo) {
    collectSound.play();
    score = score + 1;
    scoreText.setText('Score: ' + score);
    logo.disableBody(true, true);
}

let accelerationY = -250;

function releaseLogo(scene) {

    let x = Phaser.Math.Between(50, 1230);

    let logo = logos.create(x, -100, 'logo' +  Phaser.Math.Between(1, 7));
    runner.setBounce(0.2);
    logo.setCollideWorldBounds(true);
    logo.setVelocity(Phaser.Math.Between(-60, 60), 0);

    logo.setAccelerationY(accelerationY);
    accelerationY = accelerationY + 5;


    if (!isGameOver) {
        let delay = Phaser.Math.Between(800, 3000)
        let timer = scene.time.delayedCall(delay, releaseLogo, [scene], this);
    }
}

let isGameOver = false;

function gameOver() {
    if (runSound.isPlaying) {
            runSound.pause();
        } 
    failSound.play();
    this.physics.pause();
    runner.anims.play('stand');
    this.add.text(450, 300, 'GAME OVER', {
        fontSize: '72px',
        strokeThickness: 8,
        fill: 'black'
    });
    
    this.add.text(430, 370, 'Your score is: ' + score + ' orders.', {
        fontSize: '32px',
        strokeThickness: 4,
        fill: 'black'
    }); 
    isGameOver = true;
    
}

function update() {

    if (isGameOver) {
        return;
    }

    if (cursors.left.isDown) {
        runner.setVelocityX(-400);
        runner.flipX = true;
        runner.anims.play('run', true);
        if (!runSound.isPlaying && runner.body.touching.down) {
            runSound.play();
        } 
        
    } else if (cursors.right.isDown) {
        runner.setVelocityX(400);
        runner.flipX = false;
        runner.anims.play('run', true);
        if (!runSound.isPlaying && runner.body.touching.down) {
            runSound.play();
        } 
    } else {
        runner.setVelocityX(0);
        runner.anims.play('stand', true);
        runSound.pause();
    }

    if (cursors.up.isDown) {

        if (runner.body.touching.down) {
            runner.setVelocityY(-800);
            if (!jumpSound.isPlaying) {
            jumpSound.play();
            } 
        }
    }

    if (!runner.body.touching.down) {
        runner.setFrame(7);
    }

    if (runner.body.velocity.y > 0) {
        runner.setFrame(8);
       
    } 

}