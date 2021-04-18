const { Command } = require('discord.js-commando');
const { SendErrorMsg } = require('@utils/functions');

module.exports = class BansCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'bans',
      memberName: 'bans',
      description: 'displays banned members in current guild.',
      details: 'bans',
      group: 'misc',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS']
    });
  }
  
  async run(message) {
    const { guild, channel } = message;

    const banList = await guild.fetchBans().catch(err => {
      SendErrorMsg(message, err.message);
      console.error(err);
    });

    if(!banList.size) {
      return SendErrorMsg(message, "there are no bans here.");
    }      

    banList.forEach(element => {
      channel.send(`\`${element.user.username}#${element.user.discriminator}\` is banned for: \`${element.reason == null ? `no reason` : element.reason}\`.`);
    });

    channel.send(`There are ${banList.size} banned members in this guild.`);
  }
}