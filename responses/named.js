const run = ({messageText, myId, sendMessage}) => {
	if (
		messageText.includes('🅱️ot') ||
		messageText.match(new RegExp(`<@!?${myId}>`))
	) {
		sendMessage('You got something to say to me?');
		return true;
	}
	return false;
}

module.exports=run;
