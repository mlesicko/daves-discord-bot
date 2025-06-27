const run = async ({db, messageText, sendMessage}) => {
	const trimmed = messageText.trim();
	return isPossibleMacro(trimmed) ?
		await resolveMacro(db, trimmed, sendMessage) :
		false;
}

const isPossibleMacro = (s) => s.length > 0 && s[0] === '!' && !s.includes(' ');

const resolveMacro = async (db, macro, sendMessage) => {
	try {
		sendMessage(await db.getData(`/macros/${macro}`));
		return true;
	} catch (e) {
		return false;
	}
}

module.exports=run;
