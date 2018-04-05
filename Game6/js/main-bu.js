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

    var game = new Phaser.Game( 1000, 1000, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render:render } );

    function preload() {

    game.load.image('ball', 'assets/yellow_ball.png', .5, .5);
    game.load.image('toxin', 'assets/wizball.png', .5, .5);
    game.load.image('bang', 'assets/orb-blue.png', .5, .5);
    game.load.image('background', 'assets/star_field.jpg', 1, 1);
    game.load.image('ufo', 'assets/ufo.png', 1, 1);

    game.load.audio('sfx', 'assets/fx_mixdown.ogg');
	
	}

	var background;

	var stars;
	var starCount;

	var toxins;
	var bang;
	var ufo;
	var scale;
	
	var score;
	var textCount;

	var fx;

	function create() {

	    //  Here we create a group, populate it with sprites, give them all a random velocity
	    //  and then check the group against itself for collision

	    background = game.add.sprite(0,0,'background');

	    var style = { font: "25px Verdana", fill: "#00ff00", align: "center" };
        textCount = game.add.text( 10, 10, "Stars Left: 100", style );
        textCount.anchor.setTo( 0.0, 0.0 );

        style = { font: "50px Verdana", fill: "#00ffff", align: "center" };
        score = game.add.text( 500, 500, "", style );
        score.anchor.setTo( 0.5, 0.5 );

        fx = game.add.audio('sfx');
	    fx.allowMultiple = true;
		fx.addMarker('ping', 10, 1.0);

	    ufo = game.add.sprite( game.world.width/2, game.world.height/2, 'ufo' );
		game.physics.enable( ufo, Phaser.Physics.ARCADE );
		ufo.body.collideWorldBounds = true;

	    stars = game.add.physicsGroup(Phaser.Physics.ARCADE);
	    starCount = 100;

	    for (var i = 0; i < starCount; i++)
	    {
	        var s = stars.create(game.rnd.integerInRange(0, 1000), game.rnd.integerInRange(0, 1000), 'ball');
	        s.body.velocity.set(game.rnd.integerInRange(-250, 250), game.rnd.integerInRange(-250, 250));
	    }

	    stars.setAll('body.collideWorldBounds', true);
	    stars.setAll('body.bounce.x', 1);
	    stars.setAll('body.bounce.y', 1);

	    toxins = game.add.physicsGroup(Phaser.Physics.ARCADE);
	    var rnd;
	    var a;
	    for(var i = 0; i < 10; i++)
	    {
	    	rnd = game.rnd.integerInRange(0,3);
	    	if (rnd == 0) {
	    		a = toxins.create(0, game.rnd.integerInRange(0,1000), 'toxin');
	    	}
	    	else if (rnd == 1) {
	    		a = toxins.create(1000, game.rnd.integerInRange(0,1000), 'toxin');
	    	}
	    	else if (rnd == 2) {
	    		a = toxins.create(game.rnd.integerInRange(0,1000), 0, 'toxin');
	    	}
	    	else {
	    		a = toxins.create(game.rnd.integerInRange(0,1000), 1000, 'toxin');
	    	}

	    	a.body.velocity.set(game.rnd.integerInRange(-250, 250), game.rnd.integerInRange(-250, 250));
	    	a.scale.setTo(.5, .5);
	    }

	    toxins.setAll('body.collideWorldBounds', true);
	    toxins.setAll('body.bounce.x', 1);
	    toxins.setAll('body.bounce.y', 1);

	    rnd = game.rnd.integerInRange(0,3);
    	if (rnd == 0) {
    		bang = game.add.sprite(0, game.rnd.integerInRange(0,1000), 'bang');
    	}
    	else if (rnd == 1) {
    		bang = game.add.sprite(1000, game.rnd.integerInRange(0,1000), 'bang');
    	}
    	else if (rnd == 2) {
    		bang = game.add.sprite(game.rnd.integerInRange(0,1000), 0, 'bang');
    	}
    	else {
    		bang = game.add.sprite(game.rnd.integerInRange(0,1000), 1000, 'bang');
    	}
		
		game.physics.enable( bang, Phaser.Physics.ARCADE);
    	bang.body.collideWorldBounds = true;
    	bang.body.velocity.set(game.rnd.integerInRange(-250, 250), game.rnd.integerInRange(-250, 250));
    	bang.body.bounce.x = 1;
    	bang.body.bounce.y = 1;

	}


	scale = 1;

	function update() {

		game.physics.arcade.collide(stars);

		game.physics.arcade.collide(stars, toxins);
		game.physics.arcade.collide(bang, toxins);
		game.physics.arcade.collide(bang, stars);

		game.physics.arcade.overlap(ufo, stars, collisionHandler1, null, this);
		game.physics.arcade.overlap(ufo, bang, collisionHandler2, null, this);

	    if(game.physics.arcade.collide(ufo, toxins) )
	    {
	    	if (scale > 1) {
	    		scale -= .1;
	    	}
	    	
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
        	score.text = "YOU'VE WON";
        	game.paused = true;
        }
	}


	function render() {

    	game.debug.text('Elapsed seconds: ' + this.game.time.totalElapsedSeconds(), 750, 32);
	}

	function collisionHandler1 (ufo, star) {

		fx.play('ping');
		star.kill();
		starCount -= 1;
	    textCount.text = "Stars Left: " + starCount;
		if (scale < 5) {
	    		scale += .05;
	    }

    	ufo.scale.setTo(scale, scale);
	}

	function collisionHandler2 (ufo, bang) {

		game.physics.arcade.collide(ufo, bang);
		starCount += 10;
		textCount.text = "Stars Left: " + starCount;
		for (var i = 0; i < 10; i++)
	    {
	        var s = stars.create(bang.x, bang.y , 'ball');
	        s.body.velocity.set(game.rnd.integerInRange(-250, 250), game.rnd.integerInRange(-250, 250));
	    }
	    stars.setAll('body.collideWorldBounds', true);
	    stars.setAll('body.bounce.x', 1);
	    stars.setAll('body.bounce.y', 1);
	}
};
