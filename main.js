var game = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser02',
    {
        preload: preload,
        create: create,
        update: update
    }
);

var platforms, player, wheel1, wheel2, cursors, stars;
var score = 0;
var scoreText = {text: 0};

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('wheel', 'assets/wheel.png');

    game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
}

function create() {
    // We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    game.add.tileSprite(0, 0, game.width, game.height, 'sky');
    createPlatform();

    // The player and its settings
    player = game.add.sprite(32, game.height - 150, 'spaceship');

    // We need to enable physics on the player
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);

    // The wheel and its settings
    wheel1 = game.add.sprite(game.world.width * 0.333, game.world.height / 2, 'wheel');
    wheel1.anchor.setTo(0.5, 0.5);

    // The wheel and its settings
    wheel2 = game.add.sprite(game.world.width * 0.667, game.world.height / 2, 'wheel');
    wheel2.anchor.setTo(0.5, 0.5);

    cursors = game.input.keyboard.createCursorKeys();
    createStars();

    // An example text element
    scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#000' });

    // An example button
    button = game.add.button(game.world.width - 220, 20, 'button', actionOnClick, this, 2, 1, 0);

    button.onInputOver.add(over, this);
    button.onInputOut.add(out, this);
    button.onInputUp.add(up, this);
}

function up() {
    console.log('button up', arguments);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}

function actionOnClick() {
    background.visible = !background.visible;

}

function createStars() {
    stars = game.add.group();
    stars.enableBody = true;

    // Here we'll create 12 of them randomly placed
    for (var i = 0; i < 12; i++) {
        // Create a star inside of the 'stars' group
        var star = stars.create(50 + 700 * Math.random(), 20 + 500 * Math.random(), 'star');

        // This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function createPlatform() {
    // The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    // We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    // This stops it from falling away when you jump on it
    ground.body.immovable = true;
}

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    // Update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function update() {
    // Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0;

    if (cursors.left.isDown) {
        player.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown) {
        player.body.angularVelocity = 200;
    }

    if (cursors.up.isDown) {
        game.physics.arcade.velocityFromAngle(player.angle, 300, player.body.velocity);
    }

    wheel1.angle += 1;
    wheel2.angle += 1;
}