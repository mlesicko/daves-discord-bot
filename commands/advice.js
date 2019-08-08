const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const db = new JsonDB(new Config('data', true, true, '/'));

const run = (message, { sendMessage }) => {
	const tokens = message.split(' ');
	if (tokens.length === 1 && tokens[0] === 'advice') {
		getAdvice(sendMessage);
		return true;
	} else if (
		tokens.length > 0 &&
		(tokens[0] === 'advice-add' || tokens[0] === 'add-advice')
	) {
		putAdvice(tokens.slice(1).join(' '), sendMessage);
		return true;
	} else if (
		tokens.length > 2 &&
		(
			tokens[0] === 'add' && tokens[1] === 'advice' ||
			tokens[0] === 'advice' && tokens[1] === 'add'
		)
	) {
		putAdvice(tokens.slice(2).join(' '), sendMessage);
		return true;
	} else {
		return false;
	}
}

const getAdvice = (sendMessage) => {
	const advice = db.getData('/advice');
	if (advice && advice.length > 0) {
		const i = getRandInt(advice.length); 
		sendMessage(advice[i]);
	} else {
		sendMessage('I have no advice at this time.');
	}
}

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

const putAdvice = (advice, sendMessage) => {
	db.push('/advice', [advice], false);
	sendMessage('Added advice: ' + advice);
}

module.exports=run;
