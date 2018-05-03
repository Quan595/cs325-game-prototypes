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

    var game = new Phaser.Game( 1200, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {

    	game.load.image('ship', 'assets/ship.png');
    	game.load.image('bullet0', 'assets/bullet.png');
    	game.load.image('bullet1', 'assets/bullet1.png');
    	game.load.image('enemy', 'assets/yellow_ball.png');
    	game.load.image('beam', 'assets/beam2.png');
    	game.load.image('enemy2', 'assets/red_ball.png');
    	game.load.image('shield', 'assets/shield.png');

	}

	let ship;
	let shield;
	let bullets;

	let beam;
	
	let enemy;
	let enemies;

	let nEnemy;
	let nEnemies;

	let fireButton;

	let beamButton;
	let beamIsOn;

	let rapidFireButton;
	let rapidFireIsOn;

	let isInvulnerable;
	let invulnerableButton;
	let invulnerableIsOn;

	let rnd;

	let interval;

	let style;
	let score;

	let beamText;
	let rapidFireText;
	let invulnerableText;

	let kills;


	function create() {

		beamIsOn = 1;
		rapidFireIsOn = 1;
		invulnerableIsOn = 1;
		isInvulnerable = 0;

		kills = 0;

		game.stage.backgroundColor = "#a5f7ff";

		game.physics.startSystem(Phaser.Physics.ARCADE);

        style = { font: "20px Verdana", fill: "#00ff00", align: "center" };
        score = game.add.text( 10, 10, "Score: 0", style );
        beamText = game.add.text( 10, 40, "Beam", style );
        rapidFireText = game.add.text( 10, 70, "Rapid Fire", style );
        invulnerableText = game.add.text( 10, 100, "Invulnerale", style );

        shield = game.add.sprite( game.world.centerX-50, game.world.centerY-50, 'shield');
        shield.alpha = 0;
		game.physics.arcade.enable(shield);

		ship = game.add.sprite( game.world.centerX, game.world.centerY, 'ship');
		ship.anchor.setTo(.5, .5);
		game.physics.arcade.enable(ship);

		bullets = game.add.weapon(300, 'bullet0');
		bullets.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		bullets.bulletSpeed = 400;
		bullets.fireRate = 30;
		bullets.bulletAngleVariance = 5;
		bullets.trackSprite(ship, 15, 0, true);

		beam = game.add.weapon(100, 'beam');
		beam.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		beam.bulletSpeed = 1600;
		beam.fireRate = 1;
		beam.trackSprite(ship, 30, 0, true);

		enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);
		nEnemies = game.add.physicsGroup(Phaser.Physics.ARCADE);

		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		beamButton = this.input.keyboard.addKey(Phaser.KeyCode.Q);
		rapidFireButton = this.input.keyboard.addKey(Phaser.KeyCode.W);
		invulnerableButton = this.input.keyboard.addKey(Phaser.KeyCode.E);

		interval = 1000;
		game.time.events.add(interval, createEnemies, this);
	}

	function update() {

		ship.rotation = game.physics.arcade.angleToPointer(ship);
		beam.rotation = game.physics.arcade.angleToPointer(beam);

		game.physics.arcade.overlap(ship, enemies, ship_enemies, null, this);
		game.physics.arcade.overlap(shield, enemies, shield_enemies, null, this);

		game.physics.arcade.overlap(bullets.bullets, enemies, bullets_enemies, null, this);
		game.physics.arcade.overlap(beam.bullets, enemies, beam_enemies, null, this);

		game.physics.arcade.collide(enemies);
		game.physics.arcade.collide(nEnemies, enemies);

		if(fireButton.isDown)
		{
			bullets.fire();
		}
		if(beamButton.isDown && beamIsOn == 1)
		{
			beam.fire();
			game.time.events.add(1000, beamOff, this);

			beamText.text = "Beam";
			beamText.addColor('red', 0);
		}
		if(rapidFireButton.isDown && rapidFireIsOn == 1)
		{
			bullets.fireRate = 1;
			bullets.bulletAngleVariance = 20;
			game.time.events.add(6000, rapidFireOff, this);

			rapidFireText.text = "Rapid Fire";
			rapidFireText.addColor('red', 0);
		}
		if(invulnerableButton.isDown && invulnerableIsOn == 1)
		{
			isInvulnerable = 1;
			shield.alpha = 1;
			game.time.events.add(2000, invulnerableOff, this);

			invulnerableText.text = "Invulnerable";
			invulnerableText.addColor('red', 0);
		}
	}

	function createEnemies()
	{
		rnd = game.rnd.integerInRange(0,3);
    	if (rnd == 0) {
    		enemy = enemies.create(0, game.rnd.integerInRange(0,game.world.height), 'enemy');
    	}
    	else if (rnd == 1) {
    		enemy = enemies.create(game.world.width, game.rnd.integerInRange(0,game.world.height), 'enemy');
    	}
    	else if (rnd == 2) {
    		enemy = enemies.create(game.rnd.integerInRange(0,game.world.width), 0, 'enemy');
    	}
    	else {
    		enemy = enemies.create(game.rnd.integerInRange(0,game.world.width), game.world.height, 'enemy');
    	}
		
		enemy.scale.setTo(.7, .7);
		game.physics.arcade.enable(enemy);
		game.physics.arcade.moveToXY(enemy, game.world.centerX, game.world.centerY, game.rnd.integerInRange(80, 100));

		interval *= .96;
		if(interval < 17)
		{
			interval = 17;
		}
		game.time.events.add(interval+10, createEnemies, this);
	}

	function ship_enemies(ship, enemy)
	{
		enemy.destroy();
		if(isInvulnerable == 0)
		{
			game.paused = true;
		}
	}

	function bullets_enemies(bullet, enemy)
	{
		bullet.kill();
		enemy.destroy();
		kills += 1;
		score.text = "Score: " + kills ;
	}

	function beam_enemies(beam, enemy)
	{
		enemy.destroy();
		kills += 1;
		score.text = "Score: " + kills ;
	}

	function beamOff()
	{
		beamIsOn = 0;
		game.time.events.add(6000, beamOn, this);

		beamText.text = "Beam";
		beamText.addColor('orange', 0);
	}

	function beamOn()
	{
		beamIsOn = 1;

		beamText.text = "Beam";
		beamText.addColor('#00ff00', 0);
	}

	function rapidFireOff()
	{
		rapidFireIsOn = 0;
		bullets.fireRate = 40;
		bullets.bulletAngleVariance = 5;
		game.time.events.add(3000, rapidFireOn, this);

		rapidFireText.text = "Rapid Fire";
		rapidFireText.addColor('orange', 0);
	}

	function rapidFireOn()
	{
		rapidFireIsOn = 1;

		rapidFireText.text = "Rapid Fire";
		rapidFireText.addColor('#00ff00', 0);
	}

	function invulnerableOff()
	{
		invulnerableIsOn = 0;
		isInvulnerable = 0;
		shield.alpha = 0;
		game.time.events.add(10000, invulnerableOn, this);

		invulnerableText.text = "Invulnerale";
		invulnerableText.addColor('orange', 0);
	}

	function invulnerableOn()
	{
		invulnerableIsOn = 1;

		invulnerableText.text = "Invulnerale";
		invulnerableText.addColor('#00ff00', 0);
	}

	function shield_enemies(shield, enemy)
	{
		if(isInvulnerable == 1)
		{
			let vx = enemy.x + (enemy.x-ship.x);
			let vy = enemy.y + (enemy.y-ship.y);
			nEnemy = enemies.create( enemy.x, enemy.y, 'enemy2');
			nEnemy.scale.setTo(.7, .7);

			game.physics.arcade.enable(nEnemy);
			game.physics.arcade.moveToXY(nEnemy, vx, vy, game.rnd.integerInRange(80, 100));

			enemy.destroy();
		}
	}
};
