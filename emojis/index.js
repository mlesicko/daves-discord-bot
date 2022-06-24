const { logError } = require('../errorLogging.js');

/**
* This is for tracking emoji usage. We want to make sure we aren't wasting
* emoji slots on emojis we aren't using.
**/


const track_react = ({reaction, db}) => {
	emoji_id = reaction.emoji.id;
	guild = reaction.message.channel.guild;
	guild?.emojis?.fetch()?.then((emojis) => {
		if (emojis.get(emoji_id)) {
			update_database(db, guild.id, emojis, [emoji_id]);
		}
	})?.catch(e => logError(e));
}

const track_message = ({message, db}) => {
	guild = message.channel.guild;
	guild?.emojis?.fetch()?.then((emojis) => {
		emoji_ids = [...message.content.matchAll(/<:.+?:(\d+)>/g)].map(e => e[1]);
		tracked_emoji_ids = emoji_ids.filter(emoji => emojis.get(emoji));
		if (tracked_emoji_ids.length > 0) {
			update_database(db, guild.id, emojis, tracked_emoji_ids);
		}
	})?.catch(e => logError(e));
}

const update_database = (db, guild_id, guild_emojis, emoji_ids) => {
	const path = '/emojis/' + guild_id;
	try {
		// Prep the database in case this is the first time
		db.push(path, {}, false);
		const emoji_db = db.getData(path);
		const updated_db = {};
		for ([guild_emoji_id, guild_emoji] of guild_emojis) {
			if (guild_emoji_id in emoji_db) {
				if (emoji_ids.includes(guild_emoji_id)) {
					// This is the emoji, and we have seen it before: increment
					updated_db[guild_emoji_id] = {
						'name': guild_emoji.name,
						'count': emoji_db[guild_emoji_id]['count'] + 1,
						'last_used': Date.now()
					};
				} else {
					// This emoji has been seen before and needs no update
					updated_db[guild_emoji_id]= {
						...emoji_db[guild_emoji_id],
						'name': guild_emoji.name
					}
				}
			} else {
				if (emoji_ids.includes(guild_emoji_id)) {
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
						'count': 0,
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

module.exports={track_react, track_message};
