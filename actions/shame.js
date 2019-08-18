const run = ({actions, message, db}) => {
	const { react, sendMessage } = actions;
	const userId = message.author.id;
	if (getShamedUsers(db).includes(userId)) {
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
		
const getShamedUsers = (db) => {
	try {
		return db.getData('/shame').map(user => user.id);
	} catch (e) {
		return [];
	}
}


module.exports=run;
