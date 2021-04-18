const { Command } = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg } = require('@utils/functions');

module.exports = class ClearChatCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'clearchat',
      memberName: 'clearchat',
      aliases: ['cc', 'purge'],
      group: 'moderation',
      description: 'use to remove an amount of lines from a text channel.',
      details: 'clearchat <amount of messages>',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 15
      },

      clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES']
    });
  }

  async run(message, args) {
    if(isNaN(args))
      return SendUsageMsg(message, this.details);

    let messages = parseInt(args);
    
    if(messages < 1 || messages > 100)
      return SendErrorMsg(message, 'you can\'t delete less than 1 message or more than 100 messages.');
    
    const { channel } = message;

    if(message.deletable) {
      await message.delete({ timeout: 100 }).then(async () => {
        await channel.messages.fetch({ limit: messages }).then(async m => {
          await channel.bulkDelete(m, true).then(async (m) => {
            await channel.send(`♻ ${m.size} ${m.size == 1 ? 'message' : 'messages'} has been deleted.`).then(m => {
              m.delete({ timeout: 5000 }).catch(err => console.error(err.message));
            });
          }).catch(err => {
            SendErrorMsg(message, 'i can\'t delete this messages.');
            console.error(err.message);
          });
        });
      });
    }
  }
}