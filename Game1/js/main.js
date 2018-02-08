"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'ball', 'assets/ball.png' );
        game.load.image( 'sky', 'assets/sky.png');
        game.load.image( 'ground', 'assets/ground.png');

    }

    var ball;
    var sky;
    var platforms;
    var ground;
    var hitPlatform;
    var hole;

    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        sky = game.add.sprite(0, 0, 'sky');
        sky.scale.setTo(.9, .8);
        //sky.width = game.width;
        //sky.heigth = game.height;

        platforms = game.add.group();
        platforms.enableBody = true;

        hole = game.add.group();
        hole.enableBody = true;

        ground = platforms.create(0, game.world.height - 95, 'ground');
        ground.width = 600;
        //ground.scale.setTo(1.7, 1);
        ground.body.immovable = true;

        ground = platforms.create(630, game.world.height - 95, 'ground');
        ground.scale.setTo(1.7, 1);
        ground.body.immovable = true;

        ground = hole.create( 600 , game.world.height -50, 'ground');
        ground.body.immovable = true;

        ball = game.add.sprite( 100, game.world.height - 120, 'ball' );

        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( ball, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        ball.body.collideWorldBounds = true;
        ball.body.bounce.y = .2;
        ball.body.gravity.y = 300;
        ball.body.collieWorldBounds = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Golf", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.

        hitPlatform = game.physics.arcade.collide(ball, platforms);

        ball.body.velocity.x = 0;

        var cursors = game.input.keyboard.createCursorKeys();
        if (cursors.left.isDown)
        {
            //  Move to the left
            ball.body.velocity.x = -400;
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            ball.body.velocity.x = 400;
        }

        if(game.physics.arcade.collide(ball, hole))
        {
              ball.body.velocity.y = -1000;
        }

        //ball.rotation = game.physics.arcade.accelerateToPointer( ball, game.input.activePointer, 500, 500, 500 );
    }
};
