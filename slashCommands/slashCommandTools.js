const with_silent = (command) => 
	command.addBooleanOption(option =>
		option.setName("silent")
			.setDescription("Set to true to perform action privately")
			.setRequired(false))

const apply_silent = (interaction, response) => {
	const silent = !!(interaction.options.getBoolean("silent"));
	if (typeof(response) === "object" && "ephemeral" in response) {
		return {
			...response,
			ephemeral: response.ephemeral || silent
		};
	} else if (typeof(response) === "object") {
		return {
			...response,
			ephemeral: silent
		};
	} else {
		return {
			content: response,
			ephemeral: silent
		};
	}
}

const with_transform = (command) =>
	command.addStringOption(option =>
		option.setName("transform")
			.setDescription("A transformation to apply to the output")
			.addChoice("mocking", "mocking")
			.addChoice("uwu", "uwu")
			.setRequired(false))

const apply_transform = (interaction, response) => {
	const _apply_transform = (transform) => {
		if (typeof(response) === "object") {
			return {
				...response,
				content: transform(response.content)
			};
		} else {
			return transform(response);
		}
	}

	const mocking = (s) => s.split("")
		.map((c,i) => i%3 ? c.toLowerCase() : c.toUpperCase())
		.join("");

	const uwu = (s) => s
		.replace(/l|r/g, 'w')
		.replace(/L|R/g, 'W')
		.replace(/no/g, 'nyo')
		.replace(/No/g, 'Nyo')
		.replace(/NO/g, 'NYO');

	const transform = interaction.options.getString("transform");
	switch (transform) {
		case "mocking": return _apply_transform(mocking);
		case "uwu": return _apply_transform(uwu);
		default: return response;
	}
}

module.exports = {
	with_silent,
	apply_silent,
	with_transform,
	apply_transform
}
