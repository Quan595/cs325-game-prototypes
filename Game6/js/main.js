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

    var game = new Phaser.Game( 900, 704, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {

    	game.load.image('gameboard', 'assets/gameboard.png');
    	game.load.image('blue', 'assets/bluecircle.png');
    	game.load.image('pink', 'assets/pinkcircle.png');
    	game.load.image('boundbox', 'assets/boundbox.png');
    	game.load.image('goButton', 'assets/goButton.png');
    	game.load.image('rollButton', 'assets/rollButton.png');

/*
    game.load.image('ball', 'assets/yellow_ball.png', .5, .5);
    game.load.image('toxin', 'assets/wizball.png', .5, .5);
    game.load.image('bang', 'assets/orb-blue.png', .5, .5);
    game.load.image('background', 'assets/star_field.jpg', 1, 1);
    game.load.image('ufo', 'assets/ufo.png', 1, 1);

    game.load.audio('sfx', 'assets/fx_mixdown.ogg');
*/	

	}


/*
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

	scale = 1;
*/

	let background;
	let currentPlayerText;
	let currentLaneText;
	let roll1Text;
	let roll2Text;
	let currentHopText;

	let p1ScoreText;
	let p2ScoreText;

	let positionText;

	let board;

	let currentPlayer = 1;
	let currentLane = 0;
	let currentRoll = 0;
	let currentRollNumber = 0;
	let currentHop = 0;
	let p1Score = 0;
	let p2Score = 0;
	let p1Pieces = 5;
	let p2Pieces = 5;

	let turnNumber = 0;
	
	let point0;
	let point1;
	let point2;
	let point3;

	let lane1; 
	let lane2
	let lane3;

	let rollNumber;
	let go;

	let rollButton;
	let goButton;

	let xCord = [0,300,400,500];
	let yCord = [0,500,400,300,200,100,0]; 
	let points = [0,0,1,2,3,2,1];

	function create() {

		background = game.add.image(0,0,'gameboard');

		let style = { font: "25px Verdana", fill: "#000000", align: "center" };
		currentPlayerText = game.add.text(10, 10, "Current Player: 1", style);
        currentLaneText = game.add.text( 10, 40, "Lane: 0", style );
        roll1Text =  game.add.text( 10, 70, "First Roll: 0", style );
        roll2Text =  game.add.text( 10, 100, "Second Roll: 0", style );
        currentHopText = game.add.text(10, 130, "Current Hops: 0", style);

        p1ScoreText = game.add.text(700, 10, "P1 Score: 0", style);
        p2ScoreText = game.add.text(700, 40, "P2 Score: 0", style);

        //positionText = game.add.text(10, 160, "Position: 0 0", style);

		//lanes
		lane1 = game.add.image(300, 600, 'boundbox');
		lane2 = game.add.image(400, 600, 'boundbox');
		lane3 = game.add.image(500, 600, 'boundbox');

		lane1.inputEnabled = true;
		lane2.inputEnabled = true;
		lane3.inputEnabled = true;

		lane1.events.onInputDown.add(lane1Click);
		lane2.events.onInputDown.add(lane2Click);
		lane3.events.onInputDown.add(lane3Click);

		lane1.alpha = 0;
		lane2.alpha = 0;
		lane3.alpha = 0;
		board = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ]; 

		rollButton = game.add.image(630, 600, 'rollButton');
		rollButton.inputEnabled = true;
		rollButton.events.onInputDown.add(roll);

		goButton = game.add.image(770, 600, 'goButton');
		goButton.inputEnabled = true;
		goButton.events.onInputDown.add(move);

	}

	function update() {

		if(turnNumber >= 4)
		{
			lane1.inputEnabled = false;
			lane2.inputEnabled = false;
			lane3.inputEnabled = false;
			rollButton.inputEnabled = false;
			goButton.inputEnabled = false;

			if(p1Score > p2Score)
			{
				currentPlayerText.text = "PLAYER 1 WINS!!!";
			}
			else if(p2Score > p1Score)
			{
				currentPlayerText.text = "PLAYER 2 WINS!!!";
			}
			else
			{
				currentPlayerText.text = "TIED";
			}

			game.paused = true;
		}
	}

	function lane1Click()
	{
		currentLane = 1;
		currentLaneText.text = "Lane: " + currentLane;
	}
	function lane2Click()
	{
		currentLane = 2;
		currentLaneText.text = "Lane: " + currentLane;
	}
	function lane3Click()
	{
		currentLane = 3;
		currentLaneText.text = "Lane: " + currentLane;
	}


	function roll()
	{
		if(currentLane == 0)
		{
			currentRoll = 0;
		}
		else
		{
			if(currentRollNumber == 0)
			{
				currentRoll = game.rnd.integerInRange(1,6);
				roll1Text.text = "First Roll: " + currentRoll;
				currentRollNumber = 1;
				currentHop = currentRoll;
				currentHopText.text = "Current Hops: " + currentHop;
			}
			else if(currentRollNumber == 1)
			{
				currentRoll = game.rnd.integerInRange(1,6);
				roll2Text.text = "Second Roll: " + currentRoll;
				currentRollNumber = 2;
				currentHop = game.math.fuzzyCeil( (currentHop + currentRoll)/2 );
				currentHopText.text = "Current Hops: " + currentHop;
			}
		}
	}

	function move()
	{
		if(currentLane != 0 && currentHop != 0)
		{
			if(board[currentLane][currentHop] == 0)
			{
				if(currentPlayer == 1)
				{
					p1Score += points[currentHop];
				}
				else if(currentPlayer == 2)
				{
					p2Score += points[currentHop];
				}
			}
			else if(board[currentLane][currentHop] == 1)
			{
				if(currentPlayer == 1)
				{
					p1Score += 0;;
				}
				else if(currentPlayer == 2)
				{
					p2Score += points[currentHop];
					p1Score -= points[currentHop];
				}
			}
			else if(board[currentLane][currentHop] == 2)
			{
				if(currentPlayer == 1)
				{
					p1Score += points[currentHop];
					p2Score -= points[currentHop];
				}
				else if(currentPlayer == 2)
				{
					p2Score += 0;
				}
			}

			board[currentLane][currentHop] = currentPlayer;	

			p1ScoreText.text = "P1 Score: " + p1Score;
			p2ScoreText.text = "P2 Score: " + p2Score;

			if(currentPlayer == 1)
				game.add.image(xCord[currentLane], yCord[currentHop], 'blue');
			else
				game.add.image(xCord[currentLane], yCord[currentHop], 'pink');


			//test
			//positionText.text = "Position: " + currentLane + ' ' + currentHop;


			currentRollNumber = 0;

			currentRoll = 0;
			roll1Text.text = "First Roll: 0";// + currentRoll;
			roll2Text.text = "Second Roll: 0";// + currentRoll;

			currentHop = 0
			currentHopText.text = "Current Hops: 0";// + currentHop;

			currentLane = 0;
			currentLaneText.text = "Lane: 0";// + currentLane;

			if(currentPlayer == 1 ) 
				{currentPlayer = 2;}
			else{currentPlayer = 1;}

			currentPlayerText.text = "Current Player: " + currentPlayer;

			turnNumber++;
		}
	}
};
