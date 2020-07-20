const { logError } = require('../errorLogging.js');

const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	if (
		tokens.length === 1 && token0 === 'mute' ||
		tokens.length === 2 && token0 === 'shut' && token1 === 'up'
	) {
		setMute(db, true);
		return true;
	} else if (
		tokens.length === 1 && token0 === 'unmute' ||
		tokens.length === 2 && token0 === 'speak' && token1 === 'up'
	) {
		setMute(db, false);
        sendMessage('I\'m here!');
		return true;
	} else {
		return false;
	}
}

const setMute = (db, value) => {
	db.push('/muted', value, false);
}

module.exports=run;
