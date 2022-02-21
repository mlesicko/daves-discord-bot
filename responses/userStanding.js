const { logError } = require('../errorLogging.js');

const run = ({react, sendMessage, message, db}) => {
	const userId = message.author.id;
	const channelId = message.channel.id;
	const userStanding = getUserStanding(channelId, userId, db);
	if (userStanding > 0) {
		praise(sendMessage, react, message.author.username);
		return true;
	} else if (userStanding < 0) {
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

const praise = (sendMessage, react, username) => {
	const responses = [
		() => react('👍'), //thumbs up
		() => react('👍'), //thumbs up
		() => react('🙏'), //praise hands
		() => react('🙏'), //praise hands
		() => react('🙆'), //person gesturing ok
		() => react('❤️'), //heart
		() => react('☝️'), //pointing up
		() => sendMessage("Your contributions are appreciated."),
		() => sendMessage(`${username}, you're doing a heck of a job.`),
		() => sendMessage(`Long live ${username}! Praise them with great praise!`),
	]
	responses[getRandInt(responses.length)]();
}
		
const getUserStanding = (channelId, userId, db) => {
	try {
		const standing = db.getData('/user_standing');
		return standing?.[channelId]?.[userId] ?? 0;
	} catch (e) {
		return 0;
	}
}


module.exports=run;
