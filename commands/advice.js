const run = ({messageText, actions, db}) => {
	const { sendMessage } = actions;
	const tokens = messageText.split(' ');
	if (tokens.length === 1 && tokens[0] === 'advice') {
		getAdvice(sendMessage, db);
		return true;
	} else if (
		tokens.length > 0 &&
		(tokens[0] === 'advice-add' || tokens[0] === 'add-advice')
	) {
		putAdvice(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		tokens.length > 2 &&
		(
			tokens[0] === 'add' && tokens[1] === 'advice' ||
			tokens[0] === 'advice' && tokens[1] === 'add'
		)
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
		sendMessage('I have no advice at this time.');
	}
}

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

const putAdvice = (advice, sendMessage, db) => {
	db.push('/advice', [advice], false);
	sendMessage('Added advice: ' + advice);
}

module.exports=run;
