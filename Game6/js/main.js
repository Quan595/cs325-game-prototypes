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
		game.load.image('restartButton', 'assets/restartButton.png');
		game.load.image('highlight', 'assets/highlight.png');
		game.load.image('moved', 'assets/moved.png');
		game.load.image('die0', 'assets/die0.png');
		game.load.image('die1', 'assets/die1.png');
		game.load.image('die2', 'assets/die2.png');
		game.load.image('die3', 'assets/die3.png');
		game.load.image('die4', 'assets/die4.png');
		game.load.image('die5', 'assets/die5.png');
		game.load.image('die6', 'assets/die6.png');
	}

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

	let currentPlayer;
	let currentLane;
	let currentRoll;
	let currentRollNumber;
	let currentHop;
	let p1Score;
	let p2Score ;
	let p1Pieces;
	let p2Pieces;

	let turnNumber;

	let lane1; 
	let lane2;
	let lane3;

	let rollNumber;
	let go;

	let rollButton;
	let goButton;
	let restartButton;

	let xCord = [0,300,400,500];
	let yCord = [600,500,400,300,200,100,0]; 
	let points = [0,0,1,2,3,2,1];
	
	let highlight;
	let moved;
	let die;
	let dieList = [];

	function create() {
		
		currentPlayer = 1;
		currentLane = 0;
		currentRoll = 0;
		currentRollNumber = 0;
		currentHop = 0;
		p1Score = 0;
		p2Score = 0;
		p1Pieces = 5;
		p2Pieces = 5;
		turnNumber = 0;

		background = game.add.image(0,0,'gameboard');

		let style = { font: "25px Verdana", fill: "#000000", align: "center" };
		currentPlayerText = game.add.text(10, 10, "Current Player: 1", style);
        currentLaneText = game.add.text( 10, 40, "Lane: 0", style );
        roll1Text =  game.add.text( 10, 70, "1st Roll: 0", style );
        roll2Text =  game.add.text( 10, 100, "2nd Roll: 0", style );
        currentHopText = game.add.text(10, 130, "Current Hops: 0", style);

        p1ScoreText = game.add.text(670, 10, "P1 Score: 0", style);
        p2ScoreText = game.add.text(670, 40, "P2 Score: 0", style);

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

		rollButton = game.add.image(640, 620, 'rollButton');
		rollButton.inputEnabled = true;
		rollButton.events.onInputDown.add(roll);

		goButton = game.add.image(770, 620, 'goButton');
		goButton.inputEnabled = true;
		goButton.events.onInputDown.add(move);
		
		restartButton = game.add.image(700, 530, 'restartButton');
		restartButton.inputEnabled = false;
		restartButton.alpha = 0;
		restartButton.events.onInputDown.add(restartGame);
		
		highlight = game.add.image(0,0,'highlight');
		highlight.alpha = 0;
		
		moved = game.add.image(0,0,'moved');
		moved.alpha = 0;
		
		die = game.add.image(650, 300, 'die0');
		dieList[0] = die;
		die = game.add.image(650, 300, 'die1');
		dieList[1] = die;
		die = game.add.image(650, 300, 'die2');
		dieList[2] = die;
		die = game.add.image(650, 300, 'die3');
		dieList[3] = die;
		die = game.add.image(650, 300, 'die4');
		dieList[4] = die;
		die = game.add.image(650, 300, 'die5');
		dieList[5] = die;
		die = game.add.image(650, 300, 'die6');
		dieList[6] = die;
		
		game.world.bringToTop(dieList[0]);
	}

	function update() {

		if(turnNumber >= 10)
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
			
			restartButton.inputEnabled = true;
			restartButton.alpha = 1;
			game.world.bringToTop(dieList[0]);
		}
	}

	function lane1Click()
	{
		currentLane = 1;
		currentLaneText.text = "Lane: " + currentLane;
		
		highlight.x = xCord[1];
		highlight.y = yCord[0];
		highlight.alpha = 1;
	}
	function lane2Click()
	{
		currentLane = 2;
		currentLaneText.text = "Lane: " + currentLane;
		
		highlight.x = xCord[2];
		highlight.y = yCord[0];
		highlight.alpha = 1;
	}
	function lane3Click()
	{
		currentLane = 3;
		currentLaneText.text = "Lane: " + currentLane;
		
		highlight.x = xCord[3];
		highlight.y = yCord[0];
		highlight.alpha = 1;
	}


	function roll()
	{
		if(currentLane == 0)
		{
			currentRoll = 0;
		}
		else
		{
			moved.alpha = 0;
			
			if(currentRollNumber == 0)
			{
				currentRoll = game.rnd.integerInRange(1,6);
				roll1Text.text = "1st Roll: " + currentRoll;
				currentRollNumber = 1;
				currentHop = currentRoll;
				currentHopText.text = "Current Hops: " + currentHop;
			}
			else if(currentRollNumber == 1)
			{
				currentRoll = game.rnd.integerInRange(1,6);
				roll2Text.text = "2nd Roll: " + currentRoll;
				currentRollNumber = 2;
				currentHop = game.math.fuzzyCeil( (currentHop + currentRoll)/2 );
				currentHopText.text = "Current Hops: " + currentHop;		
			}
			
			game.world.bringToTop(dieList[currentHop]);
			game.world.bringToTop(highlight);
			highlight.y = yCord[currentHop];
			highlight.alpha = 1;
			
			if(board[currentLane][currentHop] != 0)
			{
				moved.x = xCord[currentLane];
				moved.y = yCord[currentHop+2];
				moved.alpha = 1;
				game.world.bringToTop(moved);
			}
		}
		
	}

	function move()
	{	
		if(currentLane != 0 && currentHop != 0)
		{
			moved.alpha = 0;
			
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
				if(currentHop >= 5)
				{
					if(currentPlayer == 1)
					{
						p1Score += 0;
					}
					else if(currentPlayer == 2)
					{
						p2Score += points[currentHop];
						p1Score -= points[currentHop];
					}
				}
				//pushing back
				else
				{
					if(currentPlayer == 1)
					{
						if(board[currentLane][currentHop+2] == 0)
						{
							p1Score += points[currentHop+2];
						}
						else if(board[currentLane][currentHop+2] == 1)
						{
							p1Score += 0;
						}
						else if(board[currentLane][currentHop+2] == 2)
						{
							p1Score += points[currentHop+2];
							p2Score -= points[currentHop+2];
						}
						
					}
					else if(currentPlayer == 2)
					{
						if(board[currentLane][currentHop+2] == 0)
						{
							p2Score += points[currentHop];
							p1Score -= points[currentHop];
							p1Score += points[currentHop+2];
						}
						else if(board[currentLane][currentHop+2] == 1)
						{
							p2Score += points[currentHop];
							p1Score -= points[currentHop];
						}
						else if(board[currentLane][currentHop+2] == 2)
						{
							p1Score -= points[currentHop];
							p2Score += points[currentHop];
							p2Score -= points[currentHop+2];
							p1Score += points[currentHop+2];
						}
					}
				}
				board[currentLane][currentHop+2] = 1
				game.add.image(xCord[currentLane], yCord[currentHop+2], 'blue');	
			}
			
			else if(board[currentLane][currentHop] == 2)
			{
				if(currentHop >= 5)
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
				//pushing back
				else
				{
					if(currentPlayer == 1)
					{
						if(board[currentLane][currentHop+2] == 0)
						{
							p1Score += points[currentHop];
							p2Score -= points[currentHop];
							p2Score += points[currentHop+2];
						}
						else if(board[currentLane][currentHop+2] == 1)
						{
							p2Score -= points[currentHop];
							p1Score += points[currentHop];
							p1Score -= points[currentHop+2];
							p2Score += points[currentHop+2];
						}
						else if(board[currentLane][currentHop+2] == 2)
						{
							p2Score -= points[currentHop];
							p1Score += points[currentHop];
						}
					}
					else if(currentPlayer == 2)
					{
						if(board[currentLane][currentHop+2] == 0)
						{
							p2Score += points[currentHop+2]
						}
						else if(board[currentLane][currentHop+2] == 1)
						{
							p1Score -= points[currentHop+2];
							p2Score += points[currentHop+2];
						}
						else if(board[currentLane][currentHop+2] == 2)
						{
							p1Score += 0;
						}
					}
				}
				board[currentLane][currentHop+2] = 2
				game.add.image(xCord[currentLane], yCord[currentHop+2], 'pink');
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
			roll1Text.text = "1st Roll: 0";// + currentRoll;
			roll2Text.text = "2nd Roll: 0";// + currentRoll;

			currentHop = 0
			currentHopText.text = "Current Hops: 0";// + currentHop;

			currentLane = 0;
			currentLaneText.text = "Lane: 0";// + currentLane;

			if(currentPlayer == 1 ) 
				{currentPlayer = 2;}
			else{currentPlayer = 1;}

			currentPlayerText.text = "Current Player: " + currentPlayer;

			turnNumber++;
			
			highlight.alpha = 0;
		}
	}
	
	function restartGame()
	{
		//turnNumber = 0;
		//currentPlayerText.text = "Current Player: 1";
		game.state.restart();
	}
};
