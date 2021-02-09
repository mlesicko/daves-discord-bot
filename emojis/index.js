const { logError } = require('../errorLogging.js');

/**
* This is for tracking emoji usage. We want to make sure we aren't wasting
* emoji slots on emojis we aren't using.
**/


const run = (state) => {
	track(state)
}

const track = ({reaction, db}) => {
	guild = reaction.message.channel.guild;
	if (guild) {
		emoji_id = reaction._emoji.id;
		emoji = guild.emojis.get(emoji_id);
		if (emoji) {
			update_database(db, guild.id, guild.emojis, emoji);
		}
	}
}

const update_database = (db, guild_id, guild_emojis, emoji) => {
	const path = '/emojis/' + guild_id;
	try {
		// Prep the database in case this is the first time
		db.push(path, {}, false);
		const emoji_db = db.getData(path);
		const updated_db = {};
		for ([guild_emoji_id, guild_emoji] of guild_emojis) {
			if (guild_emoji_id in emoji_db) {
				if (guild_emoji_id === emoji.id) {
					// This is the emoji, and we have seen it before: increment
					updated_db[guild_emoji_id] = {
						...emoji_db[guild_emoji_id],
						'count': emoji_db[guild_emoji_id]['count'] + 1,
						'last_used': Date.now()
					};
				} else {
					// This emoji has been seen before and needs no update
					updated_db[guild_emoji_id]= emoji_db[guild_emoji_id];
				}
			} else {
				if (guild_emoji_id === emoji.id) {
					// This is the first time we're seeing this emoji
					updated_db[guild_emoji_id] = {
						'name': guild_emoji.name,
						'count': 1,
						'last_used': Date.now()
					};
				} else {
					// This emoji is new to the guild, and has never been used
					updated_db[guild_emoji_id] = {
						'name': guild_emoji.name,
						'count': guild_emoji_id === emoji.id ? 1 : 0,
						'last_used': null
					};
				}
			}
		}
		db.push(path, updated_db, true);
	} catch(e) {
		logError(e);
	}
}

module.exports=run;
