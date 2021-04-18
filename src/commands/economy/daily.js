const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag, banutz } = require('@utils/emojis.json');
const { SendErrorMsg } = require('@utils/functions');
const humanizeDuration = require('humanize-duration');
const Players = require('@schemas/barbot/players');
const barbot = require('@features/barbot');

const humanizeSettings = {
  largest: 2,
  round: true,
  conjunction: ' and ',
  serialComma: false
};

module.exports = class DailyCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      memberName: 'daily',
      aliases: ['dailyreward', 'daily-reward'],
      description: 'use to get a daily reward, the reward can be between 2,000 and 2,500 coins.',
      details: 'daily',

      group: 'economy',

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
    
    let result = await Players.findOne({
      _id: author.id
    });

    if(result == null) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    const then = new Date(result.dailyLast).getTime();
    const now = new Date().getTime();

    const diffTime = 86400000 - Math.abs(then - now);
  
    if(diffTime > 0) {
      return SendErrorMsg(message, `you can claim your daily reward in ${humanizeDuration(diffTime, humanizeSettings)}.`);
    }

    const reward = 2000 + Math.floor(Math.random() * 500);
    
    barbot.addCoins(author.id, reward).then(async (coins) => {
      await barbot.addLogs(author.id, channel.id, guild.id, `won $${reward.toLocaleString()} at daily reward`);

      result = await Players.updateOne({
        _id: author.id
      }, {
        $inc: {
          dailyTimes: 1
        },
        dailyLast: now
      });
      
      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${euro_bag} Daily Reward`)
        .setDescription(`**${author.username}** got ${reward.toLocaleString()}${banutz} from daily reward.`);

      channel.send(embed);
    });
  }
}