const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { SendUsageMsg, SendErrorMsg } = require('@utils/functions');
const { banutz } = require('@utils/emojis.json');
const barbot = require('@features/barbot');

module.exports = class CoinFlipCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'coinflip',
      memberName: 'coinflip',
      description: 'use to double your coins with head or tail game.',
      details: 'coinflip <head or tail> <amount of coins to double>',

      argsType: 'multiple',
      group: 'games',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const { author, channel, guild } = message;
    const result = await barbot.findUser(author.id);

    if(result == null) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    const amount = parseInt(args[1]);

    if(!amount || amount <= 0 || (args[0] != 'head' && args[0] != 'tail')) {
      return SendUsageMsg(message, this.details);
    }

    if(amount > 10000) {
      return SendErrorMsg(message, `you can't play more than 10.000${banutz}`)
    }

    if(result.coins < amount) {
      return SendErrorMsg(message, `you don't have ${amount}${banutz}`);
    }

    const coin = Math.floor(Math.random() * 2) + 1;

    let description = '';

    if(coin == 1) {
      if(args[0] == 'head') {
        await barbot.addCoins(author.id, amount).then(async (balance) => {
          await barbot.addLogs(author.id, channel.id, guild.id, `won $${amount.toLocaleString()} at coinflip.`);

          description += `**${author.username}** flipped the coin and fell **Head**.\nHe won ${amount.toLocaleString()}${banutz}`;
        });
      }
      else {
        await barbot.addCoins(author.id, -amount).then(async (balance) => {
          await barbot.addLogs(author.id, channel.id, guild.id, `lost $${amount.toLocaleString()} at coinflip.`);

          description += `**${author.username}** flipped the coin and fell **Head**.\nHe lost ${amount.toLocaleString()}${banutz}`;
        });
      }
    }
    else {
      if(args[0] == 'tail') {
        await barbot.addCoins(author.id, amount).then(async (balance) => {
          await barbot.addLogs(author.id, channel.id, guild.id, `won $${amount.toLocaleString()} at coinflip.`);

          description += `**${author.username}** flipped the coin and fell **Tail**.\nHe won ${amount.toLocaleString()}${banutz}`;
        });
      }
      else {
        await barbot.addCoins(author.id, -amount).then(async (balance) => {
          await barbot.addLogs(author.id, channel.id, guild.id, `lost $${amount.toLocaleString()} at coinflip.`);

          description += `**${author.username}** flipped the coin and fell **Tail**.\nHe lost ${amount.toLocaleString()}${banutz}`;
        });
      }
    }

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle('🎲 Head or Tail')
      .setDescription(description)
      .setImage(coin == 1 ? 'https://imgur.com/4rNRDb1.png' : 'https://imgur.com/rlM6lwJ.png');

    channel.send(embed);
  }
}