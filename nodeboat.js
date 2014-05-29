var util = require('util'),
    twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'tYvHZBeVyiL3WOcY7R0Zebaf6',
    consumer_secret: 'HgVxvnHfGpDpIwVI9gHgnmIGd0C0nWkIEf3pcNkKzXHAOKO0dA',
    access_token_key: '21208442-x9PGmACaEbbrxFZ06rQX3aT05D51DRsaW7pRee5oW',
    access_token_secret: 'rCyHc9NOFezLyiTW7LPN7MuFSPnivuDoPKGWZGYjvK85P'
});

twit.stream('statuses/filter', { follow: '2533213633' }, function(stream) {

	var okCommands = ['forward', 'reverse', 'left', 'right'];
    stream.on('data', function(data) {
    	var userCommands = data.text.split(','),
    		queue = [];

    	// for each user command, if it is in the okCommand array include it in the function call
    	for (var i = 0; i < userCommands.length; i += 1) {
    		var command = userCommands[i].trim();

    		if ( okCommands.indexOf(command) !== -1 ) {
    			queue.push(command)
    		}
    	};

    	// call function to execute array of commands
    	//runCommands(queue);
    	console.log(queue);
    });

});