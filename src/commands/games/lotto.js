const { SendErrorMsg } = require('@utils/functions');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { Command } = require('discord.js-commando');
const { banutz } = require('@utils/emojis.json');
const barbot = require('@features/barbot');
const Players = require('@schemas/barbot/players');
const humanizeDuration = require('humanize-duration');

const reward = 50000;

const humanizeSettings = {
	largest: 2,
	round: true,
	conjunction: ' and ',
	serialComma: false
};

module.exports = class LottoCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'lotto',
      memberName: 'lotto',
      aliases: ['lottoticket', 'lottotickets', 'lotto-ticket', 'lotto-tickets'],
      description: `try your luck to win ${reward.toLocaleString()}. With 1% chance and one lotto ticket you can win.`,
      details: 'lotto',

      group: 'games',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message) {
    const { author, channel, guild } = message;
    const result = await Players.findOne({ _id: author.id });

    if(result == undefined) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    const then = new Date(result.lottoWinDelay).getTime();
    const now = new Date().getTime();

    const diffTime = 43200000 - Math.abs(then - now);

    if(diffTime > 0) {
      return SendErrorMsg(message, `you can try your luck again in ${humanizeDuration(diffTime, humanizeSettings)}.`);
    }

    if(!result.lottoTickets) {
      return SendErrorMsg(message, `you don't have a lotto ticket, use ${message.anyUsage('buy lotto-ticket')} to buy one.`);
    }

    const chance = Math.floor(Math.random() * 100);

    if(chance < 1) {
      barbot.addCoins(author.id, reward).then(async (balance) => {
        await barbot.addLogs(author.id, channel.id, guild.id, `won $${reward.toLocaleString()} at lottery prize`);
        await barbot.addLottoTickets(author.id, -1);

        await Players.findOneAndUpdate({
          _id: author.id
        }, {
          $inc: {
            lottoWinTimes: 1
          },
          lottoWinDelay: now
        });

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('🎲 Lotto')
          .setDescription(`**${author.username}** you won the lotto prize. You had 1% chance and you got it.\nPrize: ${reward.toLocaleString()}${banutz}`);
        
        channel.send(embed);
      });
    }
    else {
      barbot.addLottoTickets(author.id, -1).then(async (lottoTickets) => {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('🎲 Lotto')
          .setDescription(`**${author.username}** you didn't won. You have ${lottoTickets}x more :tickets: \`${lottoTickets != 1 ? 'Lotto Tickets' : 'Lotto Ticket'}\`.`);
    
        channel.send(embed);
      });
    }
  }
}