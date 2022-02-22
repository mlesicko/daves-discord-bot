const run = ({db, messageText, sendMessage}) => {
	const trimmed = messageText.trim();
	return isPossibleMacro(trimmed) ?
		resolveMacro(db, trimmed, sendMessage) :
		false;
}

const isPossibleMacro = (s) => s.length > 0 && s[0] === '!' && !s.includes(' ');

const resolveMacro = (db, macro, sendMessage) => {
	try {
		sendMessage(db.getData(`/macros/${macro}`));
		return true;
	} catch (e) {
		return false;
	}
}

module.exports=run;
