const run = ({messageText, sendMessage}) => {
	const tokens = messageText.split(' ');
	if (tokens.length > 0 && tokens[0].toLowerCase() === 'echo') {
		const message = tokens.slice(1).join(' ').trim();
		if (message === '') {
			sendMessage('There can be no echo if there is not first a sound.');
		} else {
			sendMessage(message);
		}
		return true;
	} else {
		return false;
	}
}

module.exports=run;
