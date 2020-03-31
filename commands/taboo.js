const run = ({messageText, sendMessage, db, message, myId, log}) => {
	const tokens = messageText.split(' ');
	const channelId = message.channel.id;
	const command = tokens.length > 0 && tokens[0].toLowerCase();
	if (tokens.length === 1 && command === 'taboo') {
		getTabooList(channelId, sendMessage, db);
		return true;
	} else if (command === 'taboo') {
		addTaboo(channelId, sendMessage, db, tokens.slice(1), log);
		return true;
	} else if (command === 'untaboo') {
		removeTaboo(channelId, sendMessage, db, tokens.slice(1), log);
		return true;
	} else {
		return false;
	}
}

const getTabooList = (channelId, sendMessage, db) => {
	try {
		const tabooWords = db.getData('/taboo/' + channelId);
		if (tabooWords.length === 0) {
			sendMessage('No words are currently taboo in this channel.');
		} else {
			sendMessage(
				'Taboo words in this channel: ' + 
				tabooWords.join(' ')
			);
		}
	} catch (e) {
		sendMessage('No words are currently taboo in this channel.');
	}
}

const addTaboo = (channelId, sendMessage, db, words, log) => {
	try {
		sendMessage(
			words.join(' ') + 
			(words.length === 1 ? ' is ' : ' are ') +
			'taboo'
		);
		db.push('/taboo/' + channelId, words, false);
	} catch (e) {
		log(e);
		sendMessage('There was an error');
	}
}

const removeTaboo = (channelId, sendMessage, db, words, log) => {
	try {
		sendMessage(
			words.join(' ') + 
			(words.length === 1 ? ' is ' : ' are ') +
			'no longer taboo'
		);
		const tabooWords = db.getData('/taboo/' + channelId);
		const newTabooWords = tabooWords.filter(word => !words.includes(word));
		db.push('/taboo/' + channelId, newTabooWords, true);
	} catch (e) {
		log(e);
		sendMessage('There was an error');
	}
}

module.exports=run;
