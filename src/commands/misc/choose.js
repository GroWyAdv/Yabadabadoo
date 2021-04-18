const { Command } = require('discord.js-commando');
const { SendUsageMsg } = require('@utils/functions');

module.exports = class ChooseCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'choose',
      memberName: 'choose',
      group: 'misc',
      description: 'if you\'re undecided, i\'ll help you choose between different options.',
      details: 'choose <options separated by a comma>',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES']
    });
  }
  
  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, this.details);
    
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