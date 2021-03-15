const { Command }         = require('discord.js-commando');
const { SendErrorMsg }    = require('@utils/functions');

module.exports = class UpdateCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'update',
      memberName: 'update',
      group: 'moderation',
      description: 'n-avem',
      argsType: 'multiple',

      guildOnly: true,
      ownerOnly: true,

      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async run(message, args) {
    
  }
}