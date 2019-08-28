const run = ({messageText, sendMessage}) => {
	// Fix for issue displaying response to invisible 69s.
	const cleanText = messageText.replace(/<[^>]*>/g, '');
	if (cleanText.includes('69')) {
		sendMessage('Nice!');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
