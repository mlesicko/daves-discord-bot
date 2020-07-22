const { logError } = require('../errorLogging.js');

const run = ({channel, messageText, sendMessage, db, message, myId}) => {
	const tokens = messageText.split(' ');
	const command = tokens.length > 0 && tokens[0].toLowerCase();
	const channelId = channel.id;
	if (tokens.length === 1 && command === 'shame') {
		getShameList(channelId, sendMessage, db);
		return true;
	} else if (command === 'shame') {
		addShame(channelId, sendMessage, db, message, myId);
		return true;
	} else if (command === 'unshame') {
		removeShame(channelId, sendMessage, db, message, myId);
		return true;
	} else {
		return false;
	}
}

const getShameList = (channelId, sendMessage, db) => {
	try {
		const shamedUsers = db.getData('/shame/' + channelId);
		if (shamedUsers.length === 0) {
			sendMessage('No users are currently being shamed in this channel.');
		} else {
			sendMessage(
				'Shamed users in this channel: ' + 
				shamedUsers.map(user => user.username).join(' ')
			);
		}
	} catch (e) {
		logError(e);
		sendMessage('No users are currently being shamed in this channel.');
	}
}

const addShame = (channelId, sendMessage, db, message, myId) => {
	try {
		const usersToShame = message.mentions.users
			.filter(user => user.id !== myId)
			.map(user => ({
				id: user.id,
				username: user.username
			}));
		if (usersToShame.length > 0) {
			sendMessage(
				usersToShame.map(user => user.username).join(' ') + 
				(usersToShame.length === 1 ? ' has ' : ' have ') +
				'shame'
			);
			db.push('/shame/' + channelId, usersToShame, false);
		} else {
			sendMessage('I don\'t see a user to shame.');
		}
	} catch (e) {
		logError(e);
		sendMessage('There was an error');
	}
}

const removeShame = (channelId, sendMessage, db, message, myId) => {
	try {
		const usersToUnshame = message.mentions.users
			.filter(user => user.id !== myId)
			.map(user => ({
				id: user.id,
				username: user.username
			}));
		if (usersToUnshame.length > 0) {
			sendMessage(
				usersToUnshame.map(user => user.username).join(' ') + 
				(usersToUnshame.length === 1 ? ' has ' : ' have ') +
				'been absolved of their shame'
			);
			const shamedUsers = db.getData('/shame/' + channelId);
			const newShamedUsers = shamedUsers
				.filter(user => !usersToUnshame.map(user => user.id).includes(user.id));
			db.push('/shame/' + channelId, newShamedUsers, true);
		} else {
			sendMessage('I don\'t see a user to unshame.');
		}
	} catch (e) {
		logError(e);
		sendMessage('There was an error');
	}
}

module.exports=run;
