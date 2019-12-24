const run = ({sendMessage, message, messageText, db}) => {
	const channelId = message.channel.id;
	const tabooWords = findTabooWords(messageText, channelId, db);
	if (tabooWords.length) {
		makeTabooResponse(sendMessage, tabooWords);
		return true;
	} else {
		return false;
	}
}

const makeTabooResponse = (sendMessage, words) => {
	sendMessage(
		'Excuse me, but we do not use the word' +
		(words.length===1 ? ' ' : 's ') +
		makeWordList(words) +
		' in this channel.');
}

const makeWordList = (words) => {
	const uniqueWords = [...new Set(words.map(word => `"${word}"`))];
	if (uniqueWords.length === 1) {
		return uniqueWords[0];
	} else if (uniqueWords.length === 2) {
		return uniqueWords[0] + ' or ' + uniqueWords[1];
	} else {
		return uniqueWords.slice(0,-1).join(', ') + ', or ' + uniqueWords.slice(-1);
	}
}
		
const findTabooWords = (messageText, channelId, db) => {
	const tabooWords = getTabooWords(channelId, db);
	const messageWords = messageText.split(' ');
	return messageWords.filter(word =>
		tabooWords.some(tabooWord => 
			word.toLowerCase().includes(tabooWord.toLowerCase())
		)
	);
}

const getTabooWords = (channelId, db) => {
	try {
		return db.getData('/taboo/' + channelId);
	} catch (e) {
		return [];
	}
}


module.exports=run;
