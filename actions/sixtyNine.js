const run = ({messageText, actions}) => {
	const {sendMessage} = actions;
	// Fix for issue displaying response to invisible 69s.
	const cleanText = messageText.replace(/<[^>]*>/g, '');
	if (messageText.includes('69')) {
		sendMessage('Nice!');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
