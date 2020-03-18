const _ = require('lodash');

const run = ({messageText, sendMessage, message, myId}) => {
	const tokens = messageText.split(' ');
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	const channelId = message.channel.id;
	const channelState = state[channelId];
	const playerId = message.author.id;
	if ((token0 === 'blackjack') ||
			(token0 === 'play-blackjack') ||
			(token0 === 'play' && token1 === 'blackjack')) {
		startGame(
			channelId,
			getPlayers(message, myId),
			sendMessage
		);
		return true;
	} else if (token0 === 'hit') {
		checkIfActivePlayerFirst(
			channelState,
			playerId,
			sendMessage,
			() => {
				handleHit(channelState, sendMessage);
			}
		);
		return true;
	} else if (token0 === 'stay') {
		checkIfActivePlayerFirst(
			channelState,
			playerId,
			sendMessage,
			() => {
				handleStay(channelState, sendMessage);
			}
		);
		return true;
	} else if (token0 === 'blackjack-skip') {
		handleStay(channelState, sendMessage);
		return true;
	} else {
		return false;
	}
}

const getPlayers = (message, myId) => {
	const players = message.mentions.users
		.filter((user) => user.id !== myId)
		.map((user) => ({
			id: user.id,
			name: user.username
		}));
	if (players.length) {
		return players;
	} else {
		return [{
			id: message.author.id,
			name: message.author.username
		}];
	}
}

const checkIfActivePlayerFirst = (
		channelState,
		playerId,
		sendMessage,
		f) => {
	if (!channelState) {
		sendMessage('I don\'t have an active blackjack game right now.');
	} else if (!isActivePlayer(channelState, playerId)) {
		sendMessage('It\'s not your turn!');
	} else {
		f();
	}
}

const state = {}

const cardValues = [
	{ name: 'A', points: 1},
	{ name: '2', points: 2},
	{ name: '3', points: 3},
	{ name: '4', points: 4},
	{ name: '5', points: 5},
	{ name: '6', points: 6},
	{ name: '7', points: 7},
	{ name: '8', points: 8},
	{ name: '9', points: 9},
	{ name: '10', points: 10},
	{ name: 'J', points: 10},
	{ name: 'Q', points: 10},
	{ name: 'K', points: 10}
];

const cardSuits = ['♤','♧','♢','♡'];

const allCards = cardValues.flatMap(
	(value) => cardSuits.map(
		(suit) => ({value, suit})
	)
);

const shuffleDeck = () => _.shuffle(allCards);

const dealHand = (deck) => [deck.slice(0,2), deck.slice(2)];

const dealCard = (deck) => [deck.slice(0,1)[0], deck.slice(1)];

const createInitialState = (channelId, players) => {
	let deck = shuffleDeck();
	let hand;
	const createdPlayers = players.map((player) => {
		[hand, deck] = dealHand(deck);
		return {
			id: player.id,
			name: player.name,
			hand
		};
	});
	let dealer;
	[dealer, deck] = dealHand(deck);
	state[channelId] = {
		channelId,
		players: createdPlayers,
		dealer,
		deck,
		activePlayer: 0
	};
}

const clearChannelState = (channelId) => {
	state[channelId] = undefined;
}

const isActivePlayer = (channelState, playerId) => {
	if (channelState) {
		const active = channelState.players[channelState.activePlayer];
		if (active) {
			return active.id === playerId;
		}
	}
	return false;
}

const getPointValue = (hand) => {
	const baseValue = hand
		.map((card) => card.value.points)
		.reduce((x,y) => x+y, 0);
	if (
		baseValue <= 11 &&
		hand.filter((card) => card.value.name === 'A').length
	) {
		return baseValue + 10;
	} else {
		return baseValue;
	}
}

const renderHand = (name, hand) => {
	return `${name}: ${hand.map(
		(card) => `[${card.value.name}${card.suit}]`
	).join(' ')}   (${getPointValue(hand)})`;
}

const renderState = (channelState) => {
	const playerHandsRendered = channelState.players.map(
		(player) => renderHand(player.name, player.hand)
	);
	const showDealerHand =
		channelState.activePlayer >= channelState.players.length;
	const dealerHand = showDealerHand ?
		channelState.dealer :
		[
			channelState.dealer[0],
			{
				value: {name: '   ', points: 0},
				suit: '   '
			}
		]
	const dealerHandRendered = renderHand('Dealer', dealerHand);
	return playerHandsRendered.join("\n") + '\n' + dealerHandRendered;
}

const startGame = (channelId, players, sendMessage) => {
	createInitialState(channelId, players);
	const channelState = state[channelId];
	sendMessage(renderState(channelState));
	askOrAdvance(channelState, sendMessage);
}

const handleHit = (channelState, sendMessage) => {
	const active = channelState.players[channelState.activePlayer];
	const [newCard, newDeck] = dealCard(channelState.deck);
	channelState.deck = newDeck;
	active.hand.push(newCard);
	sendMessage(renderState(channelState));
	askOrAdvance(channelState, sendMessage);
}

const handleStay = (channelState, sendMessage) => {
	advanceActivePlayer(channelState, sendMessage);
}

const askOrAdvance = (channelState, sendMessage) => {
	const active = channelState.players[channelState.activePlayer];
	if (getPointValue(active.hand) < 21) {
		sendMessage(`${active.name}, hit or stay?`);
	} else {
		advanceActivePlayer(channelState, sendMessage);
	}
}

const advanceActivePlayer = (channelState, sendMessage) => {
	channelState.activePlayer++;
	if (channelState.activePlayer >= channelState.players.length) {
		handleDealer(channelState, sendMessage);
	} else {
		askOrAdvance(channelState, sendMessage);
	}
}

const handleDealer = (channelState, sendMessage) => {
	if (channelState.players.some(
		(player) => getPointValue(player.hand) < 22
	)) {
		const dealerHand = channelState.dealer;
		while (getPointValue(dealerHand) < 17) {
			const [newCard, newDeck] = dealCard(channelState.deck);
			channelState.deck = newDeck;
			dealerHand.push(newCard);
		}
		sendMessage(renderState(channelState));
	}
	clearChannelState(channelState.channelId);
}

module.exports=run;
