const { Command }         = require('discord.js-commando');
const { SendUsageMsg }    = require('@utils/functions');

module.exports = class ChooseCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'choose',
      memberName: 'choose',
      group: 'misc',
      description: 'Choose between options',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }
  
  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, 'choose [options (separated by a comma)]');
    
    const result = args.split(', ');
    const msgOptions = [
      "I'll choose this:",
      "This is a good option:",
      "That is hard, but i'll choose this:",
      "This is the best option:"
    ];

    message.channel.send(`${msgOptions[Math.floor(Math.random() * msgOptions.length)]} **${result[Math.floor(Math.random() * result.length)]}**`);
  }
}