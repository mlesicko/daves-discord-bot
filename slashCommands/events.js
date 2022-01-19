const chrono = require('chrono-node');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { logError } = require('../errorLogging.js');

const data = new SlashCommandBuilder()
	.setName("events")
	.setDescription("Calendar event")
	.addSubcommand(subcommand => subcommand
		.setName("list")
		.setDescription("List upcoming events")
		.addChannelOption(option => 
			option.setName("channel")
				.setDescription("What channel's events to list")))
	.addSubcommand(subcommand => subcommand
		.setName("add")
		.setDescription("Add a calendar event")
		.addStringOption(option =>
			option.setName("event")
				.setDescription("The event information")
				.setRequired(true))
		.addStringOption(option =>
			option.setName("date")
				.setDescription("When the event should fire")
				.setRequired(true))
		.addChannelOption(option =>
			option.setName("channel")
				.setDescription("What channel to fire this event on")))
	.addSubcommand(subcommand => subcommand
		.setName("delete")
		.setDescription("Delete a calendar event")
		.addIntegerOption(option =>
			option.setName("index")
				.setDescription("Which event to delete")
				.setRequired(true))
		.addChannelOption(option =>
			option.setName("channel")
				.setDescription("What channel to delete an event from")))
	.toJSON();

const run = ({interaction, db}) => {
	const channel = interaction.options.getChannel("channel");
	const channelId = channel?.id ?? interaction.channelId;
	const eventInfo = interaction.options.getString("event");
	const date = interaction.options.getString("date");
	const eventIndex = interaction.options.getInteger("index");
	const subcommand = interaction.options.getSubcommand();
	let response = "Error handling request";
	if (subcommand === "list") {
		response = listEvents(channelId, db);
	} else if (subcommand === "add") {
		response = addEvent(eventInfo, date, channelId, db);
	} else if (subcommand === "delete") {
		response = deleteEvent(eventIndex, channelId, db);
	}
	interaction.reply(response);
}

const listEvents = (channelId, db) => {
	const events = getEvents(channelId, db);
	if (events.length === 0) {
		return "No upcoming events.";
	} else {
		const message = getEvents(channelId, db)
			.map((e, idx) => 
				`${idx + 1}. ` +
				`${e.message} ` +
				`at ${new Date(e.time).toLocaleString()}`
			).join('\n');
		return message;
	}
}

const addEvent = (eventInfo, date, channelId, db) => {
	let eventTime = null;
	try {
		eventTime = chrono.parseDate(date, new Date(), {forwardDate: true});
	} catch (e) {}
	if (eventTime === null) {
		return `Error: could not understand the date: ${date}`;
	} else if (eventTime.getTime() <= Date.now()) {
		return (
			"Error: That time is in the past. " +
			"Please only create future events."
		);
	} else {
		db.push('/events/' + channelId, [{
			prefix: 'Scheduled event: ',
			message: eventInfo,
			time: eventTime.getTime()
		}], false);
		return `Creating event for ${eventTime.toLocaleString()}.`
	}
}

const deleteEvent = (eventIndex, channelId, db) => {
	const events = getEvents(channelId, db);
	if (eventIndex > 0 && eventIndex <= events.length) {
		const deletedEvent = events.splice(eventIndex - 1, 1)[0];
		db.push('/events/' + channelId, events, true);
		return `Deleted event: ${deletedEvent.message}`;
	} else {
		return "No such event exists.";
	}
}

const getEvents = (channelId, db) => {
	try {
		return db.getData('/events/' + channelId)
			.sort((e1, e2) => e1.time - e2.time);
	} catch (e) {
		logError(e);
		return [];
	}
}


module.exports={ run, data };
