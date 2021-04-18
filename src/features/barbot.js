const BarbotPlayers = require('@schemas/barbot/players');
const BarbotLogs = require('@schemas/barbot/logs');

const discount = 0;
const discountReason = 'none';

const products = {
  shield: {
    name: '🛡️ Shield',
    price: 2500
  },
  ticket: {
    name: '🎟️ Lotto Ticket',
    price: 200
  }
}

module.exports.discount = discount;
module.exports.discountReason = discountReason;
module.exports.products = products;

module.exports.addLogs = async (memberId, channelId, guildId, text) => {
  return await BarbotLogs({ memberId, channelId, guildId, text }).save();
}

module.exports.isRegistered = async (_id) => {
  return await BarbotPlayers.findOne({ _id }) == null ? false : true;
}

module.exports.registerUser = async (_id) => {
  return await BarbotPlayers({ _id }).save();
}

module.exports.findUser = async (_id) => {
  return await BarbotPlayers.findOne({ _id });
}

module.exports.getBalance = async (_id) => {
  const result = await BarbotPlayers.findOne({ _id });

  if (result != null) {
    return {
      userCoins: result.coins,
      userShields: result.shields,
      userLottoTickets: result.lottoTickets
    };
  } else return undefined;
}

module.exports.addCoins = async (_id, value) => {
  const query = {
    $inc: {
      coins: value
    }
  };

  const result = await BarbotPlayers.findOneAndUpdate({ _id }, query, { new: true });

  if (result == null) {
    return undefined;
  }

  return result.coins;
}

module.exports.addShields = async (_id, value) => {
  const query = {
    $inc: {
      shields: value
    }
  };

  const result = await BarbotPlayers.findOneAndUpdate({ _id }, query, { new: true });

  if (result == null) {
    return undefined;
  }

  return result.shields;
}

module.exports.addLottoTickets = async (_id, value) => {
  const query = {
    $inc: {
      lottoTickets: value
    }
  };

  const result = await BarbotPlayers.findOneAndUpdate({ _id }, query, { new: true });

  if (result == null) {
    return undefined;
  }

  return result.lottoTickets;
}