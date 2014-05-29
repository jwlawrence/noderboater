var five = require("johnny-five");
var keypress = require("keypress");
var config = require('config');
var Spark = require("spark-io");

var board = new five.Board({
	io: new Spark(config.io2)
});

var directions = {
	45: 'straight',
	90: 'left',
	0: 'right'
};

board.on("ready", function() {
	var speed = 0;
	var dir = 45;
	var commandArray = ['forward','reverse'];
	var commandExecuting = false;

	var servo  = new five.Servo({
		pin : "D0"
	});
  
	var motor = new five.Motor({
		pins: {
			pwm: "A0",
			dir: "A1"
		}
	});
	
	var stop = function stop() {
		motor.reverse(0);
		motor.stop();
	};
	
	var move = function move() {
		if (speed < 0) {
			motor.forward(255+speed);
			console.log('Forward speed: ' + Math.abs(speed));
		} else if (speed > 0) {
			motor.reverse(speed);
			console.log('Backward speed: ' + speed);
		} else {
			stop();
			console.log('Speed: 0');
		}
		console.log('Directon: ' + directions[dir]);
	};
	
	var direction = function direction() {
		servo.to(dir);
		
		console.log('Directon: ' + directions[dir]);
	};
	
	var increase = function increase() {
		if (speed > -210) speed -= 70;
		move();
	};
	
	var decrease = function decrease() {
		if (speed < 210) speed += 70;
		move();
	};
	
	var nextCommand = function nextCommand() {
		if (commandExecuting) {
			stop();
			commandExecuting = false;
		}
	
		if (commandArray.length > 0) {
			var command = commandArray.shift();
			switch(command) {
				case 'forward':
					dir = 45;
					direction();
					speed = -210;
					move();
					commandExecuting = true;
					break;
				case 'reverse':
					dir = 45;
					direction();
					speed = -210;
					move();
					commandExecuting = true;
					break;
				case 'left':
					dir = 90;
					direction();
					speed = -210;
					move();
					commandExecuting = true;
					break;
				case 'right':
					dir = 0;
					direction();
					speed = -210;
					move();
					commandExecuting = true;
					break;
			}
		}
	};
	
	var addCommands = function addCommands(newCommands) {
		commandArray.concat(newCommands);
	};
	
	console.log("The board is ready");
	direction();

	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.setRawMode(true);
	
	process.stdin.on('keypress', function (ch, key) {
		if (!key) {
			return;
		} else if (key.name == 'q') {
			console.log('Quitting');
			stop();
			dir = 45;
			direction();
			process.exit();
		} else if (key.name == 'space') {
			console.log('Stopping');
			stop();
			dir = 45;
			direction();
		} else if (key.name == 'up') {
			increase();
		} else if (key.name == 'down') {
			decrease();
		} else if (key.name == 'left') {
			if (dir < 90) dir += 45;
			direction();
		} else if (key.name == 'right') {
			if (dir > 0) dir -= 45;
			direction();
		}
	});
	
	setInterval(function () {
		nextCommand()
	}, 2000);
});

keypress(process.stdin);