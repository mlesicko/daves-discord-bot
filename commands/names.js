const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	if (token0 === 'name') {
		getName(sendMessage, db);
		return true;
	} else if (token0 === 'name-add' || token0 === 'add-name') {
		putName(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		token0 === 'add' && token1 === 'name' ||
		token0 === 'name' && token1 === 'add'
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
