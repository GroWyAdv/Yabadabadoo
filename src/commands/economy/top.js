const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { discord } = require('@utils/colors.json');
const { SendErrorMsg } = require('@utils/functions');
const { banutz } = require('@utils/emojis.json');

const Players   = require('@schemas/barbot/players');

module.exports = class TopCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'top',
      memberName: 'top',
      description: 'displays the top 10 members who have initiated an account in order by coins.',
      details: 'top',

      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }
  
  async run(message) {
    const results = await Players.find({}).sort({ coins: -1 }).limit(10);

    if(!results.length) {
      return SendErrorMsg(message, `there are no members playing. Use ${message.anyUsage('init')} to be the first in top.`);
    }

    let text = `There are the top **${results.length} members** who initiated an account.\n\n`;
    
    for(let counter = 0; counter < results.length; ++counter) {
      const { _id, coins } = results[counter];
      
      await this.client.users.fetch(_id).then(async (user) => {
        text += `**${counter + 1}. ${user.username}** with $${coins.toLocaleString()}${banutz} in balance.\n`;
      });
    }

    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle('🎲 Top Players')
      .setDescription(text);

    message.channel.send(embed);
  }
}