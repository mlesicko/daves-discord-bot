const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');
const { getRandInt } = require('../utils.js');

const data = new SlashCommandBuilder()
	.setName("mute")
	.setDescription("Mute the bot's reactions.")
	.addStringOption(option => 
		option.setName("setting")
			.setDescription("set mute on or off")
			.addChoice("on", "on")
			.addChoice("off", "off")
			.setRequired(true))
	.toJSON();

const run = ({interaction, db}) => {
	const setting = interaction.options.getString("setting");
	let response = "";
	if (setting === "on") {
		response = mute(db);
	} else if (setting === "off") {
		response = unmute(db);
	} else {
		response = "Error handling request";
	}
	interaction.reply(response);
}

const mute = (db) => {
	if (get_mute(db)) {
		return "I was already muted.";
	} else {
		set_mute(db, true);
		return "OK, I'll shut up.";
	}
}

const unmute = (db) => {
	if (get_mute(db)) {
		set_mute(db, false);
		return "I'm here!";
	} else {
		return "I wasn't muted.";
	}
}

const get_mute = (db) => {
	try {
		return db.getData('/muted');
	} catch (e) {
		return false;
	}
}

const set_mute = (db, value) => {
	db.push('/muted', value, false);
}

module.exports={ run, data };
