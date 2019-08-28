const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	if (tokens.length === 1 && tokens[0] === 'name') {
		getName(sendMessage, db);
		return true;
	} else if (
		tokens.length > 0 &&
		(tokens[0] === 'name-add' || tokens[0] === 'add-name')
	) {
		putName(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		tokens.length > 2 &&
		(
			tokens[0] === 'add' && tokens[1] === 'name' ||
			tokens[0] === 'name' && tokens[1] === 'add'
		)
	) {
		putName(tokens.slice(2).join(' '), sendMessage, db);
		return true;
	} else {
		return false;
	}
}

const getName = (sendMessage, db) => {
	try {
		const names = db.getData('/names');
		if (names && names.length > 0) {
			const i = getRandInt(names.length); 
			sendMessage(names[i]);
		} else {
			sendMessage('I don\'t know any names.');
		}
	} catch (e) {
		sendMessage('I don\'t know any names.');
	}
}

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

const putName = (name, sendMessage, db) => {
	db.push('/names', [name], false);
	sendMessage('Added name: ' + name);
}

module.exports=run;
