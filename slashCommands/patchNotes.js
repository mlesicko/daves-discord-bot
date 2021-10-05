const description = "Print latest patch notes.";

const run = ({interaction}) => {
	interaction.reply(patchNotes);
}

const patchNotes =
	'2021/10/04\n' +
	'• Slash command to report emoji usage.\n';
	'2021/10/04\n' +
	'• First supported slash command: Patch notes!\n';

module.exports={ description, run };
