const { logError } = require('../errorLogging.js');

const run = async ({sendMessage, message, messageText, db}) => {
	const channelId = message.channel.id;
	const tabooWords = await findTabooWords(messageText, channelId, db);
	if (tabooWords.length) {
		makeTabooResponse(sendMessage, tabooWords);
		return true;
	} else {
		return false;
	}
}

const makeTabooResponse = (sendMessage, words) => {
	const uniqueWords = [...new Set(words)];
	sendMessage(
		'Excuse me, but we do not use the word' +
		(uniqueWords.length===1 ? ' ' : 's ') +
		makeWordList(uniqueWords) +
		' in this channel.');
}

const makeWordList = (words) => {
	const quotedWords = words.map(word => `"${word}"`);
	if (quotedWords.length === 1) {
		return quotedWords[0];
	} else if (quotedWords.length === 2) {
		return quotedWords[0] + ' or ' + quotedWords[1];
	} else {
		return quotedWords.slice(0,-1).join(', ') + ', or ' + quotedWords.slice(-1);
	}
}
		
const findTabooWords = async (messageText, channelId, db) => {
	const tabooWords = await getTabooWords(channelId, db);
	const messageWords = messageText.split(' ');
	return messageWords.filter(word =>
		tabooWords.some(tabooWord => 
			word.toLowerCase().includes(tabooWord.toLowerCase())
		)
	);
}

const getTabooWords = async (channelId, db) => {
	try {
		return await db.getData('/taboo/' + channelId);
	} catch (e) {
		return [];
	}
}


module.exports=run;
