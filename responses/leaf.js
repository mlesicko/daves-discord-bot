const run = ({messageText, react, channel}) => {
	// Fix for issue displaying response to invisible numbers.
	const cleanText = messageText.replace(/<[^>]*>/g, '');
	if (cleanText.includes('420')) {
		sendLeaf(channel, react);
	}
	return false;
}

const sendLeaf = (channel, react) => {
	const weed = channel?.guild?.emojis?.cache?.find?.(e => e.name === 'weed');
	if (weed) {
		react(weed);
	} else {
		react('🍁');
	}
}

module.exports=run;
