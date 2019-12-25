const run = ({messageText, sendMessage}) => {
	const tokens = messageText.trim().split(' ');
	if (tokens.length === 1 && tokens[0].toLowerCase() === 'roll') {
		rollDice('1d6', sendMessage);
		return true;
	} else if (tokens.length > 1 && tokens[0].toLowerCase() === 'roll') {	
		tokens.slice(1).map(dieExpression => rollDice(dieExpression, sendMessage));
		return true;
	} else {
		return false;
	}
}

const rollDice = (dieExpression, sendMessage) => {
	const match = dieExpression.match(/^([0-9]*)[dD]([0-9]+)$/);
	if (!match) {
		sendMessage(`error parsing: ${dieExpression}`);
		return;
	}
	const count = +(match[1] || 1);
	const size = +(match[2]);
	if (size === 0) {
		sendMessage('No.');
		return;
	}
	sendMessage(
		`Rolling ${count}d${size}...`
	)
	const results = [];
	for (let i=0; i<count; i++) {
		results[i] = rollDie(size);
	}
	sendMessage(
		(results.length > 100 ? '' : `Results: ${results.join(', ')}\n`) +
		(results.length === 1 ? '' : `Total: ${results.reduce((x,y) => x + y, 0)}`)
	)
}

const rollDie = (n) => Math.floor(Math.random() * n) + 1;

module.exports=run;
