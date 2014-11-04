var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

var platforms, player, wheel, cursors, stars;
var score = 0;
var scoreText = {text: 0};

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('wheel', 'assets/wheel.png');
}

function create() {
    // We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    game.add.sprite(0, 0, 'sky');

    createPlatform();

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'spaceship');

    // We need to enable physics on the player
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);

    // The wheel and its settings
    wheel = game.add.sprite(game.world.width / 2, game.world.height / 2, 'wheel');
    wheel.anchor.setTo(0.5, 0.5);

    cursors = game.input.keyboard.createCursorKeys();
    createStars();

    // var scoreText;
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
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

    wheel.angle += 1;
}