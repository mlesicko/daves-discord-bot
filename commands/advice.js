const {logError} = require('../errorLogging.js');

const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	if (tokens.length === 1 && token0 === 'advice') {
		getAdvice(sendMessage, db);
		return true;
	} else if (
		token0 === 'advice-add' || token0 === 'add-advice'
	) {
		putAdvice(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		token0 === 'add' && token1 === 'advice' ||
		token0 === 'advice' && token1 === 'add'
	) {
		putAdvice(tokens.slice(2).join(' '), sendMessage, db);
		return true;
	} else {
		return false;
	}
}

const getAdvice = (sendMessage, db) => {
	try {
		const advice = db.getData('/advice');
		if (advice && advice.length > 0) {
			const i = getRandInt(advice.length); 
			sendMessage(advice[i]);
		} else {
			sendMessage('I have no advice at this time.');
		}
	} catch (e) {
		logError(e);
		sendMessage('I have no advice at this time.');
	}
}

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

const putAdvice = (advice, sendMessage, db) => {
	db.push('/advice', [advice], false);
	sendMessage('Added advice: ' + advice);
}

module.exports=run;
