const run = (state) => {
    const tokens = state.messageText.split(' ');
    const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	if (token0 === 'uwu' || token0 === 'owo') {
		makeMessageUwu(state, tokens.slice(1).join(' '));
		return true;
	} else {
		return false;
	}
}

const makeMessageUwu = (state, messageText) => {
	const uwuTransform = (m) => 
		m
		.replace(/l|r/g, 'w')
		.replace(/L|R/g, 'W')
		.replace(/no/g, 'nyo')
		.replace(/No/g, 'Nyo')
		.replace(/NO/g, 'NYO')
	state.applyTransformFn(uwuTransform);
	state.messageText = messageText;
}

module.exports=run;
