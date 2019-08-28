const run = ({messageText, sendMessage, db, message, myId}) => {
	const tokens = messageText.split(' ');
	if (tokens.length === 1 && tokens[0] === 'shame') {
		getShameList(message.channel.id, sendMessage, db);
		return true;
	} else if (
		tokens.length > 0 && (tokens[0] === 'shame')
	) {
		addShame(sendMessage, db, message, myId);
		return true;
	} else if (
		tokens.length > 0 && (tokens[0] === 'unshame')
	) {
		removeShame(sendMessage, db, message, myId);
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
		sendMessage('No users are currently being shamed in this channel.');
	}
}

const addShame = (sendMessage, db, message, myId) => {
	try {
		const channelId = message.channel.id;
		const usersToShame = message.mentions.users
			.filter(user => user.id !== myId)
			.map(user => ({
				id: user.id,
				username: user.username
			}));
		sendMessage(
			usersToShame.map(user => user.username).join(' ') + 
			(usersToShame.length === 1 ? ' has ' : ' have ') +
			'shame'
		);
		db.push('/shame/' + channelId, usersToShame, false);
	} catch (e) {
		console.log(e);
		sendMessage('There was an error');
	}
}

const removeShame = (sendMessage, db, message, myId) => {
	try {
		const channelId = message.channel.id;
		const usersToUnshame = message.mentions.users
			.filter(user => user.id !== myId)
			.map(user => ({
				id: user.id,
				username: user.username
			}));
		sendMessage(
			usersToUnshame.map(user => user.username).join(' ') + 
			(usersToUnshame.length === 1 ? ' has ' : ' have ') +
			'been absolved of their shame'
		);
		const shamedUsers = db.getData('/shame/' + channelId);
		const newShamedUsers = shamedUsers
			.filter(user => !usersToUnshame.map(user => user.id).includes(user.id));
		db.push('/shame/' + channelId, newShamedUsers, true);
	} catch (e) {
		console.log(e);
		sendMessage('There was an error');
	}
}

module.exports=run;
