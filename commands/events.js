const chrono = require('chrono-node');

const run = ({messageText, sendMessage, db, message, myId, log}) => {
	const tokens = messageText.split(' ');
	const channelId = message.channel.id;
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	if (token0 === 'create-event') {
		createEvent(channelId, sendMessage, db, tokens.slice(1).join(' '), log);
		return true;
	} else if (token0 === 'create' && token1 === 'event') {
		createEvent(channelId, sendMessage, db, tokens.slice(2).join(' '), log);
		return true;
	} else if (token0 === 'event' || token0 === 'events' ||
				token0 === 'list-events' || 
				(token0 === 'list' && token1 === 'events' )) {
		listEvents(channelId, sendMessage, db, log);
		return true;
	} else if (token0 === 'delete-event' || token0 === 'delete-events') {
		deleteEvents(channelId, sendMessage, db, tokens.slice(1), log);
		return true;
	} else if (token0 === 'delete' && (token1 === 'event' || token1 === 'events')) {
		deleteEvents(channelId, sendMessage, db, tokens.slice(2), log);
		return true;
	} else {
		return false;
	}
}

const createEvent = (channelId, sendMessage, db, message, log) => {
	try {
		const alarmTime = chrono.parseDate(message, new Date(), {forwardDate: true});
		if (alarmTime.getTime() <= Date.now()) {
			sendMessage(
				'Error: That time is the past. Please only create future events'
			);
		} else {;
			sendMessage(
				`Creating event for ${alarmTime}.`
			);
			db.push('/events/' + channelId, [{
				prefix: 'Scheduled event: ',
				message,
				time: alarmTime.getTime()
			}], false);
		}
	} catch (e) {
		log(e);
		sendMessage('There was an error');
	}
}

const listEvents = (channelId, sendMessage, db, log) => {
	const events = getEvents(channelId, db);
	if (events.length === 0) {
		sendMessage('No upcoming events in this channel.');
	} else {
		const message = getEvents(channelId, db)
			.map((e, idx) => `${idx + 1}. ${e.message}`).join('\n');
		sendMessage('Upcoming events:\n' + message);
	}
}

const deleteEvents = (channelId, sendMessage, db, toDelete, log) => {
	const events = getEvents(channelId, db);
	let errorFlag = false;
	toDelete.forEach((deleteIndex) => {
		if (events[deleteIndex - 1] != undefined) {
			events[deleteIndex - 1] = null;
		} else {
			errorFlag = true;
		}
	});
	const updatedEvents = events.filter((e) => e != null);
	if (errorFlag) {
		sendMessage('Please specify the events to be deleted by their numbers.');
	} else if (events.length === updatedEvents.length) {
		sendMessage('No events deleted');
	} else {
		db.push('/events/' + channelId, updatedEvents, true);	
		listEvents(channelId, sendMessage, db, log);
	}
}

const getEvents = (channelId, db) => {
	try {
		return db.getData('/events/' + channelId)
			.sort((e1, e2) => e1.time - e2.time);
	} catch (e) {
		return [];
	}
}

module.exports=run;
