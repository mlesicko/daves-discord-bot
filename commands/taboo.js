const run = ({messageText, sendMessage, db, message, myId}) => {
	const tokens = messageText.split(' ');
	const channelId = message.channel.id;
	if (tokens.length === 1 && tokens[0] === 'taboo') {
		getTabooList(channelId, sendMessage, db);
		return true;
	} else if (
		tokens.length > 0 && (tokens[0] === 'taboo')
	) {
		addTaboo(channelId, sendMessage, db, tokens.slice(1));
		return true;
	} else if (
		tokens.length > 0 && (tokens[0] === 'untaboo')
	) {
		removeTaboo(channelId, sendMessage, db, tokens.slice(1));
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

const addTaboo = (channelId, sendMessage, db, words) => {
	try {
		sendMessage(
			words.join(' ') + 
			(words.length === 1 ? ' is ' : ' are ') +
			'taboo'
		);
		db.push('/taboo/' + channelId, words, false);
	} catch (e) {
		console.log(e);
		sendMessage('There was an error');
	}
}

const removeTaboo = (channelId, sendMessage, db, words) => {
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
		console.log(e);
		sendMessage('There was an error');
	}
}

module.exports=run;
