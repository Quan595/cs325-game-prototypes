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

    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {

    	game.load.image('ship', 'assets/ship.png');
    	game.load.image('bullet0', 'assets/bullet.png');
    	game.load.image('bullet1', 'assets/bullet1.png');
    	game.load.image('enemy', 'assets/yellow_ball.png');
    	game.load.image('beam', 'assets/beam.png');
	}

	let ship;
	let bullets;

	let beam;
	
	let enemy;
	let enemies;

	let fireButton;
	let beamButton;

	let rnd;

	let interval;


	function create() {

		game.physics.startSystem(Phaser.Physics.ARCADE);

		beam = game.add.sprite( game.world.centerX, game.world.centerY, 'beam');
		game.physics.arcade.enable(beam);
		beam.anchor.setTo(0, .5);
		

		ship = game.add.sprite( game.world.centerX, game.world.centerY, 'ship');
		ship.anchor.setTo(.5, .5);
		game.physics.arcade.enable(ship);

		bullets = game.add.weapon(100, 'bullet0');
		bullets.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		bullets.bulletSpeed = 500;
		bullets.fireRate = 5;
		bullets.trackSprite(ship, 15, 0, true);

		enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);

		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		interval = 1000;
		game.time.events.add(interval, createEnemies, this);
	}

	function update() {

		ship.rotation = game.physics.arcade.angleToPointer(ship);
		beam.rotation = game.physics.arcade.angleToPointer(beam);

		game.physics.arcade.overlap(ship, enemies, ship_enemies, null, this);
		game.physics.arcade.overlap(bullets.bullets, enemies, bullets_enemies, null, this);

		game.physics.arcade.overlap(beam, enemies, beam_enemies, null, this);

		game.physics.arcade.collide(enemies);

		if(fireButton.isDown)
		{
			bullets.fire();
		}
	}

	function createEnemies()
	{
		rnd = game.rnd.integerInRange(0,3);
    	if (rnd == 0) {
    		enemy = enemies.create(0, game.rnd.integerInRange(0,800), 'enemy');
    	}
    	else if (rnd == 1) {
    		enemy = enemies.create(800, game.rnd.integerInRange(0,800), 'enemy');
    	}
    	else if (rnd == 2) {
    		enemy = enemies.create(game.rnd.integerInRange(0,800), 0, 'enemy');
    	}
    	else {
    		enemy = enemies.create(game.rnd.integerInRange(0,800), 800, 'enemy');
    	}
		
		enemy.scale.setTo(.7, .7);
		game.physics.arcade.enable(enemy);
		game.physics.arcade.moveToXY(enemy, game.world.centerX, game.world.centerY, 100);

		interval *= .5;
		if(interval < 20)
		{
			interval = 20;
		}
		game.time.events.add(interval+10, createEnemies, this);
	}

	function ship_enemies(ship, enemy)
	{
		enemy.kill();
	}

	function bullets_enemies(bullet, enemy)
	{
		bullet.kill();
		enemy.kill();
	}

	function beam_enemies(beam, enemy)
	{
		enemy.kill();
	}
};
