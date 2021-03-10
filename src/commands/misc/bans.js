const { MessageEmbed }            = require('discord.js');
const { Command }                 = require('discord.js-commando');
const { discord }                 = require('@utils/colors.json');
const { SendErrorMsg }            = require('@utils/functions');

module.exports = class BansCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bans',
      memberName: 'bans',
      group: 'misc',
      description: 'Displays banned members in current guild',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }
  
  async run(message) {
    const { guild, channel } = message;

    const banList = await guild.fetchBans().catch(err => {
      SendErrorMsg(message, err.message);
      console.error(err);
    });

    if(!banList.size)
      return SendErrorMsg(message, "there are no bans here.");

    banList.forEach(element => {
      channel.send(`\`${element.user.username}#${element.user.discriminator}\` is banned for: \`${element.reason == null ? `no reason` : element.reason}\`.`);
    });

    channel.send(`There are ${banList.size} banned members in this guild.`);
  }
}