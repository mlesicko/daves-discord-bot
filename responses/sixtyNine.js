const run = ({messageText, sendMessage, react, channel}) => {
	// Fix for issue displaying response to invisible 69s.
	const cleanText = messageText.replace(/<[^>]*>/g, '');
	if (cleanText.includes('69')) {
		sendNice(channel, react, sendMessage);
	}
	return false;
}

const sendNice = (channel, react, sendMessage) => {
	const nice = channel?.guild?.emojis?.cache?.find?.(e => e.name === 'nice');
	if (nice) {
		react(nice)
			.catch((e) => sendMessage('Nice!'));
	} else {
		sendMessage('Nice!');
	}
}

module.exports=run;
