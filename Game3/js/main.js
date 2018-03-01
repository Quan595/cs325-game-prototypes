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

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render:render } );




    function preload() {

    game.load.image('ball', 'assets/yellow_ball.png', .5, .5);
    game.load.image('background', 'assets/star_field.jpg', 1, 1);
    game.load.image('ufo', 'assets/ufo.png', 1, 1);

	}

	var stars;
	var background;
	var ufo;
	var starCount;

	var score;
	var textCount;

	function create() {

	    //  Here we create a group, populate it with sprites, give them all a random velocity
	    //  and then check the group against itself for collision

	    background = game.add.sprite(0,0,'background');

	    var style = { font: "25px Verdana", fill: "#00ff00", align: "center" };
        textCount = game.add.text( 10, 10, "Stars Left: 100", style );
        textCount.anchor.setTo( 0.0, 0.0 );

        style = { font: "50px Verdana", fill: "#00ffff", align: "center" };
        score = game.add.text( 400, 300, "", style );
        score.anchor.setTo( 0.5, 0.5 );


	    ufo = game.add.sprite( game.world.width/2, game.world.height/2, 'ufo' );
		game.physics.enable( ufo, Phaser.Physics.ARCADE );
		ufo.body.collideWorldBounds = true;

	    stars = game.add.physicsGroup(Phaser.Physics.ARCADE);
	    
	    starCount = 100;

	    for (var i = 0; i < starCount; i++)
	    {
	        var s = stars.create(game.rnd.integerInRange(100, 700), game.rnd.integerInRange(100, 500), 'ball');
	        s.body.velocity.set(game.rnd.integerInRange(-250, 250), game.rnd.integerInRange(-250, 250));

	        s.body.onCollide = new Phaser.Signal();
	        s.body.onCollide.add(hitSprite, this);
	    }

	    stars.setAll('body.collideWorldBounds', true);
	    stars.setAll('body.bounce.x', 1);
	    stars.setAll('body.bounce.y', 1);
	}


	var scale = 1;

	function update() {

		//game.physics.arcade.collide(stars);
	    if(game.physics.arcade.collide(stars, ufo) )
	    {
	    	scale += .05;
	    	ufo.scale.setTo(scale, scale);
	    }

	    var cursors = game.input.keyboard.createCursorKeys();

        if (cursors.left.isDown)
        {
            //  Move to the left
            ufo.body.velocity.x = -200;
        }
        if (cursors.right.isDown)
        {
            //  Move to the right
            ufo.body.velocity.x = 200;
        }
        if (cursors.up.isDown)
        {
            //  Move to the top
            ufo.body.velocity.y = -200;
        }
        if (cursors.down.isDown)
        {
            //  Move to the bottom
            ufo.body.velocity.y = 200;
        }

        if(starCount == 0)
        {
        	score.text = "YOU WIN";
        	game.paused = true;
        }
	}


	function render() {

    	game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 550, 32);
	}

	function hitSprite (sprite1) {

	    sprite1.kill();
	    starCount -= 1;
	    textCount.text = "Stars Left: " + starCount;
	}
	
};
