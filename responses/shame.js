const run = ({react, sendMessage, message, db}) => {
	const userId = message.author.id;
	const channelId = message.channel.id;
	if (getShamedUsers(channelId, db).includes(userId)) {
		shame(sendMessage, react);
		return true;
	} else {
		return false;
	}
}

const getRandInt = (n) => Math.floor(Math.random() * Math.floor(n));

const shame = (sendMessage, react) => {
	const responses = [
		() => react('😠'), // angry
		() => react('😠'), // angry
		() => react('👎'), // thumbs down
		() => react('👎'), // thumbs down
		() => react('🙅'), // person gesturing no
		() => react('🙅'), // person gesturing no
		() => react('🖕'), // middle finger
		() => react('🖕'), // middle finger
		() => sendMessage('No.'),
		() => sendMessage('Go to hell.'),
		() => sendMessage('Your contributions are unappreciated.')
	];
	responses[getRandInt(responses.length)]();
}
		
const getShamedUsers = (channelId, db) => {
	try {
		return db.getData('/shame/' + channelId).map(user => user.id);
	} catch (e) {
		return [];
	}
}


module.exports=run;
