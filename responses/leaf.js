const run = ({messageText, react}) => {
	// Fix for issue displaying response to invisible numbers.
	const cleanText = messageText.replace(/<[^>]*>/g, '');
	if (cleanText.includes('420')) {
		react('🍁');
	}
	return false;
}

module.exports=run;
