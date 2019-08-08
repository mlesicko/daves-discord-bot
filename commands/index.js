const advice = require('./advice.js');
const kys = require('./kys.js');
const help = require('./help.js');
const patchNotes = require('./patchNotes.js');
const names = require('./names.js');
const bugs = require('./bugs.js');
const default_ = require('./default.js');

const commandArray = [
	advice,
	kys,
	help,
	patchNotes,
	names,
	bugs,
	default_
];

const run = (messageText, actions, message) => {
	const selection = commandArray.find(
		(f) => f(messageText, actions, message)
	);
	if (selection) {
		return true;
	} else {
		return false;
	}
}

module.exports=run;
